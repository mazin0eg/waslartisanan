import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import { useAuthStore } from '../store/useAuthStore.js'

function Profile() {
  const { t } = useTranslation()
  const customer = useAuthStore((state) => state.customer)
  const clearCustomer = useAuthStore((state) => state.clearCustomer)

  if (!customer) {
    return (
      <PageTransition>
        <EmptyState
          title={t('profile.emptyTitle')}
          message={t('profile.emptyMessage')}
          action={
            <Link to="/login" className="primary-button">
              {t('profile.login')}
            </Link>
          }
        />
      </PageTransition>
    )
  }

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-display text-ink">
          {t('profile.welcome', { name: customer.name })}
        </h1>
        <button
          type="button"
          className="ghost-button text-xs"
          onClick={clearCustomer}
        >
          {t('profile.signOut')}
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface rounded-[36px] p-8">
          <h2 className="text-xl font-display text-ink">
            {t('profile.details')}
          </h2>
          <div className="mt-4 space-y-2 text-sm text-cedar/70">
            <p>
              {t('profile.name')}: {customer.name}
            </p>
            <p>
              {t('profile.email')}: {customer.email}
            </p>
            <p>
              {t('profile.phone')}: {customer.phone}
            </p>
          </div>
        </div>
        <div className="surface rounded-[36px] p-8">
          <h2 className="text-xl font-display text-ink">
            {t('profile.memberPerks')}
          </h2>
          <p className="mt-4 text-sm text-cedar/70">
            {t('profile.perksDescription')}
          </p>
        </div>
      </div>
    </PageTransition>
  )
}

export default Profile
