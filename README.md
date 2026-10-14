# Eleniyan Motors — Luxury Car Dealership Platform

Nigeria's premier luxury car dealership web platform. Built with Next.js 14, Node.js, PostgreSQL, and Strapi CMS.

---

## Architecture

```
apps/
  web/          # Next.js 14 (App Router) — frontend + admin dashboard
  api/          # Node.js + Express + TypeScript — REST API
packages/
  types/        # Shared TypeScript types
```

**Stack:** Next.js 14 · Tailwind CSS · Node.js · PostgreSQL · Prisma · Strapi CMS  
**Integrations:** WhatsApp Business API · HubSpot CRM · Brevo Email · Paystack · GA4  
**Hosting:** Vercel (web) · AWS EC2/RDS (API + DB)

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Docker)
- npm 10+

### 1. Clone & Install

```bash
git clone https://github.com/your-org/eleniyan.git
cd eleniyan
npm install
```

### 2. Start PostgreSQL

```bash
docker-compose up -d postgres
```

### 3. Configure environment variables

```bash
# API
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your DATABASE_URL and secrets

# Web
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local with your API URL and NextAuth secret
```

### 4. Run database migrations & seed

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init --schema src/prisma/schema.prisma
npx ts-node src/prisma/seed.ts
```

### 5. Start development servers

```bash
# Terminal 1 — API (port 4000)
npm run dev:api

# Terminal 2 — Web (port 3000)
npm run dev:web
```

Visit **http://localhost:3000**

---

## Admin Dashboard

URL: **http://localhost:3000/admin/login**

Default credentials (from seed):
- Email: `admin@eleniyan.com`
- Password: `Admin@Eleniyan2024!`

> ⚠️ Change the admin password immediately after first login in production.

---

## Project Structure

```
apps/web/app/
  (public)/               # All public-facing pages
    page.tsx              # Homepage
    inventory/            # Vehicle listings + detail pages
    services/             # Services page
    about/                # About page
    testimonials/         # Testimonials
    contact/              # Contact + Schedule Viewing
    blog/                 # Blog listing + posts
    privacy/ & terms/     # Legal pages
  (admin)/                # Auth-gated admin dashboard
    admin/login/          # Login page
    admin/dashboard/      # Dashboard home
      inventory/          # Vehicle CRUD
      leads/              # Lead management
      blog/               # Blog CMS (via Strapi)
      analytics/          # Analytics overview
  api/auth/               # NextAuth route handler
  robots.ts               # robots.txt generation
  sitemap.ts              # Sitemap generation

apps/api/src/
  routes/                 # Express route handlers
    vehicles.ts           # GET/POST/PUT/DELETE /api/vehicles
    leads.ts              # POST/GET/PATCH /api/leads
    auth.ts               # POST /api/auth/login
    uploads.ts            # POST /api/uploads/image (S3 presigned URLs)
    newsletters.ts        # POST /api/newsletters
  services/
    crm.service.ts        # HubSpot CRM integration
    whatsapp.service.ts   # WhatsApp Business API
    email.service.ts      # Brevo transactional email
  middleware/
    auth.ts               # JWT verification
    rateLimit.ts          # Rate limiting
    errorHandler.ts       # Global error handler
  prisma/
    schema.prisma         # Database schema
    seed.ts               # Seed data (6 vehicles + admin user)
```

---

## Environment Variables

### Web (`apps/web/.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL |
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (intl format, no +) |
| `NEXTAUTH_URL` | NextAuth callback URL |
| `NEXTAUTH_SECRET` | Random 32+ char secret |
| `STRAPI_URL` | Strapi CMS URL |
| `STRAPI_API_TOKEN` | Strapi read-only token |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID |

### API (`apps/api/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random 64+ char secret |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma separated) |
| `AWS_*` | S3/CloudFront credentials |
| `WHATSAPP_TOKEN` | Meta WhatsApp Business token |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta phone number ID |
| `WHATSAPP_SALES_NUMBER` | Sales team WhatsApp number |
| `HUBSPOT_API_KEY` | HubSpot private app token |
| `BREVO_API_KEY` | Brevo API key |
| `BREVO_NEWSLETTER_LIST_ID` | Brevo list ID for newsletter |

---

## Deployment

### Web (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `apps/web`
3. Add all environment variables from `.env.example`
4. Deploy on push to `main`

### API (AWS)
1. Provision EC2 instance (t3.small minimum) or ECS
2. Provision RDS PostgreSQL instance
3. Set environment variables via AWS Secrets Manager
4. Run `npm run db:migrate` on deployment
5. Start with `npm start` or use PM2

### CI/CD
GitHub Actions pipeline in `.github/workflows/ci.yml`:
- Lint → Type check → Build (both apps) → Deploy to Vercel (main branch only)

Set these GitHub secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## Key Features

| Feature | Implementation |
|---|---|
| Hero slider | Embla Carousel + autoplay |
| Vehicle filters | URL query params — shareable & SEO-friendly |
| 360° gallery | Drag-to-rotate image sequence |
| Lead capture | React Hook Form + Zod validation + honeypot |
| CRM sync | HubSpot Contacts API (fire-and-forget) |
| WhatsApp alerts | Meta Cloud API on every lead |
| Email confirmations | Brevo transactional SMTP |
| Admin auth | NextAuth.js credentials + JWT |
| Image uploads | S3 presigned URLs (direct browser upload) |
| SEO | ISR/SSG + JSON-LD + dynamic OG tags + sitemap |
| WCAG 2.1 AA | Semantic HTML, ARIA roles, keyboard navigation, focus management |

---

## Strapi CMS Setup

1. Deploy Strapi v4 to Railway, Render, or your own server
2. Create content types: `BlogPost` and `Tag` (as defined in design docs)
3. Generate a read-only API token
4. Set `STRAPI_URL` and `STRAPI_API_TOKEN` in web env

---

## License

Proprietary — All rights reserved © Eleniyan Motors Ltd
