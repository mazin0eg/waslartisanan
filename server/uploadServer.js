import cors from 'cors'
import express from 'express'
import fs from 'fs'
import helmet from 'helmet'
import multer from 'multer'
import path from 'path'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')
const maxFileSizeMb = Number(process.env.UPLOAD_MAX_FILE_SIZE_MB) || 2
const allowedOrigins = (process.env.UPLOAD_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

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
  limits: { fileSize: maxFileSizeMb * 1024 * 1024 },
})

const app = express()
app.set('trust proxy', 1)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('CORS origin not allowed'))
    },
  }),
)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/uploads', express.static(uploadsDir))
app.use('/upload', uploadLimiter)

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

app.use((err, _req, res, _next) => {
  if (err?.message?.includes('CORS')) {
    return res.status(403).json({ error: 'Origin not allowed' })
  }
  return res.status(500).json({ error: 'Server error' })
})

const port = process.env.UPLOAD_PORT || 3002
app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Upload server running on http://localhost:${port}`)
  }
})
