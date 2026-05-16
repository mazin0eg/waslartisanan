import { useTranslation } from 'react-i18next'
import ProductCard from './ProductCard.jsx'
import SkeletonCard from '../shared/SkeletonCard.jsx'
import EmptyState from '../shared/EmptyState.jsx'

function ProductGrid({ products = [], loading }) {
  const { t } = useTranslation()
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <EmptyState
        title={t('products.emptyTitle')}
        message={t('products.emptyMessage')}
      />
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
