require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const axios = require('axios')
const Parser = require('rss-parser')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'AppRadar/1.0 (+https://appradar.in)' },
})

const DATA_DIR = path.join(__dirname, '..', 'data')
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json')
const STATS_FILE = path.join(DATA_DIR, 'stats.json')

// ─── Load / Save ────────────────────────────────────────────────
const loadArticles = () => {
  try {
    const raw = fs.readFileSync(ARTICLES_FILE, 'utf8')
    return JSON.parse(raw) || []
  } catch { return [] }
}

const saveArticles = (articles) => {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8')
}

const updateStats = (count) => {
  try {
    const stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'))
    stats.totalArticles = count
    stats.lastFetch = new Date().toISOString()
    stats.fetchCount = (stats.fetchCount || 0) + 1
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf8')
  } catch (e) {
    console.error('Stats update error:', e.message)
  }
}

// ─── Category Detector ──────────────────────────────────────────
const detectCategory = (title = '', description = '') => {
  const text = (title + ' ' + description).toLowerCase()
  if (/\bai\b|artificial intelligence|chatgpt|gemini|llm|machine learning|openai/.test(text)) return 'ai-tools'
  if (/gaming|game|esports|xbox|playstation|nintendo/.test(text)) return 'gaming'
  if (/fintech|payment|upi|bank|paytm|gpay|wallet|crypto/.test(text)) return 'fintech'
  if (/india|bharat|indian|startup|reliance|tata|infosys|wipro/.test(text)) return 'india-tech'
  if (/instagram|tiktok|twitter|facebook|youtube|social media|whatsapp/.test(text)) return 'social-media'
  if (/website|web app|launch|platform|portal/.test(text)) return 'websites'
  if (/app|android|ios|mobile|play store|app store/.test(text)) return 'apps'
  return 'world-tech'
}

// ─── Gujarati Translation Map ────────────────────────────────────
const guKeywords = {
  'new': 'નવું',
  'app': 'App',
  'website': 'Website',
  'launch': 'Launch',
  'india': 'ભારત',
  'update': 'Update',
  'technology': 'Technology',
  'free': 'ફ્રી',
  'best': 'શ્રેષ્ઠ',
}

const makeGuSummary = (title = '', description = '') => {
  // Create a simple Gujarati summary note
  const cat = detectCategory(title, description)
  const catMap = {
    'ai-tools': 'AI Tool',
    'apps': 'નવી App',
    'websites': 'નવી Website',
    'gaming': 'Gaming',
    'fintech': 'FinTech',
    'india-tech': 'ભારતીય Tech',
    'social-media': 'Social Media',
    'world-tech': 'World Tech',
  }
  return `${catMap[cat] || 'Tech'} — ${title.slice(0, 80)}... વિશે વધુ જાણો.`
}

// ─── Slug Generator ─────────────────────────────────────────────
const makeSlug = (title = '') => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
    + '-' + Date.now().toString(36)
}

