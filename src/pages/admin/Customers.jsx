import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageTransition from '../../components/shared/PageTransition.jsx'
import EmptyState from '../../components/shared/EmptyState.jsx'
import { getUsers } from '../../services/users.js'

function AdminCustomers() {
  const { t } = useTranslation()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUsers()
        setCustomers(data.filter((user) => user.role === 'customer'))
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Unable to load customers', err)
        }
        setCustomers([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <PageTransition className="space-y-6">
      <h2 className="text-xl font-display text-ink md:text-2xl">
        {t('admin.customers.title')}
      </h2>
      {loading ? (
        <p className="text-sm text-cedar/70">{t('admin.customers.loading')}</p>
      ) : customers.length ? (
        <div className="space-y-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-3xl border border-sand/40 bg-white/90 p-5 shadow-soft"
            >
              <p className="text-lg font-display text-ink">{customer.name}</p>
              <div className="mt-2 text-sm text-cedar/70">
                <p>{customer.email}</p>
                <p>{customer.phone}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('admin.customers.emptyTitle')}
          message={t('admin.customers.emptyMessage')}
        />
      )}
    </PageTransition>
  )
}

export default AdminCustomers
