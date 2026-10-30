import axios from 'axios'

// Development: Vite proxy /api → localhost:4000
// Production: VITE_API_URL environment variable (set in Vercel)
const BASE_URL = import.meta.env.VITE_API_URL || ''

const API = axios.create({
  baseURL: BASE_URL + '/api',
  timeout: 10000,
})

export const getArticles = (params = {}) =>
  API.get('/articles', { params }).then(r => r.data)

export const getArticle = (slug) =>
  API.get(`/articles/${slug}`).then(r => r.data)

export const getFeatured = () =>
  API.get('/articles/featured').then(r => r.data)

export const getLatest = () =>
  API.get('/articles/latest').then(r => r.data)

export const getCategories = () =>
  API.get('/categories').then(r => r.data)

// Admin
export const adminLogin = (password) =>
  API.post('/admin/login', { password }).then(r => r.data)

export const adminStats = (token) =>
  API.get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data)

export const adminFetch = (token) =>
  API.post('/admin/fetch', {}, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data)

export const adminDeleteArticle = (id, token) =>
  API.delete(`/admin/articles/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data)
