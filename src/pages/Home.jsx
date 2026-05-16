import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import SectionHeading from '../components/shared/SectionHeading.jsx'
import ProductGrid from '../components/product/ProductGrid.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { categories } from '../data/categories.js'
import { visuals } from '../data/visuals.js'

function Home() {
  const { t } = useTranslation()
  const { products, loading } = useProducts()
  const featured = products.slice(0, 4)
  const categoryLabels = {
    Ceramics: t('categories.ceramics'),
    Textiles: t('categories.textiles'),
    Woodwork: t('categories.woodwork'),
    Leather: t('categories.leather'),
    Metalwork: t('categories.metalwork'),
    'Home Rituals': t('categories.homeRituals'),
  }

  return (
    <PageTransition className="space-y-20">
      <section className="relative overflow-hidden rounded-[40px] bg-hero-sun px-6 py-16 shadow-soft md:px-12">
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="pill">{t('home.heroLabel')}</span>
            <h1 className="text-4xl font-display text-ink md:text-5xl">
              {t('home.heroTitle')}
            </h1>
            <p className="max-w-xl text-sm text-cedar/70">
              {t('home.heroDescription')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="primary-button">
                {t('home.shopCollection')}
              </Link>
              <Link to="/about" className="ghost-button">
                {t('home.ourStory')}
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="overflow-hidden rounded-[32px] border border-sand/40 bg-white/80 shadow-card"
            >
              <img
                src={visuals.hero}
                alt="Artisan workshop"
                className="h-64 w-full object-cover md:h-72"
                loading="lazy"
              />
            </motion.div>
            <div className="surface rounded-[32px] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cedar/70">
                {t('home.studioNotesLabel')}
              </p>
              <p className="mt-3 text-lg font-display text-ink">
                {t('home.studioNotesTitle')}
              </p>
              <p className="mt-2 text-sm text-cedar/70">
                {t('home.studioNotesDescription')}
              </p>
            </div>
            
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(247,241,232,0.6),transparent)]" />
      </section>

      <section className="space-y-10">
        <SectionHeading
          label={t('home.featuredLabel')}
          title={t('home.featuredTitle')}
          description={t('home.featuredDescription')}
        />
        <ProductGrid products={featured} loading={loading} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            label={t('home.categoriesLabel')}
            title={t('home.categoriesTitle')}
            description={t('home.categoriesDescription')}
          />
          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <span
                key={item}
                className="rounded-full border border-sand/60 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cedar/70"
              >
                {categoryLabels[item] || item}
              </span>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="surface overflow-hidden rounded-[36px]"
        >
          <img
            src={visuals.workshop}
            alt="Artisan workshop"
            className="h-56 w-full object-cover"
            loading="lazy"
          />
          <div className="p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-cedar/70">
              {t('home.missionLabel')}
            </p>
            <h3 className="mt-4 text-3xl font-display text-ink">
              {t('home.missionTitle')}
            </h3>
            <p className="mt-3 text-sm text-cedar/70">{t('home.missionBody1')}</p>
            <p className="mt-4 text-sm text-cedar/70">{t('home.missionBody2')}</p>
            <Link to="/about" className="primary-button mt-6 inline-flex">
              {t('home.learnMore')}
            </Link>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  )
}

export default Home
