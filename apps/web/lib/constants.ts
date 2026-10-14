export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2349036942616'
export const BUSINESS_EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'eleniyanautos@gmail.com'

export const MAKES = [
  'Mercedes-Benz',
  'Toyota',
  'Lexus',
  'Honda',
  'Ford',
  'Hyundai',
  'Kia',
  'Volkswagen',
  'Nissan',
  'Infiniti',
  'Mitsubishi',
  'Peugeot',
  'Jeep',
  'Dodge',
  'Chevrolet',
]

export const MODELS_BY_MAKE: Record<string, string[]> = {
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC', 'G-Class', 'A-Class', 'CLA'],
  Toyota: ['Camry', 'Corolla', 'Highlander', 'Land Cruiser', 'Prado', 'RAV4', 'Venza', 'Sienna'],
  Lexus: ['ES', 'RX', 'GX', 'LX', 'IS', 'LS', 'NX', 'UX'],
  Honda: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'HR-V'],
  Ford: ['Explorer', 'Expedition', 'Edge', 'Escape', 'F-150', 'Ranger'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Creta'],
  Kia: ['Sorento', 'Sportage', 'Telluride', 'Carnival', 'K5', 'Stinger'],
  Volkswagen: ['Tiguan', 'Touareg', 'Passat', 'Golf', 'Polo', 'Amarok'],
  Nissan: ['Pathfinder', 'Murano', 'Altima', 'Sentra', 'Armada', 'Frontier'],
  Infiniti: ['QX80', 'QX60', 'QX50', 'Q50', 'Q60'],
  Mitsubishi: ['Pajero', 'Outlander', 'Eclipse Cross', 'L200'],
  Peugeot: ['508', '3008', '5008', '2008', '308'],
  Jeep: ['Grand Cherokee', 'Wrangler', 'Compass', 'Cherokee', 'Gladiator'],
  Dodge: ['Durango', 'Charger', 'Challenger', 'RAM 1500'],
  Chevrolet: ['Tahoe', 'Suburban', 'Traverse', 'Equinox', 'Silverado', 'Blazer'],
}

// ─── Single location: Ijebu-Ode, Ogun State ───────────────────────────────────

export const LOCATIONS = [
  { value: 'IJEBU_ODE', label: 'Ijebu-Ode, Ogun State' },
]

export const OFFICE_LOCATIONS = [
  {
    city: 'Ijebu-Ode Showroom',
    address: 'Molipa Express, Tomola, Front of Ifix Complex, Ijebu-Ode, Ogun State, Nigeria',
    phone: '+234 903 694 2616',
    email: 'eleniyanautos@gmail.com',
    // Exact GPS coordinates: 6.840215857295552, 3.912815222574494
    // N6°50'24.777'', E3°54'46.134''
    mapUrl: 'https://maps.google.com/maps?q=6.840215857295552,3.912815222574494&z=17&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=6.840215857295552,3.912815222574494',
    hours: 'Mon–Sat: 9am – 6pm',
    coordinates: { lat: 6.840215857295552, lng: 3.912815222574494 },
  },
]

// ─── Other constants ───────────────────────────────────────────────────────────

export const FUEL_TYPES = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ELECTRIC', label: 'Electric' },
]

export const TRANSMISSIONS = [
  { value: 'AUTOMATIC', label: 'Automatic' },
  { value: 'MANUAL', label: 'Manual' },
]

export const BODY_TYPES = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'COUPE', label: 'Coupé' },
  { value: 'CONVERTIBLE', label: 'Convertible' },
  { value: 'WAGON', label: 'Wagon' },
]

export const CONDITIONS = [
  { value: 'NEW', label: 'Brand New' },
  { value: 'USED', label: 'Used' },
  { value: 'CERTIFIED_PRE_OWNED', label: 'Certified Pre-Owned' },
]

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const TRUST_BADGES = [
  {
    icon: 'shield-check',
    title: 'Verified Sellers',
    description: 'Every dealer undergoes our rigorous verification process',
  },
  {
    icon: 'file-text',
    title: 'Inspection Reports',
    description: 'Comprehensive 100-point inspection on every vehicle',
  },
  {
    icon: 'award',
    title: 'Warranty Backed',
    description: 'Extended warranty options available on all listings',
  },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'year_desc', label: 'Year: Newest' },
]

export const YEAR_OPTIONS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i)

export const PRICE_MIN = 0
export const PRICE_MAX = 1_000_000_000
