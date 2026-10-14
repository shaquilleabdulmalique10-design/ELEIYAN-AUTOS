import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { json } from 'express'

import vehicleRoutes from './routes/vehicles'
import leadRoutes from './routes/leads'
import authRoutes from './routes/auth'
import uploadRoutes from './routes/uploads'
import newsletterRoutes from './routes/newsletters'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT || 4000

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true,
  })
)

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(json({ limit: '10mb' }))

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/newsletters', newsletterRoutes)

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Eleniyan API running on http://localhost:${PORT}`)
})

export default app
