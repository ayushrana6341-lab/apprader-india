import React, { useState } from 'react'
import { useLang } from '../context/LangContext'

const categoryColors = {
  'ai-tools':    { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', icon: '🤖' },
  'apps':        { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8', icon: '📱' },
  'websites':    { bg: 'rgba(14,165,233,0.15)',  color: '#38bdf8', icon: '🌐' },
  'india-tech':  { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', icon: '🇮🇳' },
  'social-media':{ bg: 'rgba(236,72,153,0.15)',  color: '#f472b6', icon: '💬' },
  'gaming':      { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24', icon: '🎮' },
  'fintech':     { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', icon: '💰' },
  'world-tech':  { bg: 'rgba(20,184,166,0.15)',  color: '#2dd4bf', icon: '🌍' },
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr)
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const ArticleCard = ({ article, featured = false }) => {
  const { lang } = useLang()
  const [imgError, setImgError] = useState(false)

  const cat = categoryColors[article.category] || categoryColors['world-tech']
  const title = lang === 'gu' ? (article.titleGu || article.title) : article.title
  const desc  = lang === 'gu' ? (article.descriptionGu || article.description) : article.description

  const fallbackImg = `https://picsum.photos/seed/${article.id?.slice(0,8) || 'tech'}/800/450`

  return (
    <article
      onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
      style={{
        background: 'linear-gradient(145deg, #0d0d18, #111120)',
        border: '1px solid rgba(99,102,241,0.12)',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(99,102,241,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: featured ? '45%' : '52%', overflow: 'hidden' }}>
        <img
          src={imgError ? fallbackImg : (article.image || fallbackImg)}
          alt={title}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s',
          }}
          loading="lazy"
        />
        {/* Category badge over image */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: cat.bg,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${cat.color}40`,
          color: cat.color,
          fontSize: 11,
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 20,
        }}>
          {cat.icon} {article.category?.replace('-', ' ').toUpperCase()}
        </div>

        {/* NEW badge */}
        {article.isNew && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(16,185,129,0.9)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 20,
            letterSpacing: '0.05em',
          }}>
            🆕 NEW
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{
          fontSize: featured ? 17 : 15,
          fontWeight: 700,
          lineHeight: 1.4,
          color: '#f0f0fa',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {title}
        </h3>

        {desc && (
          <p style={{
            fontSize: 13,
            color: '#7070a0',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}>
            {desc}
          </p>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: 10,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 20, height: 20,
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10,
            }}>📰</div>
            <span style={{ fontSize: 12, color: '#6060a0', fontWeight: 500 }}>{article.source}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#5a5a7a' }}>👁 {article.views || 0}</span>
            <span style={{ fontSize: 11, color: '#5a5a7a' }}>🕒 {timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard
