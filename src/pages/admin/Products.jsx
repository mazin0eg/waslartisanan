import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../../components/shared/PageTransition.jsx'
import EmptyState from '../../components/shared/EmptyState.jsx'
import ConfirmDialog from '../../components/shared/ConfirmDialog.jsx'
import { deleteProduct, getProducts } from '../../services/products.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { resolveImageUrl } from '../../utils/resolveImageUrl.js'

function AdminProducts() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState(null)
  const pageSize = 5

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      setError('')
    } catch (err) {
      console.error('Unable to load products', err)
      setProducts([])
      setError(t('admin.products.loadError'))
      toast.error(t('admin.products.loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      toast.success('Product removed')
      load()
    } catch (err) {
      console.error('Unable to delete product', err)
      toast.error('Unable to delete product')
    }
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return products
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term),
    )
  }, [products, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display text-ink">
            {t('admin.products.title')}
          </h2>
          <p className="text-sm text-cedar/70">{t('admin.products.description')}</p>
        </div>
        <Link to="/admin/products/new" className="primary-button">
          {t('admin.products.createProduct')}
        </Link>
      </div>
      <div className="surface rounded-3xl p-4">
        <input
          className="input-field"
          placeholder={t('admin.products.searchPlaceholder')}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
        />
      </div>
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-cedar/70">{t('admin.products.loading')}</p>
        ) : error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : filtered.length ? (
          <>
            <div className="hidden rounded-3xl border border-sand/40 bg-white/80 px-5 py-3 text-xs uppercase tracking-[0.3em] text-cedar/60 md:grid md:grid-cols-[1.6fr_0.7fr_0.5fr_0.7fr]">
              <span>{t('admin.products.product')}</span>
              <span>{t('admin.products.category')}</span>
              <span>{t('admin.products.price')}</span>
              <span>{t('admin.products.actions')}</span>
            </div>
            {paginated.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-3xl border border-sand/40 bg-white/90 p-5 shadow-soft md:grid md:grid-cols-[1.6fr_0.7fr_0.5fr_0.7fr] md:items-center"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.title}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-lg font-display text-ink">
                      {product.title}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-cedar/60">
                      {t('admin.products.stock')}: {product.stock}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-cedar/70">{product.category}</p>
                <p className="text-sm text-ink">
                  {formatCurrency(product.price)}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/products/${product.id}`}
                    className="ghost-button text-xs"
                  >
                    {t('admin.products.view')}
                  </Link>
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="ghost-button text-xs"
                  >
                    {t('admin.products.edit')}
                  </Link>
                  <button
                    type="button"
                    className="ghost-button text-xs"
                    onClick={() => setPendingDelete(product)}
                  >
                    {t('admin.products.delete')}
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cedar/60">
                {t('admin.products.page', { page, total: totalPages })}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="ghost-button text-xs"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                >
                  {t('admin.products.previous')}
                </button>
                <button
                  type="button"
                  className="ghost-button text-xs"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                >
                  {t('admin.products.next')}
                </button>
              </div>
            </div>
          </>
        ) : products.length ? (
          <EmptyState
            title={t('admin.products.noMatchTitle')}
            message={t('admin.products.noMatchMessage')}
          />
        ) : (
          <EmptyState
            title={t('admin.products.noProductsTitle')}
            message={t('admin.products.noProductsMessage')}
          />
        )}
      </div>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.products.deleteTitle')}
        description={t('admin.products.deleteDescription')}
        confirmLabel={t('admin.products.deleteConfirm')}
        cancelLabel={t('admin.products.cancel')}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            handleDelete(pendingDelete.id)
          }
          setPendingDelete(null)
        }}
      />
    </PageTransition>
  )
}

export default AdminProducts
