import { Router } from 'express'
import { z } from 'zod'
import slugify from 'slugify'
import prisma from '../lib/prisma'
import { verifyJWT } from '../middleware/auth'
import { apiLimiter } from '../middleware/rateLimit'

const router = Router()
router.use(apiLimiter)

const vehicleSchema = z.object({
  title: z.string().min(3),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  price: z.number().positive(),
  mileage: z.number().int().min(0),
  fuelType: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC']),
  transmission: z.enum(['AUTOMATIC', 'MANUAL']),
  bodyType: z.enum(['SEDAN', 'SUV', 'COUPE', 'CONVERTIBLE', 'WAGON']),
  location: z.enum(['LAGOS', 'ABUJA', 'PORT_HARCOURT']),
  condition: z.enum(['NEW', 'USED', 'CERTIFIED_PRE_OWNED']),
  color: z.string().min(1),
  description: z.string().min(10),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  video: z.string().optional(),
  gallery360: z.array(z.string()).default([]),
  inspectionPdfUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
})

// GET /api/vehicles
router.get('/', async (req, res, next) => {
  try {
    const {
      make, model, minYear, maxYear, minPrice, maxPrice, maxMileage,
      fuelType, transmission, bodyType, location, condition, isFeatured,
      search, page = '1', limit = '12', sort = 'newest',
    } = req.query as Record<string, string>

    // Build where clause dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isAvailable: true }

    if (make) where.make = { equals: make, mode: 'insensitive' }
    if (model) where.model = { equals: model, mode: 'insensitive' }
    if (minYear || maxYear) {
      where.year = {}
      if (minYear) where.year.gte = Number(minYear)
      if (maxYear) where.year.lte = Number(maxYear)
    }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = BigInt(minPrice)
      if (maxPrice) where.price.lte = BigInt(maxPrice)
    }
    if (maxMileage) where.mileage = { lte: Number(maxMileage) }
    if (fuelType) {
      const fuels = Array.isArray(fuelType) ? fuelType : [fuelType]
      where.fuelType = { in: fuels }
    }
    if (transmission) where.transmission = transmission
    if (bodyType) {
      const bodies = Array.isArray(bodyType) ? bodyType : [bodyType]
      where.bodyType = { in: bodies }
    }
    if (location) {
      const locs = Array.isArray(location) ? location : [location]
      where.location = { in: locs }
    }
    if (condition) {
      const conds = Array.isArray(condition) ? condition : [condition]
      where.condition = { in: conds }
    }
    if (isFeatured === 'true') where.isFeatured = true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy =
      sort === 'price_asc' ? { price: 'asc' as const }
      : sort === 'price_desc' ? { price: 'desc' as const }
      : sort === 'year_desc' ? { year: 'desc' as const }
      : { createdAt: 'desc' as const }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(50, Number(limit))
    const skip = (pageNum - 1) * limitNum

    const [total, vehicles] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.findMany({
        where, orderBy, skip, take: limitNum,
        select: {
          id: true, slug: true, title: true, make: true, model: true,
          year: true, price: true, mileage: true, fuelType: true,
          transmission: true, bodyType: true, location: true, condition: true,
          images: true, isFeatured: true, isAvailable: true, importSource: true,
          createdAt: true,
        },
      }),
    ])

    return res.json({
      data: vehicles.map((v: { price: bigint; [key: string]: unknown }) => ({ ...v, price: Number(v.price) })),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/vehicles/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { slug: req.params.slug } })
    if (!vehicle) return res.status(404).json({ error: 'Not Found', message: 'Vehicle not found' })
    return res.json({ ...vehicle, price: Number(vehicle.price) })
  } catch (err) {
    next(err)
  }
})

// POST /api/vehicles (admin)
router.post('/', verifyJWT, async (req, res, next) => {
  try {
    const data = vehicleSchema.parse(req.body)
    const baseSlug = slugify(`${data.year}-${data.make}-${data.model}`, { lower: true, strict: true })

    let slug = baseSlug
    let counter = 1
    while (await prisma.vehicle.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    const vehicle = await prisma.vehicle.create({
      data: { ...data, slug, price: BigInt(data.price) },
    })
    return res.status(201).json({ ...vehicle, price: Number(vehicle.price) })
  } catch (err) {
    next(err)
  }
})

// PUT /api/vehicles/:id (admin)
router.put('/:id', verifyJWT, async (req, res, next) => {
  try {
    const data = vehicleSchema.partial().parse(req.body)
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: { ...data, ...(data.price !== undefined ? { price: BigInt(data.price) } : {}) },
    })
    return res.json({ ...vehicle, price: Number(vehicle.price) })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/vehicles/:id — soft delete (admin)
router.delete('/:id', verifyJWT, async (req, res, next) => {
  try {
    await prisma.vehicle.update({
      where: { id: req.params.id },
      data: { isAvailable: false },
    })
    return res.json({ message: 'Vehicle removed from listings' })
  } catch (err) {
    next(err)
  }
})

export default router
