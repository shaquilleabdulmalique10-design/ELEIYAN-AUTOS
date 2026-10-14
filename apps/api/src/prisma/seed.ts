import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const VEHICLES = [
  {
    slug: '2023-rolls-royce-ghost',
    title: '2023 Rolls-Royce Ghost',
    make: 'Rolls-Royce',
    model: 'Ghost',
    year: 2023,
    price: BigInt(38_000_000_00), // ₦380,000,000 in kobo
    mileage: 4200,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SEDAN' as const,
    location: 'LAGOS' as const,
    condition: 'USED' as const,
    color: 'Andalucian White',
    importSource: 'UK' as const,
    isFeatured: true,
    description:
      'An immaculate 2023 Rolls-Royce Ghost in Andalucian White with an Obsidian Black interior. This UK-imported example presents beautifully with only 4,200 km. Specification includes starlight headliner, panoramic sunroof, massage seats, and the full Bespoke Audio system. Full Rolls-Royce service history.',
    features: [
      'Starlight Headliner', 'Panoramic Sunroof', 'Bespoke Audio', 'Massage Seats',
      'Night Vision', 'Head-Up Display', 'Four-Zone Climate', 'Rear Entertainment',
    ],
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=85',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=85',
    ],
    gallery360: [],
  },
  {
    slug: '2022-bentley-bentayga-v8',
    title: '2022 Bentley Bentayga V8',
    make: 'Bentley',
    model: 'Bentayga',
    year: 2022,
    price: BigInt(22_500_000_00),
    mileage: 11_000,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SUV' as const,
    location: 'ABUJA' as const,
    condition: 'USED' as const,
    color: 'Onyx Black',
    importSource: 'US' as const,
    isFeatured: true,
    description:
      'A stunning 2022 Bentley Bentayga V8 finished in Onyx Black over Beluga leather. US-imported with 11,000 km. Features include the Touring specification, carbon ceramic brakes, and 22-inch directional alloy wheels. Bentley service history maintained.',
    features: [
      'Carbon Ceramic Brakes', '22" Directional Alloys', 'Touring Specification',
      'Naim Audio', 'Panoramic Sunroof', 'Heated/Ventilated Seats', 'Massage Seats',
    ],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=85',
    ],
    gallery360: [],
  },
  {
    slug: '2023-range-rover-autobiography',
    title: '2023 Range Rover Autobiography SWB',
    make: 'Range Rover',
    model: 'Range Rover',
    year: 2023,
    price: BigInt(14_500_000_00),
    mileage: 6_800,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SUV' as const,
    location: 'LAGOS' as const,
    condition: 'USED' as const,
    color: 'Santorini Black',
    importSource: 'UK' as const,
    isFeatured: true,
    description:
      'A virtually new 2023 Range Rover Autobiography in Santorini Black. UK supplied with a full Land Rover warranty until 2026. Specification includes SV Bespoke seating, panoramic sunroof, Meridian Signature Sound, and executive rear seat package.',
    features: [
      'SV Bespoke Seating', 'Meridian Signature Sound', 'Executive Rear Seats',
      'Panoramic Sunroof', 'Pixel LED Headlights', 'Air Suspension', 'Wade Sensing',
    ],
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=85',
    ],
    gallery360: [],
  },
  {
    slug: '2023-mercedes-maybach-s580',
    title: '2023 Mercedes-Maybach S 580 4MATIC',
    make: 'Maybach',
    model: 'S 580',
    year: 2023,
    price: BigInt(19_800_000_00),
    mileage: 3_100,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SEDAN' as const,
    location: 'LAGOS' as const,
    condition: 'USED' as const,
    color: 'High-Tech Silver / Obsidian Black',
    importSource: 'US' as const,
    isFeatured: true,
    description:
      'The pinnacle of luxury motoring. This 2023 Mercedes-Maybach S 580 in the iconic two-tone Silver/Black finish. US-imported with 3,100 km. Features the Maybach exclusive package with Bicolor Nappa leather, rear executive suite, and Burmester 4D surround sound.',
    features: [
      'Bicolor Nappa Leather', 'Rear Executive Suite', 'Burmester 4D Sound',
      'Rear Seat Massage', 'MBUX Entertainment', 'E-Active Body Control', 'Nightvision',
    ],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=85',
    ],
    gallery360: [],
  },
  {
    slug: '2022-porsche-cayenne-turbo',
    title: '2022 Porsche Cayenne Turbo GT',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2022,
    price: BigInt(17_200_000_00),
    mileage: 8_500,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SUV' as const,
    location: 'PORT_HARCOURT' as const,
    condition: 'USED' as const,
    color: 'GT Silver Metallic',
    importSource: 'UK' as const,
    isFeatured: false,
    description:
      'The definitive performance SUV. This 2022 Cayenne Turbo GT in GT Silver features the full aerodynamic package, carbon fibre interior trim, and Porsche ceramic composite brakes. UK supplied with full Porsche warranty.',
    features: [
      'PCCB Ceramic Brakes', 'Carbon Interior', 'Sport Chrono Package',
      'Burmester Surround Sound', 'Panoramic Sunroof', '22" RS Spyder Design Wheels',
    ],
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=85',
    ],
    gallery360: [],
  },
  {
    slug: '2022-bmw-x7-m60i',
    title: '2022 BMW X7 M60i xDrive',
    make: 'BMW',
    model: 'X7',
    year: 2022,
    price: BigInt(11_000_000_00),
    mileage: 14_200,
    fuelType: 'PETROL' as const,
    transmission: 'AUTOMATIC' as const,
    bodyType: 'SUV' as const,
    location: 'ABUJA' as const,
    condition: 'USED' as const,
    color: 'Frozen Portimao Blue',
    importSource: 'US' as const,
    isFeatured: false,
    description:
      'A commanding 2022 BMW X7 M60i in the stunning Frozen Portimao Blue. US-imported with 14,200 km. Seven-seat configuration with Bowers & Wilkins Diamond Surround Sound, Sky Lounge panoramic roof, and full BMW Individual specification.',
    features: [
      'Bowers & Wilkins Diamond Audio', 'Sky Lounge Panoramic Roof', '7-Seat Configuration',
      'BMW Individual', 'Heated/Ventilated Seats', '23" M Light Alloys', 'Soft Close Doors',
    ],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=85',
    ],
    gallery360: [],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@Eleniyan2024!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eleniyan.com' },
    update: {},
    create: {
      email: 'admin@eleniyan.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin user: ${admin.email}`)

  // Create vehicles
  for (const v of VEHICLES) {
    await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: {},
      create: v,
    })
    console.log(`✅ Vehicle: ${v.title}`)
  }

  console.log('✨ Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
