import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { useCartStore } from '../../store/useCartStore.js'
import { resolveImageUrl } from '../../utils/resolveImageUrl.js'

function CartItem({ item }) {
  const { t } = useTranslation()
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-sand/40 bg-white/90 p-5 shadow-soft md:flex-row md:items-center">
      <img
        src={resolveImageUrl(item.image)}
        alt={item.title}
        className="h-24 w-24 rounded-2xl object-cover"
      />
      <div className="flex-1">
        <p className="text-lg font-display text-ink">{item.title}</p>
        <p className="text-sm text-cedar/70">{item.category}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="ghost-button text-xs"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          -
        </button>
        <span className="text-sm font-medium text-ink">{item.quantity}</span>
        <button
          type="button"
          className="ghost-button text-xs"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-ink">
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          type="button"
          className="text-xs uppercase tracking-[0.3em] text-cedar/70 hover:text-ink"
          onClick={() => removeItem(item.id)}
        >
          {t('cartItem.remove')}
        </button>
      </div>
    </div>
  )
}

export default CartItem
