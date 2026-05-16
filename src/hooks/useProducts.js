import { useCallback, useEffect, useState } from 'react'
import { getProducts } from '../services/products.js'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      setError(null)
    } catch (err) {
      console.error('Unable to load products', err)
      setError('Unable to load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { products, loading, error, refresh: load }
}
