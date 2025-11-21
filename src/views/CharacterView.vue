<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listCharacters,
  listWorlds,
  removeCharacter,
  removeWorld,
  saveCharacter,
  saveWorld
} from '@/services/api'

const characterLoading = ref(false)
const worldLoading = ref(false)
const characterDialog = ref(false)
const worldDialog = ref(false)
const isEditCharacter = ref(false)
const isEditWorld = ref(false)

const characters = ref([])
const worlds = ref([])

const characterForm = reactive({
  id: null,
  name: '',
  alias: '',
  identity: '',
  description: '',
  traits: '',
  customAttributes: ''
})

const worldForm = reactive({
  id: null,
  name: '',
  category: '',
  summary: '',
  detail: ''
})

const loadCharacters = async () => {
  characterLoading.value = true
  try {
    characters.value = await listCharacters()
  } catch (error) {
    ElMessage.error(error.message || '读取角色设定失败')
  } finally {
    characterLoading.value = false
  }
}

const loadWorlds = async () => {
  worldLoading.value = true
  try {
    worlds.value = await listWorlds()
  } catch (error) {
    ElMessage.error(error.message || '读取世界观失败')
  } finally {
    worldLoading.value = false
  }
}

const openNewCharacter = () => {
  isEditCharacter.value = false
  Object.assign(characterForm, {
    id: null,
    name: '',
    alias: '',
    identity: '',
    description: '',
    traits: '',
    customAttributes: ''
  })
  characterDialog.value = true
}

const openEditCharacter = (row) => {
  isEditCharacter.value = true
  Object.assign(characterForm, {
    ...row,
    customAttributes:
      typeof row.customAttributes === 'object'
        ? JSON.stringify(row.customAttributes, null, 2)
        : row.customAttributes || ''
  })
  characterDialog.value = true
}

const submitCharacter = async () => {
  try {
    const payload = {
      ...characterForm,
      customAttributes: characterForm.customAttributes
    }
    const saved = await saveCharacter(payload)
    const index = characters.value.findIndex((c) => c.id === saved.id)
    if (index > -1) {
      characters.value[index] = saved
    } else {
      characters.value.unshift(saved)
    }
    ElMessage.success('角色已保存')
    characterDialog.value = false
  } catch (error) {
    ElMessage.error(error.message || '保存失败')
  }
}

const confirmRemoveCharacter = async (row) => {
  try {
    await ElMessageBox.confirm(`删除角色 ${row.name}？`, '提示', { type: 'warning' })
    await removeCharacter(row.id)
    characters.value = characters.value.filter((item) => item.id !== row.id)
    ElMessage.success('已删除')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const openNewWorld = () => {
  isEditWorld.value = false
  Object.assign(worldForm, {
    id: null,
    name: '',
    category: '',
    summary: '',
    detail: ''
  })
  worldDialog.value = true
}

const openEditWorld = (row) => {
  isEditWorld.value = true
  Object.assign(worldForm, row)
  worldDialog.value = true
}

const submitWorld = async () => {
  try {
    const saved = await saveWorld({ ...worldForm })
    const index = worlds.value.findIndex((w) => w.id === saved.id)
    if (index > -1) {
      worlds.value[index] = saved
    } else {
      worlds.value.unshift(saved)
    }
    ElMessage.success('世界观已保存')
    worldDialog.value = false
  } catch (error) {
    ElMessage.error(error.message || '保存失败')
  }
}

const confirmRemoveWorld = async (row) => {
  try {
    await ElMessageBox.confirm(`删除世界观 ${row.name}？`, '提示', { type: 'warning' })
    await removeWorld(row.id)
    worlds.value = worlds.value.filter((item) => item.id !== row.id)
    ElMessage.success('已删除')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadCharacters()
  loadWorlds()
})
</script>

<template>
  <div class="settings">
    <section class="glass-panel intro">
      <div>
        <p class="eyebrow">CHARACTERS & WORLDS</p>
        <h2>角色设定 / 世界观设定</h2>
        <p class="muted">
          直接连接 `/api/characters` 和 `/api/worlds`，所有新增、更新、删除操作都会写入真实后端。
        </p>
      </div>
      <div class="actions">
        <el-button type="primary" @click="openNewCharacter">新增角色</el-button>
        <el-button plain type="success" @click="openNewWorld">新增世界观</el-button>
      </div>
    </section>

    <el-card class="glass-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>角色设定</span>
          <el-button text @click="loadCharacters" :loading="characterLoading">刷新</el-button>
        </div>
      </template>
      <el-table :data="characters" v-loading="characterLoading" border>
        <el-table-column prop="name" label="姓名/角色" width="160" />
        <el-table-column prop="alias" label="别名" width="160" />
        <el-table-column prop="identity" label="身份" width="160" />
        <el-table-column prop="traits" label="特质" min-width="200" />
        <el-table-column prop="description" label="描述" min-width="240" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openEditCharacter(row)">编辑</el-button>
            <el-button text type="danger" @click="confirmRemoveCharacter(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="glass-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>世界观设定</span>
          <el-button text @click="loadWorlds" :loading="worldLoading">刷新</el-button>
        </div>
      </template>
      <el-table :data="worlds" v-loading="worldLoading" border>
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="category" label="分类" width="160" />
        <el-table-column prop="summary" label="概要" min-width="240" />
        <el-table-column prop="detail" label="详情" min-width="320" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openEditWorld(row)">编辑</el-button>
            <el-button text type="danger" @click="confirmRemoveWorld(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="characterDialog" :title="isEditCharacter ? '编辑角色' : '新增角色'" width="640px">
      <el-form :model="characterForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="characterForm.name" />
        </el-form-item>
        <el-form-item label="别名">
          <el-input v-model="characterForm.alias" />
        </el-form-item>
        <el-form-item label="身份/定位">
          <el-input v-model="characterForm.identity" />
        </el-form-item>
        <el-form-item label="特质">
          <el-input v-model="characterForm.traits" placeholder="例如：热血、理智、强迫症" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="characterForm.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="自定义属性">
          <el-input
            v-model="characterForm.customAttributes"
            type="textarea"
            :rows="4"
            placeholder='后端支持 Map 结构，可直接填写 JSON：{"力量":90}'
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="characterDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCharacter">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="worldDialog" :title="isEditWorld ? '编辑世界观' : '新增世界观'" width="640px">
      <el-form :model="worldForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="worldForm.name" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="worldForm.category" placeholder="例如：文明、势力、地点" />
        </el-form-item>
        <el-form-item label="概要">
          <el-input v-model="worldForm.summary" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item label="详情">
          <el-input v-model="worldForm.detail" type="textarea" rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="worldDialog = false">取消</el-button>
        <el-button type="primary" @click="submitWorld">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.muted {
  color: var(--text-muted);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
