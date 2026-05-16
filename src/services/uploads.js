import axios from 'axios'

const uploadClient = axios.create({
  baseURL: 'http://localhost:3002',
  timeout: 15000,
})

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await uploadClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}
