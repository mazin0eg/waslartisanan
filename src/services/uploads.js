import axios from 'axios'

const uploadBaseUrl = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3002'
const uploadTimeout = Number(import.meta.env.VITE_UPLOAD_TIMEOUT) || 15000

const uploadClient = axios.create({
  baseURL: uploadBaseUrl,
  timeout: uploadTimeout,
})

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await uploadClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}
