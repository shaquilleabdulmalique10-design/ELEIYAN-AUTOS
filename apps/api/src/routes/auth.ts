import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { verifyJWT, type AuthRequest } from '../middleware/auth'
import { authLimiter } from '../middleware/rateLimit'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: '8h' }
    )

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
router.get('/me', verifyJWT, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ error: 'Not Found', message: 'User not found' })
    return res.json(user)
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/logout (client-side token removal, server just acknowledges)
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' })
})

export default router
