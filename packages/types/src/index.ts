// ─── Enums ────────────────────────────────────────────────────────────────────

export type FuelType = 'PETROL' | 'DIESEL' | 'HYBRID' | 'ELECTRIC'
export type Transmission = 'AUTOMATIC' | 'MANUAL'
export type BodyType = 'SEDAN' | 'SUV' | 'COUPE' | 'CONVERTIBLE' | 'WAGON'
export type VehicleLocation = 'IJEBU_ODE'
export type Condition = 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED'
export type ImportSource = 'LOCAL'
export type LeadType =
  | 'REQUEST_VIEWING'
  | 'TRADE_IN'
  | 'CONTACT'
  | 'NEWSLETTER'
  | 'SCHEDULE_VIEWING'
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED_WON' | 'CLOSED_LOST'
export type UserRole = 'ADMIN' | 'EDITOR'

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export interface Vehicle {
  id: string
  slug: string
  title: string
  make: string
  model: string
  year: number
  price: number // stored in kobo, display in naira
  mileage: number
  fuelType: FuelType
  transmission: Transmission
  bodyType: BodyType
  location: VehicleLocation
  condition: Condition
  color: string
  description: string
  features: string[]
  images: string[]
  video?: string
  gallery360: string[]
  inspectionPdfUrl?: string
  isFeatured: boolean
  isAvailable: boolean
  importSource?: ImportSource
  createdAt: string
  updatedAt: string
}

export interface VehicleListItem
  extends Pick<
    Vehicle,
    | 'id'
    | 'slug'
    | 'title'
    | 'make'
    | 'model'
    | 'year'
    | 'price'
    | 'mileage'
    | 'fuelType'
    | 'transmission'
    | 'bodyType'
    | 'location'
    | 'condition'
    | 'images'
    | 'isFeatured'
    | 'isAvailable'
    | 'importSource'
  > {}

export interface VehicleFilters {
  make?: string
  model?: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  maxMileage?: number
  fuelType?: FuelType
  transmission?: Transmission
  bodyType?: BodyType
  location?: VehicleLocation
  condition?: Condition
  isFeatured?: boolean
  search?: string
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'year_desc' | 'newest'
}

export interface PaginatedVehicles {
  data: VehicleListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string
  type: LeadType
  name: string
  email: string
  phone: string
  message?: string
  vehicleId?: string
  vehicleTitle?: string
  status: LeadStatus
  crmId?: string
  source?: string
  createdAt: string
  updatedAt: string
}

export interface CreateLeadInput {
  type: LeadType
  name: string
  email: string
  phone: string
  message?: string
  vehicleId?: string
  // Trade-in specific
  tradeInMake?: string
  tradeInModel?: string
  tradeInYear?: number
  tradeInMileage?: number
  tradeInCondition?: string
  // Viewing specific
  preferredDate?: string
  preferredTime?: string
  // Honeypot
  website?: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

// ─── Blog (Strapi) ────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string | number
  slug: string
  title: string
  excerpt: string
  body: string
  coverImage: string
  author: string
  publishedAt: string
  tags: BlogTag[]
  seoTitle?: string
  seoDescription?: string
  category: 'import-duty-guides' | 'maintenance-tips' | 'car-of-the-week'
}

export interface BlogTag {
  id: string | number
  name: string
  slug: string
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavLink {
  label: string
  href: string
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  slug: string
  title: string
  year: number
  price: number
  images: string[]
  make: string
  model: string
  location: VehicleLocation
  addedAt: string
}
