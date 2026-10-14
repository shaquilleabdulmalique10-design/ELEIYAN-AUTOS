import { Router } from 'express'
import { z } from 'zod'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { verifyJWT } from '../middleware/auth'

const router = Router()

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET = process.env.AWS_S3_BUCKET || 'eleniyan-media'
const CDN_URL = process.env.AWS_CLOUDFRONT_URL || `https://${BUCKET}.s3.amazonaws.com`

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/avif',
  'application/pdf', 'video/mp4', 'video/webm',
]

const MAX_SIZE_MB = 50

// POST /api/uploads/image — generate presigned upload URL
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

    // Sanitise filename
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase()
    const key = `uploads/${Date.now()}-${safe}`

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }) // 5 min
    const fileUrl = `${CDN_URL}/${key}`

    return res.json({ uploadUrl, fileUrl })
  } catch (err) {
    next(err)
  }
})

export default router
