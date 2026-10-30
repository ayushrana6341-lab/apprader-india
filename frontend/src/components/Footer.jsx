import React from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const Footer = () => {
  const { t } = useLang()
  return (
    <footer style={{
      borderTop: '1px solid rgba(99,102,241,0.12)',
      background: '#080810',
      padding: '48px 0 24px',
      marginTop: 80,
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #818cf8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📡</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>AppRadar India</div>
                <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 600 }}>TECH NEWS</div>
              </div>
            </div>
            <p style={{ color: '#5a5a7a', fontSize: 13, lineHeight: 1.7 }}>
              India ની નવી Apps, Websites અને Technology ના Daily Updates.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#9090b8' }}>CATEGORIES</h4>
            {[
              { to: '/category/ai-tools', label: '🤖 AI Tools' },
              { to: '/category/apps', label: '📱 New Apps' },
              { to: '/category/india-tech', label: '🇮🇳 India Tech' },
              { to: '/category/websites', label: '🌐 Websites' },
              { to: '/category/fintech', label: '💰 FinTech' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'block', color: '#5a5a7a', fontSize: 13, padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#818cf8'}
                onMouseLeave={e => e.target.style.color = '#5a5a7a'}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* SEO Keywords */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#9090b8' }}>POPULAR SEARCHES</h4>
            {[
              'New Apps 2024', 'India Tech News', 'AI Tools India',
              'New Websites Launch', 'Startup India', 'Tech Updates',
            ].map(kw => (
              <span key={kw} style={{
                display: 'inline-block',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.15)',
                color: '#6060a0',
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 20,
                margin: '0 4px 6px 0',
              }}>{kw}</span>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ color: '#3a3a5a', fontSize: 13 }}>{t.footer}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/about" style={{ color: '#3a3a5a', fontSize: 12 }}
              onMouseEnter={e => e.target.style.color = '#818cf8'}
              onMouseLeave={e => e.target.style.color = '#3a3a5a'}>About</Link>
            <Link to="/contact" style={{ color: '#3a3a5a', fontSize: 12 }}
              onMouseEnter={e => e.target.style.color = '#818cf8'}
              onMouseLeave={e => e.target.style.color = '#3a3a5a'}>Contact</Link>
            <Link to="/privacy-policy" style={{ color: '#3a3a5a', fontSize: 12 }}
              onMouseEnter={e => e.target.style.color = '#818cf8'}
              onMouseLeave={e => e.target.style.color = '#3a3a5a'}>Privacy Policy</Link>
            <Link to="/admin" style={{ color: '#3a3a5a', fontSize: 12 }}
              onMouseEnter={e => e.target.style.color = '#818cf8'}
              onMouseLeave={e => e.target.style.color = '#3a3a5a'}>Admin</Link>
            <span style={{ color: '#3a3a5a', fontSize: 12 }}>Made in 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
