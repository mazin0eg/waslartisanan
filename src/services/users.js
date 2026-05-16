import apiClient from './apiClient.js'

export const getUsers = async () => {
  const response = await apiClient.get('/users')
  return response.data
}

export const createUser = async (payload) => {
  const response = await apiClient.post('/users', payload)
  return response.data
}
