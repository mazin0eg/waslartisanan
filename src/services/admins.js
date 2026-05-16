import apiClient from './apiClient.js'

export const getAdmins = async () => {
  const response = await apiClient.get('/users', {
    params: { role: 'admin' },
  })
  return response.data
}
