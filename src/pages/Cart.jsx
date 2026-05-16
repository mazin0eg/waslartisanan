import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import CartItem from '../components/cart/CartItem.jsx'
import CartSummary from '../components/cart/CartSummary.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import { useCartStore } from '../store/useCartStore.js'

function Cart() {
  const { t } = useTranslation()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  if (!items.length) {
    return (
      <PageTransition>
        <EmptyState
          title={t('cart.emptyTitle')}
          message={t('cart.emptyMessage')}
          action={
            <Link to="/products" className="primary-button">
              {t('cart.browseProducts')}
            </Link>
          }
        />
      </PageTransition>
    )
  }

  return (
    <PageTransition className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-display text-ink">{t('cart.title')}</h1>
        <button
          type="button"
          className="ghost-button text-xs"
          onClick={clearCart}
        >
          {t('cart.clear')}
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="space-y-4">
          <CartSummary items={items} />
          <Link to="/checkout" className="primary-button w-full">
            {t('cart.proceed')}
          </Link>
        </div>
      </div>
    </PageTransition>
  )
}

export default Cart
