import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageTransition from '../../components/shared/PageTransition.jsx'
import { getProducts } from '../../services/products.js'
import { getOrders } from '../../services/orders.js'
import { getUsers } from '../../services/users.js'

function Dashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [products, orders, users] = await Promise.all([
          getProducts(),
          getOrders(),
          getUsers(),
        ])
        setStats({
          products: products.length,
          orders: orders.length,
          customers: users.length,
        })
      } catch (err) {
        setStats({ products: 0, orders: 0, customers: 0 })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <PageTransition className="space-y-10">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: t('admin.dashboard.products'), value: stats.products },
          { label: t('admin.dashboard.orders'), value: stats.orders },
          { label: t('admin.dashboard.customers'), value: stats.customers },
        ].map((item) => (
          <div
            key={item.label}
            className="surface rounded-[32px] p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cedar/70">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-display text-ink">
              {loading ? '...' : item.value}
            </p>
          </div>
        ))}
      </div>
      <div className="surface rounded-[36px] p-8">
        <h2 className="text-xl font-display text-ink">
          {t('admin.dashboard.quickActions')}
        </h2>
        <p className="mt-3 text-sm text-cedar/70">
          {t('admin.dashboard.quickActionsDesc')}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/admin/products" className="primary-button">
            {t('admin.dashboard.manageProducts')}
          </Link>
          <Link to="/admin/orders" className="ghost-button">
            {t('admin.dashboard.viewOrders')}
          </Link>
        </div>
      </div>
    </PageTransition>
  )
}

export default Dashboard
