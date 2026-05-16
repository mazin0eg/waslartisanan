import apiClient from './apiClient.js'

export const getProducts = async () => {
  const response = await apiClient.get('/products')
  return response.data
}

export const getProduct = async (id) => {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}

export const createProduct = async (payload) => {
  const response = await apiClient.post('/products', payload)
  return response.data
}

export const updateProduct = async (id, payload) => {
  const response = await apiClient.put(`/products/${id}`, payload)
  return response.data
}

export const deleteProduct = async (id) => {
  await apiClient.delete(`/products/${id}`)
}
