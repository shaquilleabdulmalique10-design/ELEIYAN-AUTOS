# Design: Luxury Car Dealership Platform

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Vercel                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Next.js App (App Router)               │   │
│  │  - Public pages (SSG/ISR)                        │   │
│  │  - Admin Dashboard (SSR, auth-gated)             │   │
│  │  - API Routes (BFF for integrations)             │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────┐      ┌──────────────────────────┐
│   Strapi CMS     │      │   Node.js API (AWS EC2/  │
│   (AWS/Railway)  │      │   ECS) + PostgreSQL RDS  │
│   - Blog posts   │      │   - Vehicles             │
│   - Pages/Media  │      │   - Leads                │
└──────────────────┘      │   - Users/Auth           │
                          └──────────────────────────┘
          │                          │
          └──────────┬───────────────┘
                     ▼
          ┌────────────────────┐
          │  External Services │
          │  - WhatsApp Biz API│
          │  - HubSpot/Zoho CRM│
          │  - Brevo Email     │
          │  - Paystack        │
          │  - Google Maps     │
          │  - GA4             │
          └────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | SSG/ISR for public pages, SSR for admin |
| Styling | Tailwind CSS + CSS custom properties | Design tokens for navy/gold/charcoal |
| CMS | Strapi v4 (headless) | Blog + media management |
| Backend API | Node.js + Express + TypeScript | Vehicles, leads, auth endpoints |
| Database | PostgreSQL (AWS RDS) | Primary data store |
| ORM | Prisma | Type-safe DB access |
| Auth | NextAuth.js (admin) + JWT | Admin dashboard auth |
| Hosting | Vercel (Next.js) + AWS (API + DB) | |
| Media | AWS S3 + CloudFront CDN | Vehicle images, PDFs, videos |
| Payments | Paystack | Booking/deposit flows |
| Email | Brevo (Sendinblue) | Transactional + newsletters |
| Analytics | Google Analytics 4 | Via next/script |
| Monitoring | Sentry | Error tracking |

---

## Project Structure

```
/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx          # Homepage
│   │   │   │   ├── inventory/
│   │   │   │   │   ├── page.tsx      # Inventory listing
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Vehicle detail
│   │   │   │   ├── services/page.tsx
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── testimonials/page.tsx
│   │   │   │   ├── contact/page.tsx
│   │   │   │   └── blog/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [slug]/page.tsx
│   │   │   └── (admin)/
│   │   │       ├── layout.tsx        # Auth guard
│   │   │       └── dashboard/
│   │   │           ├── page.tsx      # Analytics overview
│   │   │           ├── inventory/
│   │   │           ├── leads/
│   │   │           └── blog/
│   │   ├── components/
│   │   │   ├── ui/                   # Base design system components
│   │   │   ├── layout/               # Header, Footer, Nav
│   │   │   ├── home/                 # Hero, QuickFilter, FeaturedListings
│   │   │   ├── inventory/            # FilterPanel, VehicleCard, Gallery360
│   │   │   ├── forms/                # RequestViewing, TradeIn, Contact
│   │   │   └── admin/                # Dashboard widgets
│   │   ├── lib/
│   │   │   ├── api.ts                # API client
│   │   │   ├── strapi.ts             # Strapi client
│   │   │   ├── crm.ts                # HubSpot/Zoho wrapper
│   │   │   ├── whatsapp.ts           # WhatsApp Business API
│   │   │   └── analytics.ts          # GA4 helpers
│   │   └── styles/
│   │       └── globals.css
│   └── api/                          # Node.js backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── vehicles.ts
│       │   │   ├── leads.ts
│       │   │   ├── auth.ts
│       │   │   └── uploads.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   └── rateLimit.ts
│       │   ├── services/
│       │   │   ├── crm.service.ts
│       │   │   ├── whatsapp.service.ts
│       │   │   └── email.service.ts
│       │   └── prisma/
│       │       └── schema.prisma
└── packages/
    └── types/                        # Shared TypeScript types
```

---

## Database Schema (Prisma)

```prisma
model Vehicle {
  id                String    @id @default(cuid())
  slug              String    @unique
  title             String
  make              String
  model             String
  year              Int
  price             BigInt            // in kobo (₦)
  mileage           Int
  fuelType          FuelType
  transmission      Transmission
  bodyType          BodyType
  location          Location
  condition         Condition
  color             String
  description       String            @db.Text
  features          String[]
  images            String[]          // S3 URLs
  video             String?           // Walkaround video URL
  gallery360        String[]          // 360° image URLs
  inspectionPdfUrl  String?
  isFeatured        Boolean           @default(false)
  isAvailable       Boolean           @default(true)
  importSource      ImportSource?     // UK | US | JAPAN | LOCAL
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  leads             Lead[]
}

model Lead {
  id          String     @id @default(cuid())
  type        LeadType   // REQUEST_VIEWING | TRADE_IN | CONTACT | NEWSLETTER | SCHEDULE_VIEWING
  name        String
  email       String
  phone       String
  message     String?    @db.Text
  vehicleId   String?
  vehicle     Vehicle?   @relation(fields: [vehicleId], references: [id])
  status      LeadStatus @default(NEW)
  crmId       String?    // HubSpot/Zoho contact ID
  source      String?    // UTM source
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  role      Role     @default(EDITOR)
  name      String
  createdAt DateTime @default(now())
}

enum FuelType       { PETROL DIESEL HYBRID ELECTRIC }
enum Transmission   { AUTOMATIC MANUAL }
enum BodyType       { SEDAN SUV COUPE CONVERTIBLE WAGON }
enum Location       { LAGOS ABUJA PORT_HARCOURT }
enum Condition      { NEW USED CERTIFIED_PRE_OWNED }
enum ImportSource   { UK US JAPAN LOCAL }
enum LeadType       { REQUEST_VIEWING TRADE_IN CONTACT NEWSLETTER SCHEDULE_VIEWING }
enum LeadStatus     { NEW CONTACTED QUALIFIED CLOSED_WON CLOSED_LOST }
enum Role           { ADMIN EDITOR }
```

