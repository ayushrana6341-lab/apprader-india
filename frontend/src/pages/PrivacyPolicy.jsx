import React from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PrivacyPolicy = () => (
  <div style={{ minHeight: '100vh', background: '#080810' }}>
    <Helmet>
      <title>Privacy Policy - AppRadar India</title>
    </Helmet>
    <Navbar />
    <div className="container" style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 800 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#5a5a7a', marginBottom: 40 }}>Last updated: {new Date().toLocaleDateString('en-IN')}</p>

      {[
        {
          title: '1. Information We Collect',
          content: 'AppRadar India does not collect any personal information from visitors. We do not require registration or login to access our content. We may collect anonymous usage statistics to improve our service.',
        },
        {
          title: '2. Cookies',
          content: 'We use cookies to enhance your browsing experience and to display relevant advertisements through Google AdSense. You can control cookie settings through your browser preferences.',
        },
        {
          title: '3. Google AdSense',
          content: 'We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google Ad Settings.',
        },
        {
          title: '4. Third-Party Links',
          content: 'Our website contains links to third-party websites (news sources, apps, etc.). We are not responsible for the privacy practices of those websites.',
        },
        {
          title: '5. Data Security',
          content: 'We implement appropriate security measures to protect our website. We do not store personal user data.',
        },
        {
          title: '6. Contact Us',
          content: 'If you have questions about this Privacy Policy, contact us at: contact@appradar.in',
        },
      ].map((s, i) => (
        <div key={i} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#818cf8' }}>{s.title}</h2>
          <p style={{ color: '#9090b8', lineHeight: 1.8, fontSize: 15 }}>{s.content}</p>
        </div>
      ))}
    </div>
    <Footer />
  </div>
)

export default PrivacyPolicy
