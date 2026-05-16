import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageTransition from '../../components/shared/PageTransition.jsx'
import EmptyState from '../../components/shared/EmptyState.jsx'
import { getOrders } from '../../services/orders.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

function AdminOrders() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (err) {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <PageTransition className="space-y-6">
      <h2 className="text-2xl font-display text-ink">{t('admin.orders.title')}</h2>
      {loading ? (
        <p className="text-sm text-cedar/70">{t('admin.orders.loading')}</p>
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
                <span className="pill">{order.status}</span>
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
                <p className="mt-2 text-ink">
                  {t('admin.orders.total')}: {formatCurrency(order.total)}
                </p>
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
