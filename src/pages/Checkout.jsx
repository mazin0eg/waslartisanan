import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import CartSummary from '../components/cart/CartSummary.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import { useCartStore } from '../store/useCartStore.js'
import { createOrder } from '../services/orders.js'

function Checkout() {
  const { t } = useTranslation()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  })

  if (!items.length) {
    return (
      <PageTransition>
        <EmptyState
          title={t('checkout.emptyTitle')}
          message={t('checkout.emptyMessage')}
          action={
            <Link to="/products" className="primary-button">
              {t('checkout.browseProducts')}
            </Link>
          }
        />
      </PageTransition>
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.address || !form.city) {
      toast.error('Please fill in all required fields')
      return
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    try {
      await createOrder({
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        notes: form.notes,
        items,
        total,
        status: 'Processing',
        createdAt: new Date().toISOString(),
      })

      clearCart()
      toast.success('Order placed successfully')
      navigate('/profile')
    } catch (err) {
      toast.error('Unable to place order. Please try again.')
    }
  }

  return (
    <PageTransition className="space-y-10">
      <h1 className="text-3xl font-display text-ink">{t('checkout.title')}</h1>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="surface rounded-[36px] p-8" onSubmit={handleSubmit}>
          <h2 className="text-xl font-display text-ink">
            {t('checkout.customerDetails')}
          </h2>
          <div className="mt-6 grid gap-4">
            <input
              className="input-field"
              name="name"
              placeholder={t('checkout.fullName')}
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="input-field"
              type="email"
              name="email"
              placeholder={t('checkout.email')}
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="input-field"
              name="phone"
              placeholder={t('checkout.phone')}
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              className="input-field"
              name="address"
              placeholder={t('checkout.address')}
              value={form.address}
              onChange={handleChange}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="input-field"
                name="city"
                placeholder={t('checkout.city')}
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              className="input-field min-h-[110px]"
              name="notes"
              placeholder={t('checkout.notes')}
              value={form.notes}
              onChange={handleChange}
            />
            <button type="submit" className="primary-button">
              {t('checkout.placeOrder')}
            </button>
          </div>
        </form>
        <CartSummary items={items} />
      </div>
    </PageTransition>
  )
}

export default Checkout
