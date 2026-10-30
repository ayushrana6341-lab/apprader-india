const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const { fetchAllNews } = require('../jobs/fetchNews')

const router = express.Router()
const DATA_DIR = path.join(__dirname, '..', 'data')

const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json')
const STATS_FILE    = path.join(DATA_DIR, 'stats.json')

const loadJSON = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null }
}

// ─── Admin Auth Middleware ───────────────────────────────────────
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'admin') throw new Error()
    next()
  } catch {
    res.status(401).json({ message: 'Invalid admin token' })
  }
}

// ─── POST /api/admin/login ───────────────────────────────────────
router.post('/login', (req, res) => {
  const { password } = req.body
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Wrong password' })
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' })
  res.json({ success: true, token })
})

// ─── GET /api/admin/stats ────────────────────────────────────────
router.get('/stats', adminAuth, (req, res) => {
  const stats  = loadJSON(STATS_FILE)  || {}
  const articles = loadJSON(ARTICLES_FILE) || []

  const catCounts = {}
  articles.forEach(a => {
    catCounts[a.category] = (catCounts[a.category] || 0) + 1
  })

  res.json({
    success: true,
    stats: {
      ...stats,
      totalArticles: articles.length,
      newToday: articles.filter(a => a.isNew).length,
      categoryBreakdown: catCounts,
      topSources: getTopSources(articles),
    },
  })
})

const getTopSources = (articles) => {
  const map = {}
  articles.forEach(a => {
    map[a.source] = (map[a.source] || 0) + 1
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }))
}

// ─── POST /api/admin/fetch ───────────────────────────────────────
// Manually trigger news fetch from admin panel
router.post('/fetch', adminAuth, async (req, res) => {
  try {
    console.log('🔧 Manual fetch triggered from admin panel...')
    const result = await fetchAllNews()
    res.json({ success: true, message: `Fetched ${result.added} new articles`, result })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ─── DELETE /api/admin/articles/:id ──────────────────────────────
router.delete('/articles/:id', adminAuth, (req, res) => {
  try {
    let articles = loadJSON(ARTICLES_FILE) || []
    const before = articles.length
    articles = articles.filter(a => a.id !== req.params.id)
    if (articles.length === before) {
      return res.status(404).json({ success: false, message: 'Article not found' })
    }
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8')
    res.json({ success: true, message: 'Article deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ─── DELETE /api/admin/articles/clear-all ────────────────────────
router.delete('/clear-all', adminAuth, (req, res) => {
  try {
    fs.writeFileSync(ARTICLES_FILE, '[]', 'utf8')
    res.json({ success: true, message: 'All articles cleared' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