// ─── RSS Feed Sources ────────────────────────────────────────────
const RSS_FEEDS = [
  // Tech News (Global)
  { url: 'https://techcrunch.com/feed/', category: null, source: 'TechCrunch' },
  { url: 'https://feeds.feedburner.com/TheHackersNews', category: null, source: 'TheHackerNews' },
  { url: 'https://www.theverge.com/rss/index.xml', category: null, source: 'The Verge' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', category: null, source: 'Ars Technica' },
  { url: 'https://venturebeat.com/feed/', category: 'ai-tools', source: 'VentureBeat' },
  // India Tech
  { url: 'https://yourstory.com/feed', category: 'india-tech', source: 'YourStory' },
  { url: 'https://entrackr.com/feed/', category: 'india-tech', source: 'Entrackr' },
  { url: 'https://inc42.com/feed/', category: 'india-tech', source: 'Inc42' },
  // AI
  { url: 'https://www.artificialintelligence-news.com/feed/', category: 'ai-tools', source: 'AI News' },
  // Product Hunt (New apps/websites daily)
  { url: 'https://www.producthunt.com/feed', category: 'apps', source: 'Product Hunt' },
]

// ─── Fetch from RSS ──────────────────────────────────────────────
const fetchFromRSS = async (feed) => {
  try {
    const parsed = await parser.parseURL(feed.url)
    const items = []

    for (const item of (parsed.items || []).slice(0, 15)) {
      const title = item.title || ''
      const description = item.contentSnippet || item.summary || item.content || ''
      if (!title || title.length < 10) continue

      items.push({
        id: uuidv4(),
        slug: makeSlug(title),
        title: title.trim(),
        titleGu: title.trim(), // keep English title, add Gu summary
        description: description.slice(0, 300).trim(),
        descriptionGu: makeGuSummary(title, description),
        url: item.link || item.guid || '',
        image: item.enclosure?.url || item['media:content']?.['$']?.url || `https://picsum.photos/seed/${Math.floor(Math.random()*999)}/800/450`,
        source: feed.source,
        category: feed.category || detectCategory(title, description),
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        views: 0,
        isNew: true,
      })
    }

    console.log(`  ✅ ${feed.source}: ${items.length} articles`)
    return items
  } catch (err) {
    console.log(`  ⚠️  ${feed.source}: Failed (${err.message.slice(0, 50)})`)
    return []
  }
}

// ─── Fetch from NewsAPI ──────────────────────────────────────────
const fetchFromNewsAPI = async () => {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey || apiKey === 'your_newsapi_key_here') {
    console.log('  ⚠️  NewsAPI: Skipped (no key configured)')
    return []
  }

  try {
    const res = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'technology',
        language: 'en',
        pageSize: 20,
        apiKey,
      },
      timeout: 10000,
    })

    const items = (res.data.articles || []).map(a => ({
      id: uuidv4(),
      slug: makeSlug(a.title || ''),
      title: (a.title || '').trim(),
      titleGu: (a.title || '').trim(),
      description: (a.description || '').slice(0, 300).trim(),
      descriptionGu: makeGuSummary(a.title, a.description),
      url: a.url || '',
      image: a.urlToImage || `https://picsum.photos/seed/${Math.floor(Math.random()*999)}/800/450`,
      source: a.source?.name || 'NewsAPI',
      category: detectCategory(a.title, a.description),
      publishedAt: a.publishedAt || new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      views: 0,
      isNew: true,
    }))

    console.log(`  ✅ NewsAPI: ${items.length} articles`)
    return items
  } catch (err) {
    console.log(`  ⚠️  NewsAPI: ${err.message.slice(0, 60)}`)
    return []
  }
}

// ─── Deduplicate ─────────────────────────────────────────────────
const deduplicate = (existing, fresh) => {
  const existingUrls = new Set(existing.map(a => a.url))
  const existingTitles = new Set(existing.map(a => a.title.toLowerCase().slice(0, 60)))

  return fresh.filter(a => {
    if (!a.url || !a.title) return false
    if (existingUrls.has(a.url)) return false
    const titleKey = a.title.toLowerCase().slice(0, 60)
    if (existingTitles.has(titleKey)) return false
    existingUrls.add(a.url)
    existingTitles.add(titleKey)
    return true
  })
}

// ─── Main Fetch Function ─────────────────────────────────────────
const fetchAllNews = async () => {
  console.log('\n🔄 AppRadar News Fetch Started...')
  console.log('⏰ Time:', new Date().toLocaleString('en-IN'))
  console.log('─'.repeat(50))

  const existing = loadArticles()

  // Mark old articles as not-new
  existing.forEach(a => { a.isNew = false })

  let fresh = []

  // RSS Feeds (parallel)
  console.log('\n📡 Fetching RSS Feeds...')
  const rssResults = await Promise.allSettled(RSS_FEEDS.map(f => fetchFromRSS(f)))
  rssResults.forEach(r => {
    if (r.status === 'fulfilled') fresh.push(...r.value)
  })

  // NewsAPI
  console.log('\n📰 Fetching NewsAPI...')
  const apiArticles = await fetchFromNewsAPI()
  fresh.push(...apiArticles)

  // Deduplicate
  const unique = deduplicate(existing, fresh)
  console.log(`\n✨ New unique articles: ${unique.length}`)

  // Merge: new articles first, then existing (keep max 500)
  const merged = [...unique, ...existing].slice(0, 500)

  // Sort by date
  merged.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  saveArticles(merged)
  updateStats(merged.length)

  console.log(`\n✅ Total articles saved: ${merged.length}`)
  console.log('─'.repeat(50))
  console.log('🎉 Fetch Complete!\n')

  return { added: unique.length, total: merged.length }
}

// ─── Run if called directly ──────────────────────────────────────
if (require.main === module) {
  fetchAllNews()
    .then(result => {
      console.log('Result:', result)
      process.exit(0)
    })
    .catch(err => {
      console.error('Fatal error:', err)
      process.exit(1)
    })
}

module.exports = { fetchAllNews }
