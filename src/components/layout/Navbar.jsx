import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../../store/useCartStore.js'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )

  const linkClass = ({ isActive }) =>
    `text-sm uppercase tracking-[0.3em] transition ${
      isActive ? 'text-ink' : 'text-cedar/70 hover:text-ink'
    }`

  return (
    <header className="section-padding sticky top-0 z-40 bg-linen/80 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-sand/40 py-5">
        <Link to="/" className="flex items-center gap-4">
          <div className="flex items-center gap-4 rounded-full border border-sand/40 bg-white/80 px-4 py-2.5 shadow-soft">
            <img
              src="public/Logo_UEMF_2016-removebg-preview.png"
              alt="UEMF"
              className="h-8 w-auto object-contain md:h-9"
            />
            <span className="text-xs uppercase tracking-[0.3em] text-cedar/70">
              x
            </span>
            <img
              src="public/wasl_pise_logo-removebg-preview.png"
              alt="Wasl group"
              className="h-9 w-auto object-contain md:h-10"
            />
          </div>
          <span className="text-lg font-display text-ink">WaslArtisan</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={linkClass}
              end={item.to === '/'}
            >
              {t(`nav.${item.label.toLowerCase()}`)}
            </NavLink>
          ))}
          <NavLink to="/profile" className={linkClass}>
            {t('nav.profile')}
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            {t('nav.cart')} ({cartCount})
          </NavLink>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-cedar/70">
              {t('nav.language')}
            </span>
            <select
              className="rounded-full border border-sand/60 bg-white/80 px-3 py-2 text-xs uppercase tracking-[0.3em] text-cedar/80"
              value={i18n.language}
              onChange={(event) => i18n.changeLanguage(event.target.value)}
            >
              <option value="en">{t('languageOptions.en')}</option>
              <option value="fr">{t('languageOptions.fr')}</option>
              <option value="ar">{t('languageOptions.ar')}</option>
            </select>
          </div>
        </nav>
        <div className="flex items-center gap-4 lg:hidden">
          <Link
            to="/cart"
            className="rounded-full border border-sand/60 px-3 py-2 text-xs uppercase tracking-[0.3em]"
          >
            {t('nav.cart')} {cartCount}
          </Link>
          <button
            type="button"
            className="rounded-full border border-sand/60 px-4 py-2 text-xs uppercase tracking-[0.3em]"
            onClick={() => setOpen((prev) => !prev)}
          >
            {t('nav.menu')}
          </button>
        </div>
      </div>
      {open ? (
        <div className="mt-4 rounded-3xl border border-sand/50 bg-white/90 p-6 shadow-card lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={linkClass}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
              >
                {t(`nav.${item.label.toLowerCase()}`)}
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {t('nav.profile')}
            </NavLink>
            <NavLink
              to="/cart"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {t('nav.cart')} ({cartCount})
            </NavLink>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.3em] text-cedar/70">
                {t('nav.language')}
              </span>
              <select
                className="rounded-full border border-sand/60 bg-white/80 px-3 py-2 text-xs uppercase tracking-[0.3em] text-cedar/80"
                value={i18n.language}
                onChange={(event) => i18n.changeLanguage(event.target.value)}
              >
                <option value="en">{t('languageOptions.en')}</option>
                <option value="fr">{t('languageOptions.fr')}</option>
                <option value="ar">{t('languageOptions.ar')}</option>
              </select>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
