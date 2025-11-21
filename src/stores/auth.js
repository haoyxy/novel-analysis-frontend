import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  TOKEN_KEY,
  fetchCurrentUser,
  login as apiLogin,
  register as apiRegister,
  setAuthToken
} from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(null)
  const loading = ref(false)

  const setToken = (val) => {
    token.value = val || ''
    setAuthToken(token.value)
  }

  const bootstrap = async () => {
    if (!token.value) return
    try {
      await fetchProfile()
    } catch (error) {
      console.warn('Auth bootstrap failed, clearing token', error?.message || error)
      logout()
    }
  }

  const fetchProfile = async () => {
    if (!token.value) return null
    const profile = await fetchCurrentUser()
    user.value = profile
    return profile
  }

  const login = async (payload) => {
    loading.value = true
    try {
      const res = await apiLogin(payload)
      const resolvedToken = res?.token || res?.accessToken || res?.jwt || res
      if (!resolvedToken) {
        throw new Error('后端未返回 token 字段')
      }
      setToken(resolvedToken)
      await fetchProfile()
      return res
    } finally {
      loading.value = false
    }
  }

  const register = async (payload) => {
    loading.value = true
    try {
      await apiRegister(payload)
      await login({ username: payload.username, password: payload.password })
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    setToken('')
    user.value = null
  }

  return {
    token,
    user,
    loading,
    bootstrap,
    login,
    register,
    fetchProfile,
    logout
  }
})
