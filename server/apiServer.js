import bcrypt from 'bcryptjs'
import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import fs from 'fs'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import rateLimit from 'express-rate-limit'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { body, param, validationResult } from 'express-validator'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = Number(process.env.API_PORT) || 4000
const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me'
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '2h'
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const dbPath = process.env.DB_PATH || path.join(__dirname, 'db.json')
const dbSeedPath = process.env.DB_SEED_PATH || ''
const maxFileSizeMb = Number(process.env.UPLOAD_MAX_FILE_SIZE_MB) || 2
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'public', 'uploads')

if (process.env.NODE_ENV === 'production' && jwtSecret === 'dev-secret-change-me') {
  console.error('JWT_SECRET must be set in production.')
  process.exit(1)
}

fs.mkdirSync(path.dirname(dbPath), { recursive: true })
fs.mkdirSync(uploadsDir, { recursive: true })

if (!fs.existsSync(dbPath)) {
  if (dbSeedPath && fs.existsSync(dbSeedPath)) {
    fs.copyFileSync(dbSeedPath, dbPath)
  } else {
    fs.writeFileSync(dbPath, JSON.stringify({ products: [], users: [], orders: [] }, null, 2))
  }
}

const adapter = new JSONFile(dbPath)
const db = new Low(adapter, { products: [], users: [], orders: [] })

const loadDb = async () => {
  await db.read()
  if (!db.data) {
    db.data = { products: [], users: [], orders: [] }
  }
}

const saveDb = async () => {
  await db.write()
}

const ensurePasswordHashes = async () => {
  await loadDb()
  let changed = false
  for (const user of db.data.users) {
    if (user.password && !user.password.startsWith('$2')) {
      user.password = await bcrypt.hash(user.password, 10)
      changed = true
    }
  }
  if (changed) {
    await saveDb()
  }
}

await ensurePasswordHashes()

const sanitizeUser = (user) => {
  if (!user) return null
  const { password, ...safe } = user
  return safe
}

const signToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  )

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(token, jwtSecret)
    req.user = payload
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

const authenticateOptional = (req, _res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return next()
  try {
    req.user = jwt.verify(token, jwtSecret)
  } catch (err) {
    req.user = null
  }
  return next()
}

const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  return next()
}

const validate = (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: result.array() })
  }
  return next()
}

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
      if (!origin || corsOrigins.length === 0 || corsOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('CORS origin not allowed'))
    },
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(uploadsDir))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post(
  '/api/auth/register',
  authLimiter,
  body('name').isLength({ min: 2 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').isLength({ min: 6 }).trim(),
  validate,
  async (req, res) => {
    await loadDb()
    const email = req.body.email.toLowerCase()
    const exists = db.data.users.some((user) => user.email?.toLowerCase() === email)
    if (exists) {
      return res.status(409).json({ error: 'Email already exists' })
    }

    const user = {
      id: crypto.randomUUID(),
      name: req.body.name.trim(),
      email,
      phone: req.body.phone.trim(),
      role: 'customer',
      password: await bcrypt.hash(req.body.password, 10),
      createdAt: new Date().toISOString(),
    }

    db.data.users.push(user)
    await saveDb()

    return res.status(201).json({ user: sanitizeUser(user) })
  },
)

app.post(
  '/api/auth/login',
  authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  async (req, res) => {
    await loadDb()
    const email = req.body.email.toLowerCase()
    const user = db.data.users.find((item) => item.email?.toLowerCase() === email)
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    let passwordValid = false
    if (user.password.startsWith('$2')) {
      passwordValid = await bcrypt.compare(req.body.password, user.password)
    } else if (user.password === req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10)
      await saveDb()
      passwordValid = true
    }

    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = signToken(user)
    return res.json({ token, user: sanitizeUser(user) })
  },
)

app.get('/api/users', authenticate, requireRole('admin'), async (_req, res) => {
  await loadDb()
  return res.json(db.data.users.map(sanitizeUser))
})

app.get('/api/products', async (_req, res) => {
  await loadDb()
  return res.json(db.data.products)
})

app.get(
  '/api/products/:id',
  param('id').isLength({ min: 1 }),
  validate,
  async (req, res) => {
    await loadDb()
    const product = db.data.products.find((item) => String(item.id) === req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Not found' })
    }
    return res.json(product)
  },
)

app.post(
  '/api/products',
  authenticate,
  requireRole('admin'),
  body('title').isLength({ min: 2 }).trim(),
  body('description').isLength({ min: 5 }).trim(),
  body('price').isNumeric(),
  body('stock').isNumeric(),
  body('category').isLength({ min: 2 }).trim(),
  validate,
  async (req, res) => {
    await loadDb()
    const product = {
      id: crypto.randomUUID(),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      price: Number(req.body.price),
      image: req.body.image || '',
      category: req.body.category.trim(),
      stock: Number(req.body.stock),
    }
    db.data.products.push(product)
    await saveDb()
    return res.status(201).json(product)
  },
)

app.put(
  '/api/products/:id',
  authenticate,
  requireRole('admin'),
  param('id').isLength({ min: 1 }),
  body('title').isLength({ min: 2 }).trim(),
  body('description').isLength({ min: 5 }).trim(),
  body('price').isNumeric(),
  body('stock').isNumeric(),
  body('category').isLength({ min: 2 }).trim(),
  validate,
  async (req, res) => {
    await loadDb()
    const index = db.data.products.findIndex((item) => String(item.id) === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Not found' })
    }
    const updated = {
      ...db.data.products[index],
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      price: Number(req.body.price),
      image: req.body.image || db.data.products[index].image,
      category: req.body.category.trim(),
      stock: Number(req.body.stock),
    }
    db.data.products[index] = updated
    await saveDb()
    return res.json(updated)
  },
)

app.delete(
  '/api/products/:id',
  authenticate,
  requireRole('admin'),
  param('id').isLength({ min: 1 }),
  validate,
  async (req, res) => {
    await loadDb()
    const index = db.data.products.findIndex((item) => String(item.id) === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Not found' })
    }
    db.data.products.splice(index, 1)
    await saveDb()
    return res.status(204).send()
  },
)

app.get('/api/orders', authenticate, requireRole('admin'), async (_req, res) => {
  await loadDb()
  return res.json(db.data.orders)
})

app.post(
  '/api/orders',
  authenticateOptional,
  body('customerName').isLength({ min: 2 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isLength({ min: 6 }).trim(),
  body('address').isLength({ min: 4 }).trim(),
  body('city').isLength({ min: 2 }).trim(),
  body('items').isArray({ min: 1 }),
  body('total').isNumeric(),
  validate,
  async (req, res) => {
    await loadDb()
    const order = {
      id: crypto.randomUUID(),
      customerName: req.body.customerName.trim(),
      email: req.body.email.toLowerCase(),
      phone: req.body.phone.trim(),
      address: req.body.address.trim(),
      city: req.body.city.trim(),
      notes: req.body.notes?.trim() || '',
      items: req.body.items,
      total: Number(req.body.total),
      status: req.body.status || 'Processing',
      createdAt: req.body.createdAt || new Date().toISOString(),
      customerId: req.user?.sub || null,
    }
    db.data.orders.push(order)
    await saveDb()
    return res.status(201).json(order)
  },
)

app.post('/api/upload', authenticate, requireRole('admin'), (req, res) => {
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

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`API server running on http://localhost:${port}`)
  }
})
