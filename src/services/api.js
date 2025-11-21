import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api'
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
export const login = async (payload) => unwrap(await apiClient.post('/auth/login', payload))
export const register = async (payload) => unwrap(await apiClient.post('/auth/register', payload))

// user profile
export const fetchCurrentUser = async () => unwrap(await apiClient.get('/users/me'))
export const updateCurrentUser = async (payload) => unwrap(await apiClient.put('/users/me', payload))

// works
export const listWorks = async (params = {}) => unwrap(await apiClient.get('/works', { params }))
export const fetchWork = async (id) => unwrap(await apiClient.get(`/works/${id}`))
export const deleteWork = async (id) => unwrap(await apiClient.delete(`/works/${id}`))
export const updateWork = async (id, payload) => unwrap(await apiClient.put(`/works/${id}`, payload))

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
    await apiClient.post('/works', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

export const reanalyzeWork = async (id) => unwrap(await apiClient.post(`/analyze/works/${id}`))

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
    await apiClient.post('/analyze/text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

// characters
export const listCharacters = async () => unwrap(await apiClient.get('/characters'))
export const saveCharacter = async (payload) =>
  payload.id
    ? unwrap(await apiClient.put(`/characters/${payload.id}`, payload))
    : unwrap(await apiClient.post('/characters', payload))
export const removeCharacter = async (id) => unwrap(await apiClient.delete(`/characters/${id}`))

// worlds
export const listWorlds = async () => unwrap(await apiClient.get('/worlds'))
export const saveWorld = async (payload) =>
  payload.id
    ? unwrap(await apiClient.put(`/worlds/${payload.id}`, payload))
    : unwrap(await apiClient.post('/worlds', payload))
export const removeWorld = async (id) => unwrap(await apiClient.delete(`/worlds/${id}`))

export default apiClient
