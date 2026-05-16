import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import { getUsers } from '../services/users.js'
import { useAuthStore } from '../store/useAuthStore.js'

function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setAdmin = useAuthStore((state) => state.setAdmin)
  const setCustomer = useAuthStore((state) => state.setCustomer)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const users = await getUsers()
      if (import.meta.env.DEV) {
        console.info('Users loaded', { count: users.length })
      }
      const normalizedEmail = email.trim().toLowerCase()
      const matchedUser = users.find(
        (user) =>
          user.email?.toLowerCase() === normalizedEmail &&
          user.password === password,
      )

      if (!matchedUser) {
        toast.error('Invalid email or password')
        return
      }

      if (matchedUser.role === 'admin') {
        setAdmin(matchedUser)
        toast.success('Welcome, admin')
        navigate('/admin')
        return
      }

      setCustomer(matchedUser)
      toast.success('Welcome back')
      navigate('/profile')
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Login failed', err)
      }
      toast.error('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <h1 className="text-3xl font-display text-ink">
          {t('auth.loginTitle')}
        </h1>
        <p className="text-sm text-cedar/70">{t('auth.loginDescription')}</p>
      </div>
      <form className="surface rounded-[36px] p-8" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <input
            className="input-field"
            type="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            minLength={6}
            required
          />
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? t('auth.signingIn') : t('auth.loginButton')}
          </button>
        </div>
        <p className="mt-6 text-sm text-cedar/70">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-ink underline">
            {t('auth.createOne')}
          </Link>
        </p>
      </form>
    </PageTransition>
  )
}

export default Login
