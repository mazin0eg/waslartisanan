import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const apiTimeout = Number(import.meta.env.VITE_API_TIMEOUT) || 8000

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: apiTimeout,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API error', {
        message: error?.message,
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        data: error?.response?.data,
      })
    }
    return Promise.reject(error)
  },
)

export default apiClient
