import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import { createUser, getUsers } from '../services/users.js'

function Register() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const users = await getUsers()
      const normalizedEmail = form.email.trim().toLowerCase()
      const exists = users.some(
        (user) => user.email?.toLowerCase() === normalizedEmail,
      )

      if (exists) {
        toast.error('Email already exists')
        return
      }

      await createUser({
        name: form.name.trim(),
        email: normalizedEmail,
        password: form.password,
        phone: form.phone.trim(),
        role: 'customer',
      })
      toast.success('Account created. Please log in.')
      navigate('/login')
    } catch (err) {
      console.error('Registration failed', err)
      toast.error('Unable to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <h1 className="text-3xl font-display text-ink">
          {t('auth.registerTitle')}
        </h1>
        <p className="text-sm text-cedar/70">{t('auth.registerDescription')}</p>
      </div>
      <form className="surface rounded-[36px] p-8" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <input
            className="input-field"
            name="name"
            placeholder={t('auth.fullName')}
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder={t('auth.email')}
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            placeholder={t('auth.password')}
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="phone"
            placeholder={t('auth.phone')}
            value={form.phone}
            onChange={handleChange}
            required
          />
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? t('auth.creating') : t('auth.registerButton')}
          </button>
        </div>
        <p className="mt-6 text-sm text-cedar/70">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="text-ink underline">
            {t('auth.loginLink')}
          </Link>
        </p>
      </form>
    </PageTransition>
  )
}

export default Register
