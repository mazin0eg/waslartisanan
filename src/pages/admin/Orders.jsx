import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../../components/shared/PageTransition.jsx'
import EmptyState from '../../components/shared/EmptyState.jsx'
import { getOrders, updateOrderStatus } from '../../services/orders.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

function AdminOrders() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')

  const statusOptions = ['pending', 'in progress', 'shipped', 'delivered', 'cancelled']
  const statusStyles = {
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    'in progress': 'border-blue-200 bg-blue-50 text-blue-700',
    shipped: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    cancelled: 'border-rose-200 bg-rose-50 text-rose-700',
  }

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
        setError('')
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Unable to load orders', err)
        }
        setOrders([])
        setError('Unable to load orders.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleStatusChange = async (orderId, nextStatus) => {
    const current = orders.find((order) => order.id === orderId)
    if (!current || current.status === nextStatus) return

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order,
      ),
    )
    setUpdatingId(orderId)

    try {
      await updateOrderStatus(orderId, nextStatus)
      toast.success('Order status updated')
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Unable to update order status', err)
      }
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: current.status } : order,
        ),
      )
      toast.error('Unable to update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusClass = (status) =>
    statusStyles[status] || 'border-sand/40 bg-cream/80 text-cedar'

  const getOrderItems = (order) => order.products || order.items || []

  return (
    <PageTransition className="space-y-6">
      <h2 className="text-xl font-display text-ink md:text-2xl">
        {t('admin.orders.title')}
      </h2>
      {loading ? (
        <p className="text-sm text-cedar/70">{t('admin.orders.loading')}</p>
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-sand/40 bg-white/90 p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cedar/60">
                    {t('admin.orders.order')} #{order.id}
                  </p>
                  <p className="text-lg font-display text-ink">
                    {order.customerName}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.25em] ${getStatusClass(
                    order.status || 'pending',
                  )}`}
                >
                  {order.status || 'pending'}
                </span>
              </div>
              <div className="mt-4 text-sm text-cedar/70">
                <p>{order.email}</p>
                <p>{order.phone}</p>
                <p className="mt-2 text-cedar/70">
                  {order.address}, {order.city}
                </p>
                {order.notes ? (
                  <p className="mt-2 text-cedar/70">
                    {t('admin.orders.notes')}: {order.notes}
                  </p>
                ) : null}
                {getOrderItems(order).length ? (
                  <div className="mt-3 space-y-1 text-cedar/70">
                    {getOrderItems(order).map((item, index) => (
                      <p key={`${order.id}-${index}`}>
                        {item.title} x {item.quantity}
                      </p>
                    ))}
                  </div>
                ) : null}
                <p className="mt-2 text-ink">
                  {t('admin.orders.total')}: {formatCurrency(order.total)}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="text-xs uppercase tracking-[0.3em] text-cedar/60">
                  Status
                </label>
                <select
                  className="rounded-full border border-sand/60 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cedar/80"
                  value={order.status || 'pending'}
                  onChange={(event) =>
                    handleStatusChange(order.id, event.target.value)
                  }
                  disabled={updatingId === order.id}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {updatingId === order.id ? (
                  <span className="text-xs text-cedar/60">Saving...</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('admin.orders.emptyTitle')}
          message={t('admin.orders.emptyMessage')}
        />
      )}
    </PageTransition>
  )
}

export default AdminOrders
