<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { analyzeText, listWorks, reanalyzeWork } from '@/services/api'

const loading = ref(false)
const worksLoading = ref(false)
const analysis = ref(null)
const works = ref([])

const textForm = reactive({
  text: '主角在地底赛博城与宿命对抗，团队合作的高潮段落。'
})
const selectedFile = ref(null)
const selectedWorkId = ref(null)

const pickAnalysisPayload = (data) =>
  data?.analysis || data?.analysisResult || data?.result || data

const normalizeWorks = (result) => {
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.content)) return result.content
  if (Array.isArray(result?.items)) return result.items
  return []
}

const keywordList = computed(() => {
  const keywords =
    analysis.value?.keywords ||
    analysis.value?.keywordTop10 ||
    analysis.value?.keywordList ||
    analysis.value?.topKeywords
  if (!keywords) return []
  if (Array.isArray(keywords)) {
    return keywords.map((item) =>
      typeof item === 'string' ? { word: item, weight: null } : item
    )
  }
  return Object.entries(keywords).map(([word, weight]) => ({ word, weight }))
})

const metrics = computed(() => {
  if (!analysis.value) return []
  const data = analysis.value
  const result = []
  const wordCount = data.wordCount ?? data.word_count
  const paragraphCount = data.paragraphCount ?? data.paragraph_count
  const dialogueRatio = data.dialogueRatio ?? data.dialoguePercentage ?? data.dialogue_ratio
  if (wordCount !== undefined) result.push({ label: '字数', value: wordCount })
  if (paragraphCount !== undefined) result.push({ label: '段落数', value: paragraphCount })
  if (dialogueRatio !== undefined) {
    result.push({
      label: '对话占比',
      value: dialogueRatio,
      percent: true
    })
  }
  return result
})

const handleFile = (file) => {
  selectedFile.value = file
  return false
}

const normalizePercent = (value) => {
  if (value === null || value === undefined) return '--'
  const num = Number(value)
  if (Number.isNaN(num)) return '--'
  const normalized = num > 1 ? num : num * 100
  return `${normalized.toFixed(1)}%`
}

const runAnalysis = async () => {
  if (!selectedFile.value && !textForm.text) {
    ElMessage.warning('请上传文件或填写文本')
    return
  }
  loading.value = true
  try {
    analysis.value = pickAnalysisPayload(
      await analyzeText({
        file: selectedFile.value,
        text: textForm.text
      })
    )
    ElMessage.success('分析完成，数据来自后端')
  } catch (error) {
    ElMessage.error(error.message || '分析失败')
  } finally {
    loading.value = false
  }
}

const fetchWorks = async () => {
  worksLoading.value = true
  try {
    works.value = normalizeWorks(await listWorks())
  } catch (error) {
    ElMessage.error(error.message || '获取作品列表失败')
  } finally {
    worksLoading.value = false
  }
}

const analyzeWork = async () => {
  if (!selectedWorkId.value) {
    ElMessage.warning('请选择已上传的作品')
    return
  }
  loading.value = true
  try {
    analysis.value = pickAnalysisPayload(await reanalyzeWork(selectedWorkId.value))
    ElMessage.success('已使用后端对作品重新分析')
  } catch (error) {
    ElMessage.error(error.message || '重新分析失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWorks()
})
</script>

<template>
  <div class="analysis grid-layout">
    <el-card class="glass-panel form-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>文本分析请求</span>
          <el-tag type="success" round>直连 /api/analyze/text</el-tag>
        </div>
      </template>
      <el-form label-position="top">
        <el-form-item label="粘贴正文">
          <el-input
            v-model="textForm.text"
            type="textarea"
            rows="4"
            placeholder="输入剧情段落，后端将提取字数、段落、对话占比与关键词"
          />
        </el-form-item>
        <el-form-item label="或上传文件">
          <el-upload
            drag
            action="#"
            :auto-upload="false"
            :before-upload="handleFile"
            accept=".txt,.docx"
          >
            <div class="el-upload__text">拖入文件，或点击选择</div>
          </el-upload>
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="runAnalysis">分析文本</el-button>
      </el-form>
    </el-card>

    <el-card class="glass-panel result-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>分析结果</span>
          <el-tag v-if="analysis?.title" type="warning" round>{{ analysis.title }}</el-tag>
        </div>
      </template>
      <div class="result-body" v-loading="loading">
        <p v-if="analysis?.summary" class="summary">{{ analysis.summary }}</p>
        <div v-else-if="!analysis" class="placeholder">提交文件或文本后即可看到真实分析结果</div>

        <el-divider />
        <div class="metrics">
          <div v-for="item in metrics" :key="item.label" class="metric">
            <div class="metric-head">
              <span>{{ item.label }}</span>
              <strong>
                {{ item.percent ? normalizePercent(item.value) : item.value }}
              </strong>
            </div>
            <el-progress
              v-if="item.percent"
              :percentage="Number(item.value) > 1 ? Math.min(100, Number(item.value)) : Number(item.value) * 100"
              :stroke-width="10"
              striped
            />
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="glass-panel keywords-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>关键词 Top10</span>
        </div>
      </template>
      <div class="keywords">
        <el-tag
          v-for="tag in keywordList"
          :key="tag.word"
          size="large"
          effect="dark"
          type="info"
        >
          {{ tag.word }}<template v-if="tag.weight"> · {{ normalizePercent(tag.weight) }}</template>
        </el-tag>
        <div v-if="keywordList.length === 0" class="placeholder small">
          暂无关键词，请先运行分析
        </div>
      </div>
    </el-card>

    <el-card class="glass-panel timeline-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>对上传作品重新分析</span>
          <el-button text type="primary" :loading="worksLoading" @click="fetchWorks">刷新</el-button>
        </div>
      </template>
      <div class="reanalyze">
        <el-select
          v-model="selectedWorkId"
          placeholder="选择已上传的作品"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="work in works"
            :key="work.id"
            :label="work.title || work.name || work.fileName || '未命名'"
            :value="work.id"
          />
        </el-select>
        <el-button type="primary" :loading="loading" @click="analyzeWork">重新分析</el-button>
      </div>
      <p class="muted">后端接口：`POST /api/analyze/works/{id}`</p>
    </el-card>
  </div>
</template>

<style scoped>
.analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.grid-layout {
  width: 100%;
}

.form-card,
.result-card {
  grid-column: span 1;
}

.result-card {
  min-height: 320px;
}

.result-body {
  min-height: 220px;
}

.summary {
  margin-bottom: 12px;
  color: var(--text-muted);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.metric {
  background: rgba(255, 255, 255, 0.04);
  padding: 12px;
  border-radius: 12px;
}

.metric-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.placeholder {
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.placeholder.small {
  min-height: 60px;
}

.reanalyze {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
</style>
