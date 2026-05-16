import { useTranslation } from 'react-i18next'

function ProductFilters({
  categories,
  search,
  onSearch,
  category,
  onCategory,
}) {
  const { t } = useTranslation()
  const categoryLabels = {
    Ceramics: t('categories.ceramics'),
    Textiles: t('categories.textiles'),
    Woodwork: t('categories.woodwork'),
    Leather: t('categories.leather'),
    Metalwork: t('categories.metalwork'),
    'Home Rituals': t('categories.homeRituals'),
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-sand/40 bg-white/80 p-5 shadow-soft md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('products.searchPlaceholder')}
          className="input-field"
        />
      </div>
      <select
        value={category}
        onChange={(event) => onCategory(event.target.value)}
        className="input-field md:max-w-xs"
      >
        <option value="All">{t('products.allCategories')}</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {categoryLabels[item] || item}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProductFilters
