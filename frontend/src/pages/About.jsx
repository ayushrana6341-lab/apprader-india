import React from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => (
  <div style={{ minHeight: '100vh', background: '#080810' }}>
    <Helmet>
      <title>About - AppRadar India | India's Tech News Hub</title>
      <meta name="description" content="AppRadar India - India's #1 source for new apps, websites and technology news. Updated daily." />
    </Helmet>
    <Navbar />
    <div className="container" style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 800 }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>📡</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>About AppRadar India</h1>
        <p style={{ color: '#7070a0', fontSize: 17, lineHeight: 1.7 }}>
          India's #1 source for discovering new apps, websites, and technology news
        </p>
      </div>

      <div style={{ display: 'grid', gap: 24, marginBottom: 48 }}>
        {[
          { icon: '🎯', title: 'Our Mission', desc: 'We make it easy for Indians to discover the latest apps, websites, and technology from India and around the world. All in one place, updated daily, completely free.' },
          { icon: '🇮🇳', title: 'Made for India', desc: 'We focus on content relevant to Indian users — from Indian startup launches to global apps that work best in India. We also provide content in Gujarati for our regional audience.' },
          { icon: '🤖', title: 'How It Works', desc: 'Our AI-powered system automatically fetches tech news from 10+ trusted sources every 2 hours — including TechCrunch, Inc42, YourStory, Product Hunt, and more. You always get fresh content.' },
          { icon: '🆓', title: 'Always Free', desc: 'AppRadar India is and will always be free to use. We are supported by advertisements that help us keep the lights on and content flowing.' },
        ].map((item, i) => (
          <div key={i} style={{
            background: '#0d0d18',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 16, padding: 28,
            display: 'flex', gap: 20,
          }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{item.icon}</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: '#7070a0', lineHeight: 1.7, fontSize: 15 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(56,189,248,0.1))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 16, padding: 32, textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>📊 By the Numbers</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginTop: 20 }}>
          {[
            { num: '95+', label: 'Articles' },
            { num: '10+', label: 'Sources' },
            { num: '8', label: 'Categories' },
            { num: '2hr', label: 'Update Cycle' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#818cf8' }}>{s.num}</div>
              <div style={{ fontSize: 13, color: '#5a5a7a' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
)

export default About
