<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { listWorks, reanalyzeWork, uploadWork, deleteWork } from '@/services/api'

const works = ref([])
const loading = ref(false)
const uploading = ref(false)
const uploadFile = ref(null)

const uploadForm = reactive({
  title: '',
  content: ''
})

const normalizeWorks = (result) => {
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.content)) return result.content
  if (Array.isArray(result?.items)) return result.items
  return []
}

const fetchWorks = async () => {
  loading.value = true
  try {
    works.value = normalizeWorks(await listWorks())
  } catch (error) {
    ElMessage.error(error.message || '读取作品列表失败，请确认后端服务已启动')
  } finally {
    loading.value = false
  }
}

const handleBeforeUpload = (file) => {
  uploadFile.value = file
  return false
}

const submitWork = async () => {
  if (!uploadFile.value && !uploadForm.content) {
    ElMessage.warning('请选择文件，或直接粘贴正文')
    return
  }
  uploading.value = true
  try {
    const saved = await uploadWork({
      file: uploadFile.value,
      title: uploadForm.title,
      content: uploadForm.content
    })
    works.value = [saved, ...(works.value || [])]
    ElMessage.success('已上传并触发后端分析')
    uploadFile.value = null
    Object.assign(uploadForm, { title: '', content: '' })
  } catch (error) {
    ElMessage.error(error.message || '上传失败')
  } finally {
    uploading.value = false
  }
}

const triggerReanalyze = async (row) => {
  try {
    const updated = await reanalyzeWork(row.id)
    const index = works.value.findIndex((w) => w.id === row.id)
    if (index > -1) {
      works.value[index] = updated
    }
    ElMessage.success('重新分析已完成')
  } catch (error) {
    ElMessage.error(error.message || '重新分析失败')
  }
}

const removeWork = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除作品「${row.title}」吗？`, '提示', {
      type: 'warning'
    })
    await deleteWork(row.id)
    works.value = works.value.filter((item) => item.id !== row.id)
    ElMessage.success('已删除')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const formatPercent = (value) => {
  if (value === null || value === undefined) return '--'
  const num = Number(value)
  if (Number.isNaN(num)) return '--'
  const normalized = num > 1 ? num : num * 100
  return `${normalized.toFixed(1)}%`
}

onMounted(fetchWorks)
</script>

<template>
  <div class="works">
    <section class="glass-panel uploader">
      <header>
        <div>
          <p class="eyebrow">WORKFLOW</p>
          <h2>作品上传 · 后端实时入库与分析</h2>
          <p class="muted">
            通过 `/api/works` 上传正文（支持 .txt / .docx），后端立即提取标题、记录元数据并完成分析。
          </p>
        </div>
        <el-button type="success" @click="fetchWorks" :loading="loading">刷新列表</el-button>
      </header>
      <el-form label-position="top" class="upload-form">
        <el-form-item label="作品标题">
          <el-input v-model="uploadForm.title" placeholder="可留空，后端会自动从文件提取" />
        </el-form-item>
        <el-form-item label="粘贴正文（可选）">
          <el-input
            v-model="uploadForm.content"
            type="textarea"
            rows="4"
            placeholder="不方便上传文件时可直接粘贴文本，后端仍走相同分析逻辑"
          />
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-area"
        drag
        action="#"
        :auto-upload="false"
        :before-upload="handleBeforeUpload"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽到此处，或 <em>点击选择</em>（直接转发给后端）
        </div>
        <template #tip>
          <div class="el-upload__tip">支持 .txt / .docx / .zip，10MB 以内</div>
        </template>
      </el-upload>
      <el-button type="primary" :loading="uploading" @click="submitWork">上传并入档</el-button>
    </section>

    <el-card class="glass-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>作品列表（来自 /api/works）</span>
          <span>总计 {{ works.length }} 个</span>
        </div>
      </template>
      <el-table :data="works" v-loading="loading" border>
        <el-table-column label="标题" min-width="200">
          <template #default="{ row }">
            {{ row.title || row.name || row.filename || row.fileName || '未命名' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="updatedAt" label="最近分析" width="180" />
        <el-table-column label="字数" width="120">
          <template #default="{ row }">
            <strong>{{ row.wordCount ?? row.words ?? '--' }}</strong>
          </template>
        </el-table-column>
        <el-table-column label="段落" width="120">
          <template #default="{ row }">
            {{ row.paragraphCount ?? '--' }}
          </template>
        </el-table-column>
        <el-table-column label="对话占比" width="140">
          <template #default="{ row }">
            {{ formatPercent(row.dialogueRatio ?? row.dialoguePercentage) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="triggerReanalyze(row)">重新分析</el-button>
            <el-button text type="danger" @click="removeWork(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.works {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.uploader {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px 20px;
}

.upload-area {
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.muted {
  color: var(--text-muted);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

@media (max-width: 720px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
