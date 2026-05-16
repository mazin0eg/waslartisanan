import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function AdminSidebar({ isOpen, onClose = () => {} }) {
  const { t } = useTranslation()
  const adminLinks = [
    { label: t('admin.sidebar.dashboard'), to: '/admin' },
    { label: t('admin.sidebar.products'), to: '/admin/products' },
    { label: t('admin.sidebar.orders'), to: '/admin/orders' },
    { label: t('admin.sidebar.customers'), to: '/admin/customers' },
  ]
  const linkClass = ({ isActive }) =>
    `flex items-center rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.25em] transition ${
      isActive
        ? 'bg-ink text-cream'
        : 'text-cedar/70 hover:bg-cream hover:text-ink'
    }`

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[260px] transform border-r border-sand/40 bg-white/90 p-8 shadow-soft transition duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
      <div className="mb-10">
        <p className="text-lg font-display text-ink">WaslArtisan</p>
        <p className="text-xs uppercase tracking-[0.3em] text-cedar/60">
          {t('admin.sidebar.studio')}
        </p>
      </div>
      <nav className="flex flex-col gap-3">
        {adminLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/admin'}
            className={linkClass}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  )
}

export default AdminSidebar
