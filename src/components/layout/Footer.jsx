import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-night text-cream">
      <div className="section-padding py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.9fr_1fr]">
          <div>
            <p className="text-2xl font-display">WaslArtisan</p>
            <p className="mt-4 text-sm text-cream/70">
              {t('footer.description')}
            </p>
          </div>
          <div className="space-y-2 text-sm text-cream/70">
            <p className="uppercase tracking-[0.3em] text-cream">{t('footer.explore')}</p>
            <Link to="/products" className="block hover:text-cream">
              {t('nav.products')}
            </Link>
            <Link to="/about" className="block hover:text-cream">
              {t('footer.mission')}
            </Link>
            <Link to="/contact" className="block hover:text-cream">
              {t('footer.contact')}
            </Link>
          </div>
          <div className="space-y-2 text-sm text-cream/70">
            <p className="uppercase tracking-[0.3em] text-cream">{t('footer.contact')}</p>
            <p>{t('footer.location')}</p>
            <p>+212 5356349 93</p>
            <p>artisanwasl@gmail.com</p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 pt-6 text-xs uppercase tracking-[0.3em] text-cream/60">
          <p>{t('footer.rights')}</p>
          <p>{t('footer.crafted')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
