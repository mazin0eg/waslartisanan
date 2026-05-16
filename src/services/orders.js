import apiClient from './apiClient.js'

export const getOrders = async () => {
  const response = await apiClient.get('/orders')
  return response.data
}

export const createOrder = async (payload) => {
  const response = await apiClient.post('/orders', payload)
  return response.data
}
