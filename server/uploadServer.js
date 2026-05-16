import cors from 'cors'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')

fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const unique = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${ext}`)
  },
})

const fileFilter = (_req, file, cb) => {
  if (file.mimetype?.startsWith('image/')) {
    cb(null, true)
    return
  }
  cb(new Error('Only image uploads are allowed'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})

const app = express()
app.use(cors({ origin: true }))
app.use('/uploads', express.static(uploadsDir))

app.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400
      return res.status(status).json({ error: err.message || 'Upload failed' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    return res.json({ imageUrl: `/uploads/${req.file.filename}` })
  })
})

const port = process.env.UPLOAD_PORT || 3002
app.listen(port, () => {
  console.log(`Upload server running on http://localhost:${port}`)
})
