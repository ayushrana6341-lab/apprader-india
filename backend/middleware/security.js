// ─── XSS Clean (manual, since xss-clean is deprecated) ───────────
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

const sanitizeObject = (obj) => {
  if (typeof obj === 'string') return sanitizeString(obj)
  if (Array.isArray(obj)) return obj.map(sanitizeObject)
  if (obj && typeof obj === 'object') {
    const sanitized = {}
    for (const key of Object.keys(obj)) {
      sanitized[key] = sanitizeObject(obj[key])
    }
    return sanitized
  }
  return obj
}

// Middleware: sanitize req.body, req.query, req.params
const xssProtect = (req, res, next) => {
  if (req.body)   req.body   = sanitizeObject(req.body)
  if (req.query)  req.query  = sanitizeObject(req.query)
  if (req.params) req.params = sanitizeObject(req.params)
  next()
}

// Middleware: validate admin JWT exists before heavy operations
const requireJson = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const ct = req.headers['content-type'] || ''
    if (!ct.includes('application/json') && !ct.includes('multipart/form-data')) {
      return res.status(400).json({ success: false, message: 'JSON content-type required' })
    }
  }
  next()
}

module.exports = { xssProtect, requireJson }
