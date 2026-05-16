import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import SectionHeading from '../components/shared/SectionHeading.jsx'
import { visuals } from '../data/visuals.js'

function About() {
  const { t } = useTranslation()
  const gallery = [
    {
      src: visuals.aboutWorkshop || visuals.workshop,
      alt: t('about.craftTitle'),
      caption: t('about.craftLabel'),
    },
    {
      src: visuals.aboutHands || visuals.textile,
      alt: t('about.cards.visibility'),
      caption: t('about.cards.visibility'),
    },
    {
      src: visuals.aboutDetail || visuals.pottery,
      alt: t('about.cards.income'),
      caption: t('about.cards.income'),
    },
    {
      src: visuals.aboutArtisan || visuals.leather,
      alt: t('about.cards.reach'),
      caption: t('about.cards.reach'),
    },
  ]

  return (
    <PageTransition className="space-y-12">
      <SectionHeading
        label={t('about.label')}
        title={t('about.title')}
        description={t('about.description')}
      />
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <span className="pill">{t('about.craftLabel')}</span>
          <h2 className="text-3xl font-display text-ink md:text-4xl">
            {t('about.craftTitle')}
          </h2>
          <p className="text-sm text-cedar/70 md:text-base">
            {t('about.craftBody1')}
          </p>
          <p className="text-sm text-cedar/70 md:text-base">
            {t('about.craftBody2')}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4"
        >
          <figure className="surface overflow-hidden rounded-[36px]">
            <img
              src="/Artisanal-Work--1030x687.jpg"
              alt={gallery[0].alt}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            
          </figure>
          
        </motion.div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: t('about.cards.visibility'),
            detail: t('about.cards.visibilityDetail'),
          },
          {
            title: t('about.cards.income'),
            detail: t('about.cards.incomeDetail'),
          },
          {
            title: t('about.cards.reach'),
            detail: t('about.cards.reachDetail'),
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-3xl border border-sand/40 bg-white/80 p-6 shadow-soft"
          >
            <p className="text-lg font-display text-ink">{item.title}</p>
            <p className="mt-2 text-sm text-cedar/70">{item.detail}</p>
          </motion.div>
        ))}
      </section>

      <section className="surface rounded-[36px] p-8 md:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <h3 className="text-2xl font-display text-ink">{t('about.whyTitle')}</h3>
            <p className="text-sm text-cedar/70 md:text-base">
              {t('about.whyBody')}
            </p>
          </div>
          <div className="rounded-3xl border border-sand/40 bg-white/70 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cedar/70">
              {t('about.promiseLabel')}
            </p>
            <p className="mt-3 text-lg font-display text-ink">
              {t('about.promiseText')}
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

export default About
