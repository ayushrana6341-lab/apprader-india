import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LangProvider } from './context/LangContext'
import Home from './pages/Home'
import Category from './pages/Category'
import Admin from './pages/Admin'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d0d18',
              color: '#f0f0fa',
              border: '1px solid rgba(99,102,241,0.3)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </LangProvider>
    </BrowserRouter>
  )
}

export default App
