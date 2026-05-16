import { useTranslation } from 'react-i18next'

function ProductFilters({
  categories,
  search,
  onSearch,
  category,
  onCategory,
}) {
  const { t } = useTranslation()

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
          <option key={item.id} value={String(item.id)}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProductFilters
