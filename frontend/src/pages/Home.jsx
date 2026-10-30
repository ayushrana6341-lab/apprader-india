import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ArticleCard from '../components/ArticleCard'
import CategoryBar from '../components/CategoryBar'
import { getArticles } from '../api/articles'
import { useLang } from '../context/LangContext'

const SkeletonCard = () => (
  <div style={{ background: '#0d0d18', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 16, overflow: 'hidden' }}>
    <div className="skeleton" style={{ height: 180 }} />
    <div style={{ padding: 16 }}>
      <div className="skeleton" style={{ height: 16, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 12, width: '80%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '60%' }} />
    </div>
  </div>
)

const Home = ({ categoryFilter = 'all' }) => {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const searchQ = searchParams.get('search') || ''

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [sort, setSort] = useState('latest')

  const fetchArticles = useCallback(async (p = 1, replace = true) => {
    setLoading(true)
    try {
      const params = {
        page: p, limit: 12, lang,
        sort,
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(searchQ && { search: searchQ }),
      }
      const data = await getArticles(params)
      setArticles(prev => replace ? (data.articles || []) : [...prev, ...(data.articles || [])])
      setPagination(data.pagination)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [lang, categoryFilter, searchQ, sort])

  useEffect(() => {
    setPage(1)
    fetchArticles(1, true)
  }, [fetchArticles])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchArticles(nextPage, false)
  }

  const heroGradient = 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)'

  return (
    <div style={{ minHeight: '100vh', background: '#080810' }}>
      <Helmet>
        <title>{searchQ ? `"${searchQ}" - AppRadar India` : categoryFilter !== 'all' ? `${categoryFilter} News - AppRadar India` : 'AppRadar India - નવી Apps & Tech News 🇮🇳'}</title>
        <meta name="description" content="India ની નવી Apps, Websites અને Technology ના Daily Updates. Discover latest tech news from India and worldwide." />
        <meta name="keywords" content={`new apps india ${new Date().getFullYear()}, tech news india, ${categoryFilter} india, app launch india, gujarati tech`} />
        <link rel="canonical" href="https://appradar.in" />
      </Helmet>

      <Navbar />

      {/* ── HERO (only on home, no search, no category filter) ── */}
      {categoryFilter === 'all' && !searchQ && (
        <section style={{
          paddingTop: 120,
          paddingBottom: 60,
          background: heroGradient,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Animated blobs */}
          <div style={{
            position: 'absolute', width: 600, height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 4s ease infinite',
            pointerEvents: 'none',
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 100, padding: '5px 14px',
              fontSize: 12, color: '#818cf8', fontWeight: 600,
              marginBottom: 20,
            }}>
              🔴 Live • Auto-updates every 2 hours
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 18,
              background: 'linear-gradient(135deg, #f0f0fa 0%, #818cf8 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200%',
              animation: 'gradientFlow 4s ease infinite',
            }}>
              {t.heroTitle}
            </h1>

            <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#7070a0', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
              {t.heroSub}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: '📱', label: 'New Apps Daily', value: '50+' },
                { icon: '🌐', label: 'Sources', value: '10+' },
                { icon: '🇮🇳', label: 'India Focus', value: '100%' },
                { icon: '🆓', label: 'Always Free', value: 'FREE' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  borderRadius: 12, padding: '12px 20px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#818cf8' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#5a5a7a' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="container" style={{ paddingTop: categoryFilter !== 'all' || searchQ ? 90 : 32, paddingBottom: 60 }}>

        {/* Category bar */}
        <div style={{ marginBottom: 24 }}>
          <CategoryBar active={categoryFilter} />
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12, marginBottom: 24,
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>
              {searchQ
                ? `🔍 "${searchQ}"`
                : categoryFilter !== 'all'
                  ? `📂 ${categoryFilter.replace('-', ' ').toUpperCase()}`
                  : `⚡ ${t.latest}`}
            </h2>
            {pagination && (
              <p style={{ fontSize: 12, color: '#5a5a7a', marginTop: 2 }}>
                {pagination.total} articles
              </p>
            )}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#9090b8', borderRadius: 8,
              padding: '6px 12px', fontSize: 13, cursor: 'pointer',
            }}
          >
            <option value="latest">🕒 Latest</option>
            <option value="popular">🔥 Popular</option>
          </select>
        </div>

        {/* Articles Grid */}
        {loading && articles.length === 0 ? (
          <div className="grid-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ color: '#5a5a7a', fontSize: 16 }}>{t.noArticles}</p>
          </div>
        ) : (
          <div className="grid-3">
            {articles.map((article, i) => (
              <div key={article.id} className="fade-in" style={{ animationDelay: `${(i % 12) * 0.05}s` }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {pagination?.hasNext && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button
              onClick={loadMore}
              disabled={loading}
              style={{
                background: loading ? 'rgba(99,102,241,0.2)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                border: 'none',
                color: '#fff',
                padding: '12px 36px',
                borderRadius: 50,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Loading...
                </>
              ) : `Load More (${pagination.total - articles.length} left)`}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Home
