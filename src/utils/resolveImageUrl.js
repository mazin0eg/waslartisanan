const uploadBaseUrl = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3002'

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  if (imagePath.startsWith('/uploads/')) {
    return `${uploadBaseUrl}${imagePath}`
  }
  return imagePath
}
