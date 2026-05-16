import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import SectionHeading from '../components/shared/SectionHeading.jsx'

function Contact() {
  const { t } = useTranslation()
  return (
    <PageTransition className="space-y-10">
      <SectionHeading
        label={t('contact.label')}
        title={t('contact.title')}
        description={t('contact.description')}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid gap-4">
          {[
            {
              title: t('contact.cards.email'),
              value: 'artisanwasl@gmail.com',
              note: t('contact.cards.emailNote'),
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 text-cedar"
                >
                  <path
                    fill="currentColor"
                    d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5H4Zm16 10V9.5l-8 5-8-5V18h16Z"
                  />
                </svg>
              ),
            },
            {
              title: t('contact.cards.phone'),
              value: '+212 5356349 93',
              note: t('contact.cards.phoneNote'),
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 text-cedar"
                >
                  <path
                    fill="currentColor"
                    d="M6.6 2h3.2l1 4.4-2.3 1.3a12.5 12.5 0 0 0 5.8 5.8l1.3-2.3 4.4 1V16c0 1.1-.9 2-2 2A14 14 0 0 1 4 4c0-1.1.9-2 2-2Z"
                  />
                </svg>
              ),
            },
            {
              title: t('contact.cards.studio'),
              value: t('footer.location'),
              note: t('contact.cards.studioNote'),
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 text-cedar"
                >
                  <path
                    fill="currentColor"
                    d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                  />
                </svg>
              ),
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true, amount: 0.3 }}
              className="surface rounded-[28px] p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sand/50 bg-cream/70">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cedar/70">
                    {item.title}
                  </p>
                  <p className="mt-2 text-lg font-display text-ink">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-cedar/70">{item.note}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="surface rounded-[36px] p-8"
          onSubmit={(event) => {
            event.preventDefault()
            toast.success(t('contact.toastSuccess'))
          }}
        >
          <div className="grid gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cedar/70">
                {t('contact.formLabel')}
              </p>
              <h3 className="mt-3 text-2xl font-display text-ink">
                {t('contact.formTitle')}
              </h3>
            </div>
            <input
              className="input-field"
              placeholder={t('contact.namePlaceholder')}
              type="text"
              required
            />
            <input
              className="input-field"
              placeholder={t('contact.emailPlaceholder')}
              type="email"
              required
            />
            <textarea
              className="input-field min-h-[140px]"
              placeholder={t('contact.messagePlaceholder')}
              required
            />
            <button type="submit" className="primary-button">
              {t('contact.sendMessage')}
            </button>
          </div>
        </motion.form>
      </div>
    </PageTransition>
  )
}

export default Contact