---

## Page-by-Page Design

### Homepage
- **Hero**: Full-viewport video slider using `next/image` + video fallback. Auto-advances every 6s. Overlay text with headline + sub-headline. CTA button → `/inventory`
- **Quick Filter Bar**: Horizontal filter strip below hero. Dropdowns for Make, Model, Price (₦ range slider), Year, Location. "Search" submits to `/inventory` with query params
- **Featured Listings**: 3-column grid (1-col mobile, 2-col tablet). Each card: image, make/model, year, price, location badge, "View Details" CTA
- **Trust Badges**: Icon + label row — Verified Sellers | Inspection Reports | Warranty Backed

### Inventory Listing
- **Filter Panel**: Left sidebar (desktop) / bottom sheet (mobile). All filter controls. "Apply Filters" updates URL query params without full page reload (React state + `router.push`)
- **Results**: Grid/List toggle stored in localStorage. Pagination (12 per page). Sort by: Price ↑↓, Year ↓, Newest
- **Vehicle Card**: Image, title, key specs strip (year | mileage | fuel | transmission), price in ₦, location, "View Details" button

### Vehicle Detail Page
- **Gallery**: Swipeable image carousel (Embla Carousel). Tab switcher: Photos | 360° View | Video
- **Specs Table**: Full specification breakdown in two-column table
- **Sidebar CTAs**: Sticky on desktop. "Request Viewing" and "Trade-In Valuation" open modal forms
- **Inspection PDF**: Download button linking to S3-hosted PDF
- **Lead Forms (Modal)**: Controlled React forms → POST `/api/leads` → CRM sync + WhatsApp notification

### Admin Dashboard
- **Auth**: Login page with email/password → NextAuth credentials provider → JWT session
- **Inventory Manager**: Data table with search, sort, pagination. "Add Vehicle" / "Edit" opens full form with drag-and-drop image upload to S3
- **Leads View**: Table with filters by status/type. Click-through to lead detail with CRM link
- **Blog Manager**: List of Strapi articles with publish/unpublish toggle; "Edit in Strapi" deep-link
- **Analytics Panel**: Embedded GA4 data via Reporting API — total users, top pages, leads by source

---

## API Endpoints (Node.js Backend)

```
GET    /api/vehicles          # List with filters & pagination
GET    /api/vehicles/:slug    # Single vehicle detail
POST   /api/vehicles          # Create (admin)
PUT    /api/vehicles/:id      # Update (admin)
DELETE /api/vehicles/:id      # Delete (admin, soft delete)

POST   /api/leads             # Create lead (public)
GET    /api/leads             # List leads (admin)
PATCH  /api/leads/:id         # Update lead status (admin)

POST   /api/auth/login        # Admin login
POST   /api/auth/logout
GET    /api/auth/me

POST   /api/uploads/image     # S3 presigned URL generation
POST   /api/newsletters       # Newsletter subscription → Brevo
```

---

## Integration Flows

### Lead Submission Flow
```
User submits form
      │
      ▼
POST /api/leads (Next.js API route)
      │
      ├──► Save to PostgreSQL (leads table)
      │
      ├──► POST to HubSpot/Zoho CRM API (create/update contact)
      │
      ├──► WhatsApp Business API → sales team group message
      │         "New lead: [Name] interested in [Vehicle] — [phone]"
      │
      └──► Brevo transactional email → user confirmation
```

### Inventory Media Upload Flow
```
Admin selects images
      │
      ▼
POST /api/uploads/image → S3 presigned URL
      │
      ▼
Frontend uploads directly to S3
      │
      ▼
S3 URL saved to vehicle record in PostgreSQL
      │
      ▼
CloudFront CDN serves images with cache headers
```

---

## Design Tokens

```css
:root {
  --color-navy:    #0A1628;
  --color-gold:    #C9A84C;
  --color-gold-light: #E8C97A;
  --color-charcoal: #2D2D2D;
  --color-white:   #FFFFFF;
  --color-gray-100: #F5F5F5;
  --color-gray-400: #9CA3AF;

  --font-heading:  'Playfair Display', Georgia, serif;
  --font-body:     'Inter', system-ui, sans-serif;

  --radius-card:   12px;
  --shadow-card:   0 4px 24px rgba(0,0,0,0.12);
}
```

---

## SEO & Performance Strategy

- Public pages use **ISR** with 1-hour revalidation for inventory, 24-hour for blog
- Homepage and static pages use full **SSG**
- `next/image` with `priority` on hero, lazy on cards; WebP/AVIF via Vercel Image Optimization
- JSON-LD structured data: `schema.org/Car` on vehicle detail pages, `schema.org/AutoDealer` on homepage
- `robots.txt` and `sitemap.xml` auto-generated via `next-sitemap`
- Font preloading for Playfair Display and Inter via `next/font`
- Core Web Vitals monitored via Vercel Speed Insights

---

## Security

- Rate limiting on all public POST endpoints (express-rate-limit: 10 req/min per IP)
- Honeypot field on all public forms + optional reCAPTCHA v3
- Admin routes protected by NextAuth middleware (`withAuth`)
- Helmet.js on Node.js API for security headers
- All secrets in `.env` files, never committed; managed via Vercel + AWS Secrets Manager
- S3 bucket is private; access via CloudFront signed URLs for PDFs
