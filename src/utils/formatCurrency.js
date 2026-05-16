export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(value)
