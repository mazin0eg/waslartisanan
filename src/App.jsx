import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const applyLanguage = (lang) => {
      document.documentElement.lang = lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      localStorage.setItem('wasl-lang', lang)
    }

    applyLanguage(i18n.language)
    i18n.on('languageChanged', applyLanguage)

    return () => {
      i18n.off('languageChanged', applyLanguage)
    }
  }, [i18n])

  return <AppRoutes />
}

export default App
