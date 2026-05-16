import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import SectionHeading from '../components/shared/SectionHeading.jsx'
import ProductFilters from '../components/product/ProductFilters.jsx'
import ProductGrid from '../components/product/ProductGrid.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { useCategories } from '../hooks/useCategories.js'
import { useDebounce } from '../hooks/useDebounce.js'

function Products() {
  const { t } = useTranslation()
  const { products, loading, error } = useProducts()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    const selectedCategory = categories.find(
      (item) => String(item.id) === String(category),
    )
    const selectedName = selectedCategory?.name
    return products.filter((product) => {
      const matchesCategory =
        category === 'All' ||
        String(product.categoryId || '') === String(category) ||
        (selectedName &&
          (product.categoryName === selectedName ||
            product.category === selectedName))
      const matchesSearch = product.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, category, debouncedSearch, categories])

  return (
    <PageTransition className="space-y-10">
      <SectionHeading
        label={t('products.label')}
        title={t('products.title')}
        description={t('products.description')}
      />
      <ProductFilters
        categories={categories}
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
      />
      {error ? <p className="text-sm text-cedar/70">{error}</p> : null}
      <ProductGrid products={filtered} loading={loading} />
    </PageTransition>
  )
}

export default Products
