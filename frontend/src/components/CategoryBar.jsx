import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCategories } from '../api/articles'
import { useLang } from '../context/LangContext'

const CategoryBar = ({ active = 'all' }) => {
  const { lang } = useLang()
  const [cats, setCats] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getCategories().then(d => setCats(d.categories || [])).catch(() => {})
  }, [])

  const all = { id: 'all', name: 'All', nameGu: 'બધું', icon: '⚡', color: '#6366f1' }
  const list = [all, ...cats]

  return (
    <div style={{
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      padding: '4px 0 8px',
    }}>
      <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
        {list.map(cat => {
          const isActive = active === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id === 'all' ? '/' : `/category/${cat.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 16px',
                borderRadius: 50,
                border: isActive
                  ? `1px solid ${cat.color}`
                  : '1px solid rgba(255,255,255,0.08)',
                background: isActive
                  ? `${cat.color}20`
                  : 'rgba(255,255,255,0.03)',
                color: isActive ? cat.color : '#7070a0',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{cat.icon}</span>
              <span>{lang === 'gu' ? (cat.nameGu || cat.name) : cat.name}</span>
            </button>
          )
        })}
      </div>
      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  )
}

export default CategoryBar
