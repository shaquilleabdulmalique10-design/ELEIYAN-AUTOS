import { Router } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { verifyJWT } from '../middleware/auth'
import { publicPostLimiter, apiLimiter } from '../middleware/rateLimit'
import { crmService } from '../services/crm.service'
import { whatsappService } from '../services/whatsapp.service'
import { emailService } from '../services/email.service'

const router = Router()

const createLeadSchema = z.object({
  type: z.enum(['REQUEST_VIEWING', 'TRADE_IN', 'CONTACT', 'NEWSLETTER', 'SCHEDULE_VIEWING']),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  message: z.string().optional(),
  vehicleId: z.string().optional(),
  tradeInMake: z.string().optional(),
  tradeInModel: z.string().optional(),
  tradeInYear: z.number().optional(),
  tradeInMileage: z.number().optional(),
  tradeInCondition: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  // Honeypot — if filled, silently discard
  website: z.string().max(0).optional(),
})

// ─── POST /api/leads (public) ─────────────────────────────────────────────────
router.post('/', publicPostLimiter, async (req, res, next) => {
  try {
    const data = createLeadSchema.parse(req.body)

    // Honeypot check
    if (data.website) {
      return res.status(200).json({ message: 'Lead received' }) // silent discard
    }

    // Resolve vehicle title if vehicleId provided
    let vehicleTitle: string | undefined
    if (data.vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId },
        select: { title: true },
      })
      vehicleTitle = vehicle?.title
    }

    // Save to DB
    const lead = await prisma.lead.create({
      data: {
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        vehicleId: data.vehicleId,
        vehicleTitle,
        tradeInMake: data.tradeInMake,
        tradeInModel: data.tradeInModel,
        tradeInYear: data.tradeInYear,
        tradeInMileage: data.tradeInMileage,
        tradeInCondition: data.tradeInCondition,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        source: req.headers.referer || 'direct',
      },
    })

    // Fire-and-forget integrations (don't block response)
    Promise.allSettled([
      crmService.createOrUpdateContact(lead),
      whatsappService.sendLeadNotification(lead),
      emailService.sendLeadConfirmation(lead),
    ]).catch(console.error)

    return res.status(201).json({ message: 'Lead received successfully', id: lead.id })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/leads (admin) ───────────────────────────────────────────────────
router.get('/', verifyJWT, apiLimiter, async (req, res, next) => {
  try {
    const {
      status, type, page = '1', limit = '15', search, sort = 'newest',
    } = req.query as Record<string, string>

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (type) where.type = type
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(100, Number(limit))
    const skip = (pageNum - 1) * limitNum

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: sort === 'oldest' ? 'asc' : 'desc' },
        skip,
        take: limitNum,
      }),
    ])

    return res.json({
      data: leads,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/leads/:id (admin) ─────────────────────────────────────────────
router.patch('/:id', verifyJWT, async (req, res, next) => {
  try {
    const { status } = z
      .object({ status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED_WON', 'CLOSED_LOST']) })
      .parse(req.body)

    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { status },
    })
    return res.json(lead)
  } catch (err) {
    next(err)
  }
})

export default router
