require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const rateLimit  = require('express-rate-limit')
const hpp        = require('hpp')
const compression = require('compression')
const cron       = require('node-cron')
const path       = require('path')
const fs         = require('fs')

const articlesRoute = require('./routes/articles')
const adminRoute    = require('./routes/admin')
const { fetchAllNews } = require('./jobs/fetchNews')

const app  = express()
const PORT = process.env.PORT || 4000

// ─── 1. SECURITY HEADERS (Helmet) ────────────────────────────────
// Helmet automatically sets 15+ HTTP security headers
app.use(helmet({
  contentSecurityPolicy: false, // we handle CORS ourselves
  crossOriginEmbedderPolicy: false,
}))

// ─── 2. COMPRESSION (Speed) ──────────────────────────────────────
app.use(compression())

// ─── 3. CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://appradar.in',         // future domain
  'https://www.appradar.in',
]
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.options('*', cors())

// ─── 4. BODY PARSER (with size limit) ────────────────────────────
app.use(express.json({ limit: '1mb' }))       // max 1MB request body
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// ─── 5. HTTP PARAMETER POLLUTION PROTECTION ──────────────────────
app.use(hpp())

// ─── 6. RATE LIMITING ────────────────────────────────────────────
// General API limit
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 300,                    // 300 requests per IP
  message: { success: false, message: 'Too many requests. Please wait.' },
  standardHeaders: true,
  legacyHeaders: false,
}))

// Admin endpoints - stricter limit
app.use('/api/admin', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many admin requests.' },
}))

// ─── 7. SECURITY MIDDLEWARE - Block bad requests ──────────────────
app.use((req, res, next) => {
  // Block requests with suspicious patterns in URL
  const suspiciousPatterns = [
    /\.\.\//,           // Path traversal
    /<script/i,         // XSS in URL
    /union.*select/i,   // SQL injection
    /exec\(/i,          // Code execution
    /eval\(/i,
    /javascript:/i,
    /vbscript:/i,
  ]
  const url = decodeURIComponent(req.url)
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      return res.status(400).json({ success: false, message: 'Bad request' })
    }
  }
  next()
})

// ─── 8. HIDE SERVER INFO ─────────────────────────────────────────
app.disable('x-powered-by')
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By')
  next()
})

// ─── ROUTES ──────────────────────────────────────────────────────
app.use('/api/articles', articlesRoute)
app.use('/api/admin',    adminRoute)

// ─── CATEGORIES ──────────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  try {
    const cats = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf8')
    )
    res.json({ success: true, categories: cats })
  } catch {
    res.json({ success: true, categories: [] })
  }
})

// ─── HEALTH CHECK ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 AppRadar India API Running!',
    time: new Date().toISOString(),
    security: '✅ Protected',
  })
})

// ─── SITEMAP.XML (SEO) ────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  try {
    const articles = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'articles.json'), 'utf8')
    ) || []

    const domain = process.env.DOMAIN || 'https://appradar.in'
    const urls = [
      `<url><loc>${domain}/</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${domain}/category/ai-tools</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${domain}/category/apps</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${domain}/category/india-tech</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${domain}/category/websites</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
      `<url><loc>${domain}/category/gaming</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
      `<url><loc>${domain}/category/fintech</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

    res.header('Content-Type', 'application/xml')
    res.send(xml)
  } catch {
    res.status(500).send('Error generating sitemap')
  }
})

// ─── ROBOTS.TXT (SEO) ────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin

Sitemap: ${process.env.DOMAIN || 'https://appradar.in'}/sitemap.xml`)
})

// ─── 404 HANDLER ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────
app.use((err, req, res, next) => {
  // Never leak error details in production
  const isDev = process.env.NODE_ENV === 'development'
  console.error('Server error:', err.message)
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? err.message : 'Internal server error',
  })
})

// ─── AUTO NEWS FETCH CRON ─────────────────────────────────────────
// Every 2 hours IST
cron.schedule('0 */2 * * *', async () => {
  console.log('\n⏰ Cron: Auto-fetching news...')
  try {
    const result = await fetchAllNews()
    console.log(`✅ Cron done: +${result.added} new articles`)
  } catch (err) {
    console.error('❌ Cron error:', err.message)
  }
}, { timezone: 'Asia/Kolkata' })

// ─── START ────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║   🇮🇳 AppRadar India Backend - LIVE!     ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log(`\n📍 Port    : ${PORT}`)
  console.log(`🔗 API     : http://localhost:${PORT}/api`)
  console.log(`🛡️  Security: Helmet + Rate Limit + HPP + CORS`)
  console.log(`⏰ Cron    : Every 2 hours (IST)`)
  console.log(`🗺️  Sitemap : http://localhost:${PORT}/sitemap.xml\n`)

  // Fetch on startup if empty
  try {
    const articles = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'articles.json'), 'utf8')
    )
    if (!Array.isArray(articles) || articles.length === 0) {
      console.log('📭 Empty DB — fetching news now...')
      await fetchAllNews()
    } else {
      console.log(`📂 ${articles.length} articles in DB. Ready!\n`)
    }
  } catch {
    await fetchAllNews()
  }
})
