import axios from 'axios'

const API_BASE = 'http://localhost:8081'
export const TOKEN_KEY = 'novel_jwt_token'

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000
})

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem(TOKEN_KEY)
    delete apiClient.defaults.headers.common.Authorization
  }
}

// Attach token for every request if it exists (covers refreshes and manual requests)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// bootstrap token if it already exists
setAuthToken(localStorage.getItem(TOKEN_KEY) || '')

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

const unwrap = (response) => response?.data?.data ?? response?.data

// auth
export const login = async (payload) =>
  unwrap(await apiClient.post('/api/auth/login', payload))
export const register = async (payload) =>
  unwrap(
    await apiClient.post('/api/auth/register', {
      ...payload,
      email: payload.email || `${payload.username}@example.com`
    })
  )

// user profile
export const fetchCurrentUser = async () => unwrap(await apiClient.get('/api/users/me'))
export const updateCurrentUser = async (payload) =>
  unwrap(await apiClient.put('/api/users/me', payload))

// works
export const listWorks = async (params = {}) =>
  unwrap(await apiClient.get('/api/works', { params }))
export const fetchWork = async (id) => unwrap(await apiClient.get(`/api/works/${id}`))
export const deleteWork = async (id) => unwrap(await apiClient.delete(`/api/works/${id}`))
export const updateWork = async (id, payload) =>
  unwrap(await apiClient.put(`/api/works/${id}`, payload))

export const uploadWork = async (payload) => {
  const formData = new FormData()
  if (payload.file) {
    formData.append('file', payload.file)
  } else if (payload.content) {
    const blob = new Blob([payload.content], { type: 'text/plain' })
    formData.append('file', blob, 'content.txt')
  }
  if (payload.title) {
    formData.append('title', payload.title)
  }
  if (payload.content) {
    formData.append('content', payload.content)
  }
  return unwrap(
    await apiClient.post('/api/works', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

export const reanalyzeWork = async (id) =>
  unwrap(await apiClient.post(`/api/analyze/works/${id}`))

// analysis
export const analyzeText = async ({ file, text }) => {
  const formData = new FormData()
  if (file) {
    formData.append('file', file)
  } else if (text) {
    const blob = new Blob([text], { type: 'text/plain' })
    formData.append('file', blob, 'text.txt')
  }
  return unwrap(
    await apiClient.post('/api/analyze/text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

// characters
export const listCharacters = async () => unwrap(await apiClient.get('/api/characters'))
export const saveCharacter = async (payload) =>
  payload.id
    ? unwrap(await apiClient.put(`/api/characters/${payload.id}`, payload))
    : unwrap(await apiClient.post('/api/characters', payload))
export const removeCharacter = async (id) =>
  unwrap(await apiClient.delete(`/api/characters/${id}`))

// worlds
export const listWorlds = async () => unwrap(await apiClient.get('/api/worlds'))
export const saveWorld = async (payload) =>
  payload.id
    ? unwrap(await apiClient.put(`/api/worlds/${payload.id}`, payload))
    : unwrap(await apiClient.post('/api/worlds', payload))
export const removeWorld = async (id) => unwrap(await apiClient.delete(`/api/worlds/${id}`))

export default apiClient
