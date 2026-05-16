import { useCallback, useEffect, useState } from 'react'
import { getCategories } from '../services/categories.js'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
      setError('')
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Unable to load categories', err)
      }
      setCategories([])
      setError('Unable to load categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { categories, loading, error, refresh: load }
}
