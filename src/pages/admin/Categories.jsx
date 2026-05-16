import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../../components/shared/PageTransition.jsx'
import EmptyState from '../../components/shared/EmptyState.jsx'
import ConfirmDialog from '../../components/shared/ConfirmDialog.jsx'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../services/categories.js'
import { getProducts, updateProduct } from '../../services/products.js'

function AdminCategories() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
      setError('')
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Unable to load categories', err)
      }
      setCategories([])
      setError(t('admin.categories.loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return categories
    return categories.filter((category) =>
      category.name?.toLowerCase().includes(term),
    )
  }, [categories, search])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error(t('admin.categories.validation'))
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const current = categories.find((item) => item.id === editingId)
        await updateCategory(editingId, { name: trimmed })
        const previousName = current?.name || ''
        try {
          const products = await getProducts()
          const updates = products.filter((product) => {
            const matchId = String(product.categoryId || '') === String(editingId)
            const matchName =
              previousName &&
              (product.categoryName === previousName || product.category === previousName)
            return matchId || matchName
          })
          await Promise.all(
            updates.map((product) =>
              updateProduct(product.id, {
                ...product,
                categoryId: String(editingId),
                categoryName: trimmed,
                category: trimmed,
              }),
            ),
          )
        } catch (syncError) {
          if (import.meta.env.DEV) {
            console.error('Unable to sync products', syncError)
          }
        }
        toast.success(t('admin.categories.updated'))
      } else {
        await createCategory({ name: trimmed })
        toast.success(t('admin.categories.created'))
      }
      setName('')
      setEditingId(null)
      await load()
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Unable to save category', err)
      }
      toast.error(t('admin.categories.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setName(category.name || '')
  }

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id)
      toast.success(t('admin.categories.deleted'))
      await load()
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Unable to delete category', err)
      }
      toast.error(t('admin.categories.deleteError'))
    }
  }

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display text-ink">
            {t('admin.categories.title')}
          </h2>
          <p className="text-sm text-cedar/70">{t('admin.categories.description')}</p>
        </div>
      </div>

      <form className="surface rounded-3xl p-6" onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center gap-4">
          <input
            className="input-field flex-1"
            placeholder={t('admin.categories.namePlaceholder')}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button type="submit" className="primary-button" disabled={saving}>
            {saving
              ? t('admin.categories.saving')
              : editingId
              ? t('admin.categories.update')
              : t('admin.categories.create')}
          </button>
          {editingId ? (
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                setEditingId(null)
                setName('')
              }}
            >
              {t('admin.categories.cancel')}
            </button>
          ) : null}
        </div>
      </form>

      <div className="surface rounded-3xl p-4">
        <input
          className="input-field"
          placeholder={t('admin.categories.searchPlaceholder')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-cedar/70">{t('admin.categories.loading')}</p>
        ) : error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : filtered.length ? (
          <div className="space-y-3">
            {filtered.map((category) => (
              <div
                key={category.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-sand/40 bg-white/90 p-5 shadow-soft"
              >
                <div>
                  <p className="text-lg font-display text-ink">{category.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-cedar/60">
                    {t('admin.categories.idLabel')}: {category.id}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="ghost-button text-xs"
                    onClick={() => handleEdit(category)}
                  >
                    {t('admin.categories.edit')}
                  </button>
                  <button
                    type="button"
                    className="ghost-button text-xs"
                    onClick={() => setPendingDelete(category)}
                  >
                    {t('admin.categories.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('admin.categories.emptyTitle')}
            message={t('admin.categories.emptyMessage')}
          />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.categories.deleteTitle')}
        description={t('admin.categories.deleteDescription')}
        confirmLabel={t('admin.categories.deleteConfirm')}
        cancelLabel={t('admin.categories.cancel')}
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

export default AdminCategories
