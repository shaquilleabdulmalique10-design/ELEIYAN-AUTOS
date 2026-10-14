import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string }
}

export function verifyJWT(req: AuthRequest, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' })
    return
  }

  const token = auth.slice(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme') as {
      id: string
      email: string
      role: string
    }
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden', message: 'Admin access required' })
    return
  }
  next()
}
