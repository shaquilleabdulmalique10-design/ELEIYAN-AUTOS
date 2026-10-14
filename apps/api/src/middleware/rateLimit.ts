import rateLimit from 'express-rate-limit'

export const publicPostLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too Many Requests', message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too Many Requests', message: 'Too many login attempts, please try again later.' },
})

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded.' },
})
