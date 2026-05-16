import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import SkeletonCard from '../components/shared/SkeletonCard.jsx'
import { getProduct } from '../services/products.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { resolveImageUrl } from '../utils/resolveImageUrl.js'
import { useCartStore } from '../store/useCartStore.js'

function ProductDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProduct(id)
        setProduct(data)
        setError(null)
      } catch (err) {
        setError('Unable to load this product.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-lg">
          <SkeletonCard />
        </div>
      </PageTransition>
    )
  }

  if (error || !product) {
    return (
      <PageTransition>
        <p className="text-sm text-cedar/70">{error}</p>
      </PageTransition>
    )
  }

  const handleAdd = () => {
    addItem(product)
    toast.success('Added to cart')
  }

  return (
    <PageTransition className="space-y-10">
      <Link to="/products" className="text-xs uppercase tracking-[0.3em] text-cedar/70">
        {t('productDetails.back')}
      </Link>
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-[36px] border border-sand/40 bg-white/90 shadow-card">
          <img
            src={resolveImageUrl(product.image)}
            alt={product.title}
            className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
          />
        </div>
        <div className="space-y-6">
          <span className="pill">{product.categoryName || product.category}</span>
          <h1 className="text-3xl font-display text-ink md:text-4xl">
            {product.title}
          </h1>
          <p className="text-sm text-cedar/70">{product.description}</p>
          <p className="text-2xl font-semibold text-ink">
            {formatCurrency(product.price)}
          </p>
          <div className="flex flex-wrap gap-4">
            <button type="button" className="primary-button" onClick={handleAdd}>
              {t('productDetails.addToCart')}
            </button>
            <Link to="/cart" className="ghost-button">
              {t('productDetails.viewCart')}
            </Link>
          </div>
          <div className="rounded-3xl border border-sand/40 bg-white/70 p-6 text-sm text-cedar/70">
            <p className="uppercase tracking-[0.3em] text-cedar/60">
              {t('productDetails.details')}
            </p>
            <ul className="mt-3 space-y-2">
              <li>{t('productDetails.stock', { count: product.stock })}</li>
              <li>{t('productDetails.artisanNote')}</li>
              <li>{t('productDetails.minimalistNote')}</li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default ProductDetails
