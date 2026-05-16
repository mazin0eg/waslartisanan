import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 8000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error', {
      message: error?.message,
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      data: error?.response?.data,
    })
    return Promise.reject(error)
  },
)

export default apiClient
