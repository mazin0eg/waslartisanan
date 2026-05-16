import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/useAuthStore.js'

function AdminTopbar({ onMenuClick = () => {} }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const clearAdmin = useAuthStore((state) => state.clearAdmin)
  const titleMap = {
    '/admin': t('admin.sidebar.dashboard'),
    '/admin/products': t('admin.sidebar.products'),
    '/admin/orders': t('admin.sidebar.orders'),
    '/admin/customers': t('admin.sidebar.customers'),
  }

  const title =
    titleMap[location.pathname] ||
    (location.pathname.startsWith('/admin/products')
      ? t('admin.sidebar.products')
      : t('admin.admin'))

  return (
    <div className="section-padding flex flex-wrap items-center justify-between gap-4 border-b border-sand/40 bg-linen/70 py-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="ghost-button text-xs lg:hidden"
          onClick={onMenuClick}
        >
          {t('admin.menu')}
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cedar/60">
            {t('admin.admin')}
          </p>
          <h1 className="text-2xl font-display text-ink">{title}</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/" className="ghost-button text-xs">
          {t('admin.viewStorefront')}
        </Link>
        <button
          type="button"
          className="ghost-button text-xs"
          onClick={() => {
            clearAdmin()
            navigate('/admin/login')
          }}
        >
          {t('admin.signOut')}
        </button>
      </div>
    </div>
  )
}

export default AdminTopbar
