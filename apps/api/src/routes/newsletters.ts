import { Router } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { emailService } from '../services/email.service'
import { publicPostLimiter } from '../middleware/rateLimit'

const router = Router()

// POST /api/newsletters
router.post('/', publicPostLimiter, async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body)

    // Upsert — ignore if already subscribed
    const newsletter = await prisma.newsletter.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    })

    // Subscribe to Brevo (fire-and-forget)
    emailService.subscribeToNewsletter(email).catch(console.error)

    return res.json({ message: 'Subscribed successfully' })
  } catch (err) {
    next(err)
  }
})

export default router
