import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCartStore } from '../../store/useCartStore.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { resolveImageUrl } from '../../utils/resolveImageUrl.js'

function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem(product)
    toast.success('Added to cart')
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sand/40 bg-white/90 shadow-card"
    >
      <div className="relative overflow-hidden">
        <img
          src={resolveImageUrl(product.image)}
          alt={product.title}
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cedar">
          {product.categoryName || product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <Link
            to={`/products/${product.id}`}
            className="text-lg font-display text-ink transition hover:text-cedar"
          >
            {product.title}
          </Link>
          <p className="mt-2 text-sm text-cedar/70">
            {product.description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-ink">
            {formatCurrency(product.price)}
          </span>
          <button type="button" className="ghost-button text-xs" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
