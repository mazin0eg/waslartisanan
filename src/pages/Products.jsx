import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/shared/PageTransition.jsx'
import SectionHeading from '../components/shared/SectionHeading.jsx'
import ProductFilters from '../components/product/ProductFilters.jsx'
import ProductGrid from '../components/product/ProductGrid.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { useDebounce } from '../hooks/useDebounce.js'
import { categories } from '../data/categories.js'

function Products() {
  const { t } = useTranslation()
  const { products, loading, error } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === 'All' || product.category === category
      const matchesSearch = product.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, category, debouncedSearch])

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
