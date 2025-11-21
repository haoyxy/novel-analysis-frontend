<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchCurrentUser, updateCurrentUser } from '@/services/api'

const loading = ref(false)
const saving = ref(false)
const passwordSaving = ref(false)

const profileForm = reactive({
  username: '',
  displayName: '',
  bio: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loadProfile = async () => {
  loading.value = true
  try {
    const data = await fetchCurrentUser()
    profileForm.username = data.username
    profileForm.displayName = data.displayName || ''
    profileForm.bio = data.bio || ''
  } catch (error) {
    ElMessage.error(error.message || '读取个人资料失败，请确认已登录')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await updateCurrentUser({
      displayName: profileForm.displayName,
      bio: profileForm.bio
    })
    ElMessage.success('资料已更新')
  } catch (error) {
    ElMessage.error(error.message || '更新失败')
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    ElMessage.warning('请输入当前密码和新密码')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  passwordSaving.value = true
  try {
    await updateCurrentUser({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码已修改')
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  } catch (error) {
    ElMessage.error(error.message || '修改密码失败')
  } finally {
    passwordSaving.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div class="profile">
    <section class="glass-panel hero">
      <div>
        <p class="eyebrow">ACCOUNT</p>
        <h2>个人资料中心</h2>
        <p class="muted">
          这里直接调用后端 `/api/users/me` 与 `PUT /api/users/me` 接口，展示名、简介与登录密码都会落在真实数据库中。
        </p>
      </div>
      <el-button plain type="primary" :loading="loading" @click="loadProfile">重新拉取</el-button>
    </section>

    <el-card class="glass-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>基础资料</span>
          <el-tag type="success" round>实时同步后端</el-tag>
        </div>
      </template>
      <el-form label-width="100px" :model="profileForm" v-loading="loading">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" disabled />
        </el-form-item>
        <el-form-item label="展示名">
          <el-input v-model="profileForm.displayName" placeholder="用于前端展示的昵称" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            rows="3"
            placeholder="一句话介绍自己或创作方向"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="saveProfile">保存资料</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="glass-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
          <span class="muted">需要后端校验当前密码</span>
        </div>
      </template>
      <el-form label-width="120px" :model="passwordForm">
        <el-form-item label="当前密码">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" :loading="passwordSaving" @click="changePassword">
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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
