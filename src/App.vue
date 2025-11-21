<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import {
  ArrowDown,
  DataAnalysis,
  HomeFilled,
  Memo,
  Notebook,
  UserFilled
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { user, loading } = storeToRefs(authStore)

const navItems = [
  { label: '首页', path: '/', icon: HomeFilled },
  { label: '个人资料', path: '/users', icon: UserFilled },
  { label: '作品管理', path: '/works', icon: Memo },
  { label: '文本分析', path: '/analysis', icon: DataAnalysis },
  { label: '世界观设定', path: '/world', icon: Notebook }
]

const activePath = computed(() => route.path)

const authDialogVisible = ref(false)
const authTab = ref('login')
const loginForm = reactive({
  username: '',
  password: ''
})
const registerForm = reactive({
  username: '',
  password: '',
  displayName: ''
})

onMounted(() => {
  authStore.bootstrap()
})

const goAnalyze = () => {
  router.push('/analysis')
}

const goProfile = () => {
  router.push('/users')
}

const handleLogin = async () => {
  try {
    await authStore.login({ ...loginForm })
    authDialogVisible.value = false
    ElMessage.success('登录成功')
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  }
}

const handleRegister = async () => {
  try {
    await authStore.register({ ...registerForm })
    authDialogVisible.value = false
    ElMessage.success('注册成功')
  } catch (error) {
    ElMessage.error(error.message || '注册失败')
  }
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
}
</script>

<template>
  <div class="app-shell">
    <div class="bg-aurora"></div>
    <el-container class="app-layout glass-panel">
      <el-header class="app-header">
        <div class="brand">
          <p class="brand-title gradient-text">Aether Novel Intelligence</p>
          <span>AI 驱动的故事孵化实验室</span>
        </div>
        <el-menu
          class="nav-menu"
          mode="horizontal"
          :default-active="activePath"
          :ellipsis="false"
          router
        >
          <el-menu-item
            v-for="item in navItems"
            :key="item.path"
            :index="item.path"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>
        <div class="header-actions">
          <el-button type="primary" round size="large" @click="goAnalyze">
            即刻分析
          </el-button>
          <div class="auth-box">
            <el-dropdown v-if="user" trigger="click">
              <span class="user-entry">
                <el-icon><UserFilled /></el-icon>
                <strong>{{ user.displayName || user.username }}</strong>
                <el-icon class="caret"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goProfile">个人资料</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              v-else
              type="success"
              round
              size="large"
              plain
              @click="authDialogVisible = true"
            >
              登录 / 注册
            </el-button>
          </div>
        </div>
      </el-header>
      <el-main class="app-main">
        <RouterView v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </el-main>
    </el-container>

    <el-dialog v-model="authDialogVisible" width="480px" title="账户登录 / 注册" destroy-on-close>
      <el-tabs v-model="authTab">
        <el-tab-pane label="登录" name="login">
          <el-form label-width="72px">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" autocomplete="username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                v-model="loginForm.password"
                type="password"
                show-password
                autocomplete="current-password"
              />
            </el-form-item>
            <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <el-form label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="registerForm.username" autocomplete="username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                v-model="registerForm.password"
                type="password"
                show-password
                autocomplete="new-password"
              />
            </el-form-item>
            <el-form-item label="展示名">
              <el-input v-model="registerForm.displayName" />
            </el-form-item>
            <el-button type="success" :loading="loading" @click="handleRegister">注册并登录</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 32px;
  position: relative;
}

.bg-aurora {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      125deg,
      rgba(0, 255, 209, 0.2),
      rgba(0, 85, 255, 0.12)
    ),
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.2), transparent);
  filter: blur(40px);
  opacity: 0.8;
}

.app-layout {
  min-height: calc(100vh - 64px);
  position: relative;
  z-index: 2;
  padding: 12px 18px 32px;
  backdrop-filter: blur(20px);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 16px;
  margin-bottom: 16px;
  gap: 12px;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-title {
  font-size: 20px;
  margin: 0;
}

.brand span {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.nav-menu {
  flex: 1;
  margin: 0 16px;
  background: transparent;
  border-bottom: none;
}

.nav-menu :deep(.el-menu-item) {
  color: var(--text-muted);
  border-radius: 999px;
  margin: 0 6px;
}

.nav-menu :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-strong);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-box {
  display: flex;
  align-items: center;
}

.user-entry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.user-entry .caret {
  color: var(--text-muted);
}

.app-main {
  padding: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 960px) {
  .app-shell {
    padding: 12px;
  }

  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-menu {
    width: 100%;
    margin: 0;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .nav-menu :deep(.el-menu-item) {
    flex: 1 1 45%;
    margin-bottom: 8px;
    justify-content: center;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>
