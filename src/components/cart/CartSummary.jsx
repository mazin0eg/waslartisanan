import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../../utils/formatCurrency.js'

function CartSummary({ items }) {
  const { t } = useTranslation()
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const shipping = subtotal > 0 ? 25 : 0
  const total = subtotal + shipping

  return (
    <div className="surface rounded-3xl p-6">
      <h3 className="text-xl font-display text-ink">{t('cart.summaryTitle')}</h3>
      <div className="mt-4 space-y-3 text-sm text-cedar/70">
        <div className="flex items-center justify-between">
          <span>{t('cart.subtotal')}</span>
          <span className="text-ink">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{t('cart.shipping')}</span>
          <span className="text-ink">{formatCurrency(shipping)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-sand/40 pt-3 text-base font-medium text-ink">
          <span>{t('cart.total')}</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default CartSummary
