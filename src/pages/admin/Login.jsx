import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../../components/shared/PageTransition.jsx'
import { getAdmins } from '../../services/admins.js'
import { useAuthStore } from '../../store/useAuthStore.js'

function AdminLogin() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setAdmin = useAuthStore((state) => state.setAdmin)
  const admin = useAuthStore((state) => state.admin)
  const customer = useAuthStore((state) => state.customer)
  const navigate = useNavigate()

  useEffect(() => {
    if (admin?.role === 'admin') {
      navigate('/admin')
      return
    }
    if (customer?.role === 'customer') {
      navigate('/')
    }
  }, [admin, customer, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const admins = await getAdmins()
      const normalizedEmail = email.trim().toLowerCase()
      const admin = admins.find(
        (item) =>
          item.email?.toLowerCase() === normalizedEmail &&
          item.password === password,
      )

      if (!admin) {
        toast.error('Invalid admin credentials')
        return
      }

      setAdmin(admin)
      toast.success('Welcome, admin')
      navigate('/admin')
    } catch (err) {
      console.error('Admin login failed', err)
      toast.error('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <p className="pill">{t('admin.admin')}</p>
        <h1 className="text-3xl font-display text-ink">{t('auth.loginTitle')}</h1>
        <p className="text-sm text-cedar/70">
          {t('auth.loginDescription')}
        </p>
      </div>
      <form className="surface rounded-[36px] p-8" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <input
            className="input-field"
            type="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? t('auth.signingIn') : t('auth.loginButton')}
          </button>
        </div>
      </form>
    </PageTransition>
  )
}

export default AdminLogin
