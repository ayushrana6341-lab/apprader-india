import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const Navbar = () => {
  const { t, lang, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQ.trim())}`)
      setMenuOpen(false)
    }
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(8,8,16,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        height: 64,
        gap: 16,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>📡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1 }}>AppRadar</div>
            <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 600 }}>INDIA</div>
          </div>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} style={{
          flex: 1, maxWidth: 480,
          display: 'flex',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 50,
          overflow: 'hidden',
          marginLeft: 20,
        }}>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder={t.search}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '8px 16px',
              color: '#f0f0fa',
              fontSize: 14,
            }}
          />
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            border: 'none',
            padding: '8px 16px',
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
          }}>🔍</button>
        </form>

        <div style={{ flex: 1 }} />

        {/* Nav links (desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          <NavLink to="/">{t.home}</NavLink>
          <NavLink to="/category/ai-tools">🤖 AI</NavLink>
          <NavLink to="/category/india-tech">🇮🇳 India</NavLink>
          <NavLink to="/category/apps">📱 Apps</NavLink>
        </div>

        {/* Lang toggle */}
        <button
          onClick={toggle}
          style={{
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20,
            padding: '5px 12px',
            color: '#818cf8',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {lang === 'en' ? 'ગુ' : 'EN'}
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(m => !m)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f0f0fa',
            fontSize: 22,
            padding: 4,
            display: 'none',
          }}
          className="hamburger"
        >{menuOpen ? '✕' : '☰'}</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(8,8,16,0.98)',
          borderTop: '1px solid rgba(99,102,241,0.15)',
          padding: '16px 20px',
        }}>
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 50,
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={t.search}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '8px 16px', color: '#f0f0fa', fontSize: 14 }}
            />
            <button type="submit" style={{ background: '#6366f1', border: 'none', padding: '8px 16px', color: '#fff' }}>🔍</button>
          </form>
          {[
            { to: '/', label: `🏠 ${t.home}` },
            { to: '/category/ai-tools', label: '🤖 AI Tools' },
            { to: '/category/india-tech', label: '🇮🇳 India Tech' },
            { to: '/category/apps', label: '📱 Apps' },
            { to: '/category/websites', label: '🌐 Websites' },
          ].map(l => (
            <Link key={l.to} to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '10px 0', color: '#c0c0e0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 15 }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

const NavLink = ({ to, children }) => (
  <Link to={to} style={{
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 14,
    color: '#9090b8',
    fontWeight: 500,
    transition: 'all 0.2s',
  }}
  onMouseEnter={e => { e.target.style.color = '#f0f0fa'; e.target.style.background = 'rgba(99,102,241,0.1)' }}
  onMouseLeave={e => { e.target.style.color = '#9090b8'; e.target.style.background = 'transparent' }}>
    {children}
  </Link>
)

export default Navbar
