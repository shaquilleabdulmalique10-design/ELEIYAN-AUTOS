import { Router } from 'express'
import { z } from 'zod'
import crypto from 'crypto'
import { verifyJWT } from '../middleware/auth'

const router = Router()

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''
const API_KEY    = process.env.CLOUDINARY_API_KEY || ''
const API_SECRET = process.env.CLOUDINARY_API_SECRET || ''

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/avif',
  'application/pdf', 'video/mp4', 'video/webm',
]

// POST /api/uploads/image
// Returns Cloudinary signed upload params — browser uploads directly to Cloudinary
router.post('/image', verifyJWT, async (req, res, next) => {
  try {
    const { filename, contentType } = z
      .object({
        filename: z.string().min(1).max(200),
        contentType: z.string().min(1),
      })
      .parse(req.body)

    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `File type ${contentType} is not allowed`,
      })
    }

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return res.status(500).json({
        error: 'Server Error',
        message: 'Cloudinary credentials not configured',
      })
    }

    const timestamp = Math.round(Date.now() / 1000)
    const folder = 'eleniyan'
    const publicId = `${folder}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase()}`

    // Generate signature
    const toSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`
    const signature = crypto.createHash('sha256').update(toSign).digest('hex')

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`
    const fileUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`

    return res.json({
      // For direct browser upload to Cloudinary
      uploadUrl,
      fileUrl,
      // Signed params the browser needs to send
      cloudinaryParams: {
        api_key: API_KEY,
        timestamp,
        signature,
        public_id: publicId,
        folder,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
