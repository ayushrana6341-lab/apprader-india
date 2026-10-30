import React, { useState, useEffect } from 'react'
import { adminLogin, adminStats, adminFetch } from '../api/articles'
import toast, { Toaster } from 'react-hot-toast'

const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem('ar_admin_token') || '')
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) loadStats()
  }, [token])

  const loadStats = async () => {
    try {
      const data = await adminStats(token)
      setStats(data.stats)
    } catch {
      setToken('')
      localStorage.removeItem('ar_admin_token')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await adminLogin(password)
      setToken(data.token)
      localStorage.setItem('ar_admin_token', data.token)
      toast.success('Admin login successful!')
    } catch {
      toast.error('Wrong password!')
    } finally {
      setLoading(false)
    }
  }

  const handleFetch = async () => {
    setFetching(true)
    try {
      const data = await adminFetch(token)
      toast.success(data.message)
      loadStats()
    } catch (err) {
      toast.error('Fetch failed: ' + err.message)
    } finally {
      setFetching(false)
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Toaster position="top-right" />
        <div style={{
          background: '#0d0d18', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 20, padding: 40, width: '100%', maxWidth: 400,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Admin Panel</h1>
          <p style={{ color: '#5a5a7a', fontSize: 14, marginBottom: 28 }}>AppRadar India</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin Password"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 10, color: '#f0f0fa',
                fontSize: 15, marginBottom: 16,
                outline: 'none',
              }}
              autoFocus
            />
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080810', padding: '40px 20px' }}>
      <Toaster position="top-right" />
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>🔧 Admin Panel</h1>
            <p style={{ color: '#5a5a7a', fontSize: 14 }}>AppRadar India</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleFetch} disabled={fetching} style={{
              background: fetching ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #10b981, #34d399)',
              border: 'none', borderRadius: 10, padding: '10px 20px',
              color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {fetching ? (
                <><span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Fetching...</>
              ) : '🔄 Fetch News Now'}
            </button>
            <button onClick={() => { setToken(''); localStorage.removeItem('ar_admin_token') }} style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 16px', color: '#ef4444', cursor: 'pointer', fontSize: 14,
            }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Total Articles', value: stats.totalArticles, icon: '📰', color: '#6366f1' },
                { label: 'New Today', value: stats.newToday, icon: '🆕', color: '#10b981' },
                { label: 'Total Fetches', value: stats.fetchCount || 0, icon: '🔄', color: '#0ea5e9' },
                { label: 'Last Fetch', value: stats.lastFetch ? new Date(stats.lastFetch).toLocaleTimeString('en-IN') : 'Never', icon: '⏰', color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#0d0d18', border: `1px solid ${s.color}30`,
                  borderRadius: 14, padding: 20,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#5a5a7a' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            <div style={{ background: '#0d0d18', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Category Breakdown</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {Object.entries(stats.categoryBreakdown || {}).map(([cat, count]) => (
                  <div key={cat} style={{
                    background: 'rgba(99,102,241,0.06)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: 10, padding: '10px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 13, color: '#9090b8' }}>{cat}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#818cf8' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Sources */}
            <div style={{ background: '#0d0d18', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📡 Top Sources</h3>
              {(stats.topSources || []).map((s, i) => (
                <div key={s.source} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < stats.topSources.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ color: '#5a5a7a', fontSize: 13, width: 20 }}>#{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 14, color: '#c0c0e0' }}>{s.source}</span>
                  <div style={{ background: 'rgba(99,102,241,0.15)', borderRadius: 20, padding: '2px 12px', fontSize: 13, color: '#818cf8', fontWeight: 700 }}>
                    {s.count}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: 24, padding: 20, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14 }}>
          <h4 style={{ color: '#10b981', marginBottom: 8, fontSize: 14 }}>ℹ️ Auto-Fetch Info</h4>
          <p style={{ color: '#5a5a7a', fontSize: 13, lineHeight: 1.7 }}>
            News automatically fetches every <strong style={{ color: '#9090b8' }}>2 hours</strong> (IST). <br />
            Sources: TechCrunch, The Verge, Inc42, YourStory, Product Hunt, VentureBeat + more.<br />
            Data stored locally in <code style={{ color: '#818cf8' }}>backend/data/articles.json</code>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Admin
