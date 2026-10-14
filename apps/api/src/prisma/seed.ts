import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const VEHICLES = [
  {
    slug: '2022-toyota-camry',
    title: '2022 Toyota Camry XSE',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: BigInt('850000000'),
    mileage: 32000,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SEDAN' as const,
    location: 'IJEBU_ODE' as const,
    condition: 'USED' as const,
    color: 'Pearl White',
    isFeatured: true,
    description: 'Very clean 2022 Toyota Camry XSE in Pearl White. Full AC, perfect engine, no fault. Registered in Ogun State.',
    features: ['Leather Seats', 'Reverse Camera', 'Apple CarPlay', 'Blind Spot Monitor', 'Push Start'],
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=85'],
    gallery360: [],
  },
  {
    slug: '2021-lexus-rx350',
    title: '2021 Lexus RX 350',
    make: 'Lexus',
    model: 'RX',
    year: 2021,
    price: BigInt('2200000000'),
    mileage: 28000,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SUV' as const,
    location: 'IJEBU_ODE' as const,
    condition: 'USED' as const,
    color: 'Obsidian Black',
    isFeatured: true,
    description: 'Sharp 2021 Lexus RX 350 in Obsidian Black. Full leather, panoramic roof, all round camera. No issues whatsoever.',
    features: ['Panoramic Sunroof', 'All-Round Camera', 'Heated Seats', 'Mark Levinson Audio', 'Lane Assist'],
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=85'],
    gallery360: [],
  },
  {
    slug: '2020-mercedes-benz-gle450',
    title: '2020 Mercedes-Benz GLE 450',
    make: 'Mercedes-Benz',
    model: 'GLE',
    year: 2020,
    price: BigInt('3500000000'),
    mileage: 41000,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SUV' as const,
    location: 'IJEBU_ODE' as const,
    condition: 'USED' as const,
    color: 'Polar White',
    isFeatured: true,
    description: '2020 Mercedes-Benz GLE 450 AMG Line in Polar White. Full option, Burmester sound, MBUX display, panoramic roof. Excellent condition.',
    features: ['Burmester Sound', 'MBUX System', 'Panoramic Roof', 'Air Suspension', 'AMG Line'],
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=85'],
    gallery360: [],
  },
  {
    slug: '2023-toyota-prado',
    title: '2023 Toyota Land Cruiser Prado',
    make: 'Toyota',
    model: 'Prado',
    year: 2023,
    price: BigInt('5800000000'),
    mileage: 12000,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SUV' as const,
    location: 'IJEBU_ODE' as const,
    condition: 'USED' as const,
    color: 'Graphite',
    isFeatured: true,
    description: 'Virtually new 2023 Toyota Land Cruiser Prado in Graphite. Very low mileage, full leather, 7 seats, sunroof.',
    features: ['7 Seater', 'Sunroof', 'Full Leather', 'Multi-Terrain Select', 'Crawl Control'],
    images: ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=85'],
    gallery360: [],
  },
  {
    slug: '2019-honda-accord',
    title: '2019 Honda Accord Sport',
    make: 'Honda',
    model: 'Accord',
    year: 2019,
    price: BigInt('650000000'),
    mileage: 55000,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SEDAN' as const,
    location: 'IJEBU_ODE' as const,
    condition: 'USED' as const,
    color: 'Modern Steel',
    isFeatured: false,
    description: '2019 Honda Accord Sport 1.5T in Modern Steel. Clean interior, no accident, good tyres. Perfect family car.',
    features: ['Honda Sensing', 'Wireless CarPlay', 'Remote Start', 'Lane Keeping Assist'],
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=85'],
    gallery360: [],
  },
  {
    slug: '2022-ford-explorer',
    title: '2022 Ford Explorer XLT',
    make: 'Ford',
    model: 'Explorer',
    year: 2022,
    price: BigInt('1900000000'),
    mileage: 22000,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SUV' as const,
    location: 'IJEBU_ODE' as const,
    condition: 'USED' as const,
    color: 'Rapid Red',
    isFeatured: false,
    description: '2022 Ford Explorer XLT in Rapid Red. 3-row seating, SYNC 4 system, very clean with all service records.',
    features: ['3-Row Seating', 'SYNC 4', 'Co-Pilot 360', 'Panoramic Vista Roof', 'B&O Audio'],
    images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=85'],
    gallery360: [],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  const hashedPassword = await bcrypt.hash('Admin@Eleniyan2024!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eleniyan.com' },
    update: {},
    create: {
      email: 'admin@eleniyan.com',
      password: hashedPassword,
      name: 'Eleniyan Admin',
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin: ${admin.email}`)

  for (const v of VEHICLES) {
    await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: {},
      create: v,
    })
    console.log(`✅ ${v.title}`)
  }

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
