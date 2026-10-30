const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

const DATA_DIR = path.join(__dirname, '..', 'data')
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json')

const loadArticles = () => {
  try {
    return JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8')) || []
  } catch { return [] }
}

// ─── GET /api/articles ───────────────────────────────────────────
// Query: page, limit, category, search, lang
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category = '',
      search = '',
      lang = 'en',
      sort = 'latest',
    } = req.query

    let articles = loadArticles()

    // Filter by category
    if (category && category !== 'all') {
      articles = articles.filter(a => a.category === category)
    }

    // Search
    if (search && search.trim()) {
      const q = search.toLowerCase()
      articles = articles.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        (a.source || '').toLowerCase().includes(q)
      )
    }

    // Sort
    if (sort === 'popular') {
      articles.sort((a, b) => (b.views || 0) - (a.views || 0))
    } else {
      articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    }

    const total = articles.length
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const start = (pageNum - 1) * limitNum
    const paginated = articles.slice(start, start + limitNum)

    // Apply language preference
    const result = paginated.map(a => ({
      ...a,
      displayTitle: lang === 'gu' ? (a.titleGu || a.title) : a.title,
      displayDesc: lang === 'gu' ? (a.descriptionGu || a.description) : a.description,
    }))

    res.json({
      success: true,
      articles: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: start + limitNum < total,
        hasPrev: pageNum > 1,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ─── GET /api/articles/latest ────────────────────────────────────
router.get('/latest', (req, res) => {
  try {
    const articles = loadArticles()
    const latest = articles.filter(a => a.isNew).slice(0, 10)
    res.json({ success: true, articles: latest })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ─── GET /api/articles/featured ─────────────────────────────────
router.get('/featured', (req, res) => {
  try {
    const articles = loadArticles()
    const featured = articles.slice(0, 6)
    res.json({ success: true, articles: featured })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ─── GET /api/articles/:slug ─────────────────────────────────────
router.get('/:slug', (req, res) => {
  try {
    const articles = loadArticles()
    const article = articles.find(a => a.slug === req.params.slug)

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' })
    }

    // Increment views
    article.views = (article.views || 0) + 1
    const idx = articles.findIndex(a => a.slug === req.params.slug)
    if (idx !== -1) {
      articles[idx] = article
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8')
    }

    res.json({ success: true, article })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
