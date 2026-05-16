import apiClient from './apiClient.js'

export const getUsers = async () => {
  const response = await apiClient.get('/users')
  return response.data
}
