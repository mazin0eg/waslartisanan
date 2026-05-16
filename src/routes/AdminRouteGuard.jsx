import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

function AdminRouteGuard({ children }) {
  const admin = useAuthStore((state) => state.admin)
  const customer = useAuthStore((state) => state.customer)

  if (admin?.role === 'admin') {
    return children
  }

  if (customer?.role === 'customer') {
    return <Navigate to="/" replace />
  }

  return <Navigate to="/admin/login" replace />
}

export default AdminRouteGuard
