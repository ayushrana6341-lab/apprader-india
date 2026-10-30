import React, { createContext, useContext, useState } from 'react'

const LangContext = createContext()

export const translations = {
  en: {
    siteName: 'AppRadar India',
    tagline: 'New Apps & Tech News Daily',
    home: 'Home',
    categories: 'Categories',
    latest: 'Latest',
    trending: 'Trending',
    search: 'Search apps, websites, news...',
    readMore: 'Read More →',
    source: 'Source',
    share: 'Share',
    noArticles: 'No articles found.',
    loading: 'Loading...',
    newBadge: '🆕 New',
    hotBadge: '🔥 Hot',
    allCategories: 'All',
    switchToGu: 'ગુ',
    switchToEn: 'EN',
    heroTitle: 'India\'s #1 Source for New Apps & Tech',
    heroSub: 'Daily updates on new apps, websites & technology from India and worldwide. 100% Free.',
    fetchedFrom: 'from',
    viewAll: 'View All',
    todayNews: 'Today\'s News',
    newApps: 'New Apps & Launches',
    aiTools: 'AI Tools',
    indiaStartups: 'India Startups',
    footer: '© 2024 AppRadar India. Made with ❤️ for India.',
    adminPanel: 'Admin',
  },
  gu: {
    siteName: 'AppRadar India',
    tagline: 'દરરોજ નવી Apps & Tech News',
    home: 'Home',
    categories: 'Categories',
    latest: 'નવામાં નવું',
    trending: 'ટ્રેન્ડિંગ',
    search: 'Apps, Websites, News શોધો...',
    readMore: 'વધુ વાંચો →',
    source: 'Source',
    share: 'Share',
    noArticles: 'કોઈ article મળ્યો નહીં.',
    loading: 'લોડ થઈ રહ્યું છે...',
    newBadge: '🆕 નવું',
    hotBadge: '🔥 હોટ',
    allCategories: 'બધું',
    switchToGu: 'ગુ',
    switchToEn: 'EN',
    heroTitle: 'India ની #1 Tech News Website',
    heroSub: 'India ની અને World ની નવી Apps, Websites અને Technology ના Daily Updates. 100% ફ્રી.',
    fetchedFrom: 'from',
    viewAll: 'બધું જુઓ',
    todayNews: 'આજ ના સમાચાર',
    newApps: 'નવી Apps & Launches',
    aiTools: 'AI Tools',
    indiaStartups: 'India Startups',
    footer: '© 2024 AppRadar India. ❤️ ભારત માટે બનાવ્યું.',
    adminPanel: 'Admin',
  },
}

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('en')
  const t = translations[lang]
  const toggle = () => setLang(l => l === 'en' ? 'gu' : 'en')

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
