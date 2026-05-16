import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageTransition from '../../components/shared/PageTransition.jsx'
import { createProduct, getProduct, updateProduct } from '../../services/products.js'
import { uploadImage } from '../../services/uploads.js'
import { useCategories } from '../../hooks/useCategories.js'
import { resolveImageUrl } from '../../utils/resolveImageUrl.js'

const emptyForm = {
  title: '',
  description: '',
  price: '',
  image: '',
  categoryId: '',
  categoryName: '',
  stock: '',
}

function AdminProductForm() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const { categories, loading: categoriesLoading } = useCategories()

  useEffect(() => {
    if (form.categoryId || !categories.length) return
    const matched = form.categoryName
      ? categories.find((item) => item.name === form.categoryName)
      : null
    const next = matched || categories[0]
    if (!next) return
    setForm((prev) => ({
      ...prev,
      categoryId: String(next.id),
      categoryName: next.name,
    }))
  }, [categories, form.categoryId, form.categoryName])

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const data = await getProduct(id)
        const categoryName = data.categoryName || data.category || ''
        const categoryId = data.categoryId
          ? String(data.categoryId)
          : (categories.find((item) => item.name === categoryName)?.id
              ? String(categories.find((item) => item.name === categoryName)?.id)
              : '')
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          image: data.image,
          categoryId,
          categoryName,
          stock: data.stock,
        })
        setPreview(resolveImageUrl(data.image))
        setImageFile(null)
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Unable to load product', err)
        }
        toast.error('Unable to load product')
      }
    }

    load()
  }, [id, categories])

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'categoryId') {
      const selected = categories.find(
        (item) => String(item.id) === String(value),
      )
      setForm((prev) => ({
        ...prev,
        categoryId: value,
        categoryName: selected?.name || prev.categoryName,
      }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be smaller than 2MB')
        return
      }
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Unable to read image file', err)
      }
      toast.error('Unable to read image file')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (
      !form.title ||
      !form.description ||
      form.price === '' ||
      form.stock === '' ||
      !form.categoryId
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!categories.length) {
      toast.error('Please create a category before adding products')
      return
    }

    if (!imageFile && !form.image) {
      toast.error('Please upload a product image')
      return
    }

    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(stock) || stock < 0) {
      toast.error('Please enter a valid price and stock amount')
      return
    }

    setLoading(true)
    let imagePath = form.image
    const selectedCategory = categories.find(
      (item) => String(item.id) === String(form.categoryId),
    )

    if (!selectedCategory) {
      toast.error('Please choose a valid category')
      setLoading(false)
      return
    }

    try {
      if (imageFile) {
        const uploadResponse = await uploadImage(imageFile)
        imagePath = uploadResponse.imageUrl
      }

      const payload = {
        ...form,
        categoryId: String(selectedCategory.id),
        categoryName: selectedCategory.name,
        category: selectedCategory.name,
        image: imagePath,
        price,
        stock,
      }

      if (id) {
        await updateProduct(id, payload)
        toast.success('Product updated')
      } else {
        await createProduct(payload)
        toast.success('Product created')
      }

      navigate('/admin/products')
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Unable to save product', err)
      }
      toast.error('Unable to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-display text-ink">
          {id ? t('admin.productForm.editTitle') : t('admin.productForm.createTitle')}
        </h2>
        <Link to="/admin/products" className="ghost-button text-xs">
          {t('admin.productForm.back')}
        </Link>
      </div>
      <form className="surface rounded-[36px] p-8" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <input
            className="input-field"
            name="title"
            placeholder={t('admin.productForm.title')}
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            className="input-field min-h-[120px]"
            name="description"
            placeholder={t('admin.productForm.description')}
            value={form.description}
            onChange={handleChange}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="input-field"
              name="price"
              type="number"
              min="0"
              placeholder={t('admin.productForm.price')}
              value={form.price}
              onChange={handleChange}
              required
            />
            <input
              className="input-field"
              name="stock"
              type="number"
              min="0"
              placeholder={t('admin.productForm.stock')}
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <input
              className="input-field"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!id && !form.image}
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-40 w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-sand/60 bg-cream/60 p-6 text-sm text-cedar/70">
                {t('admin.productForm.uploadPrompt')}
              </div>
            )}
          </div>
          <select
            className="input-field"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            disabled={categoriesLoading || !categories.length}
          >
            {categoriesLoading ? (
              <option value="">Loading categories...</option>
            ) : categories.length ? (
              categories.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name}
                </option>
              ))
            ) : (
              <option value="">No categories available</option>
            )}
          </select>
          {!categoriesLoading && !categories.length ? (
            <p className="text-xs text-cedar/70">
              Create categories in the{' '}
              <Link to="/admin/categories" className="text-ink underline">
                categories panel
              </Link>{' '}
              before adding products.
            </p>
          ) : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? t('admin.productForm.saving') : t('admin.productForm.save')}
          </button>
        </div>
      </form>
    </PageTransition>
  )
}

export default AdminProductForm
