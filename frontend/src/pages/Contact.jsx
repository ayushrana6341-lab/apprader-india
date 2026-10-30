import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast, { Toaster } from 'react-hot-toast'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields')
      return
    }
    // Open mail client
    const mailTo = `mailto:contact@appradar.in?subject=${encodeURIComponent(form.subject || 'Contact from AppRadar')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
    window.location.href = mailTo
    toast.success('Opening your email app...')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080810' }}>
      <Helmet>
        <title>Contact Us - AppRadar India</title>
      </Helmet>
      <Navbar />
      <Toaster position="top-right" />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 700 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Contact Us</h1>
          <p style={{ color: '#7070a0', fontSize: 16 }}>
            Questions, feedback, or sponsored post inquiries? We'd love to hear from you.
          </p>
        </div>

        {/* Contact info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { icon: '📧', label: 'Email', value: 'contact@appradar.in' },
            { icon: '📍', label: 'Location', value: 'India' },
            { icon: '⏰', label: 'Response Time', value: 'Within 24 hours' },
          ].map(c => (
            <div key={c.label} style={{
              background: '#0d0d18',
              border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: 12, padding: 20, textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 12, color: '#5a5a7a', marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#c0c0e0' }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: '#0d0d18',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: 16, padding: 32,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Send a Message</h2>

          {[
            { key: 'name', label: 'Your Name *', placeholder: 'Ayush Patel', type: 'text' },
            { key: 'email', label: 'Email Address *', placeholder: 'ayush@example.com', type: 'email' },
            { key: 'subject', label: 'Subject', placeholder: 'Sponsored post inquiry / Feedback / Bug report', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 13, color: '#7070a0', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 8, color: '#f0f0fa', fontSize: 14, outline: 'none',
                }}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: 13, color: '#7070a0', display: 'block', marginBottom: 6 }}>Message *</label>
            <textarea
              placeholder="Your message here..."
              rows={5}
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 8, color: '#f0f0fa', fontSize: 14,
                outline: 'none', resize: 'vertical',
              }}
            />
          </div>

          <button type="submit" style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            border: 'none', borderRadius: 10, padding: '12px',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>
            Send Message 📨
          </button>
        </form>

        {/* Sponsored post note */}
        <div style={{
          marginTop: 24,
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 12, padding: 20,
        }}>
          <h3 style={{ color: '#10b981', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>💼 Sponsored Posts & Partnerships</h3>
          <p style={{ color: '#5a5a7a', fontSize: 13, lineHeight: 1.7 }}>
            Are you a startup or app developer? Get your app featured on AppRadar India and reach thousands of Indian tech enthusiasts.
            Contact us at <strong style={{ color: '#818cf8' }}>contact@appradar.in</strong>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact
