import { Router } from 'express'
import { z } from 'zod'
import slugify from 'slugify'
import prisma from '../lib/prisma'
import { verifyJWT } from '../middleware/auth'
import { apiLimiter } from '../middleware/rateLimit'

const router = Router()
router.use(apiLimiter)

const blogSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(10),
  body: z.string().min(20),
  coverImage: z.string().optional(),
  author: z.string().default('Eleniyan Motors'),
  category: z.enum(['CAR_NEWS', 'MAINTENANCE_TIPS', 'CAR_OF_THE_WEEK', 'BUYING_GUIDE']).default('CAR_NEWS'),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

// ─── GET /api/blog (public) ───────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const {
      category, page = '1', limit = '9', published = 'true',
    } = req.query as Record<string, string>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    // Only filter by published if explicitly passed
    if (published === 'true') where.published = true
    else if (published === 'false') where.published = false
    // If not passed or 'all', return everything

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(50, Number(limit))
    const skip = (pageNum - 1) * limitNum

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true, slug: true, title: true, excerpt: true,
          coverImage: true, author: true, category: true,
          tags: true, published: true, publishedAt: true,
          createdAt: true, seoTitle: true, seoDesc: true,
        },
      }),
    ])

    return res.json({ data: posts, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/blog/:slug (public) ─────────────────────────────────────────────
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } })
    if (!post) return res.status(404).json({ error: 'Not Found', message: 'Blog post not found' })
    return res.json(post)
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/blog (admin) ───────────────────────────────────────────────────
router.post('/', verifyJWT, async (req, res, next) => {
  try {
    const data = blogSchema.parse(req.body)
    const baseSlug = slugify(data.title, { lower: true, strict: true })

    let slug = baseSlug
    let counter = 1
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug,
        publishedAt: data.published ? new Date() : null,
      },
    })
    return res.status(201).json(post)
  } catch (err) {
    next(err)
  }
})

// ─── PUT /api/blog/:id (admin) ────────────────────────────────────────────────
router.put('/:id', verifyJWT, async (req, res, next) => {
  try {
    const data = blogSchema.partial().parse(req.body)

    // If publishing for the first time, set publishedAt
    const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } })
    const publishedAt = data.published && !existing?.published ? new Date() : existing?.publishedAt

    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: { ...data, publishedAt },
    })
    return res.json(post)
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/blog/:id (admin) ─────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req, res, next) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } })
    return res.json({ message: 'Blog post deleted' })
  } catch (err) {
    next(err)
  }
})

export default router
