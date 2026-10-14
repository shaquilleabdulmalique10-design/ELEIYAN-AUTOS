# Tasks: Luxury Car Dealership Platform

## Task Overview

Implementation is broken into 10 phases, ordered by dependency. Each task maps to one or more requirements from `requirements.md` and follows the architecture in `design.md`.

---

- [ ] 1. Project Scaffolding & Design System
- [ ] 2. Backend API & Database
- [ ] 3. Strapi CMS Setup
- [ ] 4. Homepage
- [ ] 5. Inventory — Listing & Filters
- [ ] 6. Inventory — Vehicle Detail Page
- [ ] 7. Lead Capture & Integrations
- [ ] 8. Static Pages (Services, About, Testimonials, Contact, Blog)
- [ ] 9. Admin Dashboard
- [ ] 10. SEO, Performance & Launch Hardening

---

## Task 1: Project Scaffolding & Design System

### 1.1 Initialize monorepo
- Create monorepo with `apps/web` (Next.js 14, App Router, TypeScript) and `apps/api` (Node.js + Express + TypeScript)
- Add `packages/types` for shared TypeScript interfaces
- Configure root `package.json` with workspaces, ESLint, Prettier, and Husky pre-commit hooks

### 1.2 Configure Tailwind & design tokens
- Install and configure Tailwind CSS in `apps/web`
- Add CSS custom properties for navy/gold/charcoal palette in `globals.css`
- Configure `tailwind.config.ts` to extend theme with brand colors, `fontFamily` (Playfair Display, Inter), border radius, and box shadow tokens
- Load fonts via `next/font/google` for Playfair Display and Inter

### 1.3 Build base UI component library
- Create reusable components in `apps/web/components/ui/`:
  - `Button` (variants: primary/gold, secondary/outline, ghost; sizes: sm/md/lg)
  - `Badge` (location, condition, import source)
  - `Card` (vehicle card shell)
  - `Modal` (accessible dialog with focus trap)
  - `Input`, `Select`, `Textarea`, `RangeSlider` (form primitives)
  - `Spinner` / `Skeleton` loaders
- All components must meet WCAG 2.1 AA contrast and keyboard navigation requirements

### 1.4 Build layout components
- `Header`: logo, nav links (Home, Inventory, Services, About, Blog, Contact), WhatsApp icon button, mobile hamburger menu
- `Footer`: logo, nav links, social icons, office addresses summary, newsletter signup input
- `(public)/layout.tsx`: wraps all public pages with Header + Footer

_Requirement refs: Design, Non-Functional (Accessibility)_

---

## Task 2: Backend API & Database

### 2.1 Database schema
- Set up PostgreSQL database (local Docker for dev, AWS RDS for production)
- Write Prisma schema with models: `Vehicle`, `Lead`, `User` and all enums as defined in `design.md`
- Run initial migration

### 2.2 Vehicle endpoints
- `GET /api/vehicles` — list with query param filters (make, model, year, minPrice, maxPrice, mileage, fuelType, transmission, bodyType, location, isFeatured) + pagination (page, limit, sort)
- `GET /api/vehicles/:slug` — single vehicle detail
- `POST /api/vehicles` — create vehicle (admin, auth middleware)
- `PUT /api/vehicles/:id` — update vehicle (admin)
- `DELETE /api/vehicles/:id` — soft delete (set `isAvailable = false`) (admin)

### 2.3 Lead endpoints
- `POST /api/leads` — create lead; validates body; saves to DB; triggers async CRM + WhatsApp notification
- `GET /api/leads` — paginated list with filters (admin)
- `PATCH /api/leads/:id` — update lead status (admin)

### 2.4 Auth endpoints
- `POST /api/auth/login` — email/password login; returns JWT
- `POST /api/auth/logout`
- `GET /api/auth/me` — returns current user from JWT

### 2.5 Media upload endpoint
- `POST /api/uploads/image` — generates S3 presigned PUT URL for direct browser-to-S3 upload; returns URL

### 2.6 Newsletter endpoint
- `POST /api/newsletters` — validates email; subscribes to Brevo list; deduplicates

### 2.7 Security middleware
- Add `helmet`, `cors` (allowlist Vercel domain), `express-rate-limit` (10 req/min on POST routes)
- Add auth middleware (`verifyJWT`) used on all admin routes

_Requirement refs: 2 (Inventory), 6 (Contact), 8 (Admin Dashboard), Security_

---

## Task 3: Strapi CMS Setup

### 3.1 Initialize Strapi
- Scaffold Strapi v4 project targeting the same PostgreSQL instance (separate schema/prefix)
- Configure for headless use only (disable Strapi admin UI for public access)

### 3.2 Content types
- `BlogPost`: title, slug (unique), excerpt, body (rich text), coverImage (media), author, publishedAt, tags (relation), seoTitle, seoDescription
- `Tag`: name, slug

### 3.3 API tokens & Next.js integration
- Generate Strapi read-only API token
- Create `apps/web/lib/strapi.ts` client with typed fetch helpers: `getPostBySlug`, `getPosts`, `getFeaturedPost`
- Validate that blog pages consume Strapi data correctly

_Requirement refs: 7 (Blog), 8 (Admin Dashboard — Blog CMS)_

---

## Task 4: Homepage

### 4.1 Hero slider
- Build `HeroSlider` component using Embla Carousel
- Accepts array of slides: `{ type: 'video' | 'image', src, headline, subheadline, cta }`
- Autoplay every 6 seconds; pause on hover; accessible prev/next controls; dots indicator
- Overlay: headline (Playfair Display), subheadline (Inter), gold "Browse Inventory" CTA button

### 4.2 Quick Filter Bar
- `QuickFilterBar` component below hero
- Controlled dropdowns: Make, Model (dynamic, filtered by Make), Year, Location
- Price range dual-handle slider (₦ formatted with `Intl.NumberFormat`)
- "Search" button navigates to `/inventory` with filter state serialized as URL query params

### 4.3 Featured Listings section
- Fetches vehicles where `isFeatured = true` from API (ISR, 1-hour revalidation)
- Renders `VehicleCard` grid (3-col desktop, 2-col tablet, 1-col mobile)
- "View All Inventory" link

### 4.4 Trust Badges row
- Three badges with icon + title + short description: Verified Sellers, Inspection Reports, Warranty Backed
- Subtle gold accent border

### 4.5 Homepage metadata & structured data
- `<title>` and Open Graph tags
- `schema.org/AutoDealer` JSON-LD block

_Requirement refs: 1 (Homepage), SEO_

---

## Task 5: Inventory — Listing & Filters

### 5.1 Filter panel component
- `FilterPanel` component: price range (₦), mileage range, make (multi-select), model (dynamic), year range, fuel type (checkboxes), transmission (radio), body type (checkboxes), location (checkboxes)
- Sidebar layout on desktop (≥1024px); bottom-sheet drawer on mobile
- "Apply Filters" serializes state to URL query params; "Reset All" clears filters

### 5.2 Inventory listing page
- Server component fetches vehicles from API based on URL query params (supports SSR for SEO)
- Grid/list view toggle; preference persisted in `localStorage`
- Sort controls: Price Low→High, Price High→Low, Newest, Year
- Pagination component (12 per page)
- "No results" empty state with suggestion to reset filters

### 5.3 VehicleCard component
- Image (next/image, lazy), title, year | mileage | fuel | transmission strip, price (₦, formatted), location badge, condition badge
- "View Details" links to `/inventory/[slug]`
- List view variant: horizontal layout with more spec detail visible

### 5.4 Inventory page SEO
- Dynamic `<title>` and description based on active filters
- Canonical URL handling for paginated pages

_Requirement refs: 2 (Inventory — listing)_

---

## Task 6: Inventory — Vehicle Detail Page

### 6.1 Media gallery
- `VehicleGallery` component with tab switcher: Photos | 360° View | Video
- Photos tab: Embla Carousel with thumbnail strip; keyboard navigable; fullscreen lightbox
- 360° tab: renders ordered image sequence; drag/touch to rotate (CSS transform or Three.js minimal)
- Video tab: `<video>` element or YouTube/Vimeo embed for walkaround video

### 6.2 Spec table & details
- Full specification table: two-column key/value layout
- Specs: Make, Model, Year, Mileage, Fuel Type, Transmission, Body Type, Color, Condition, Import Source, Location
- Features list: comma-separated chips

### 6.3 Inspection PDF download
- Download button for S3-hosted inspection PDF
- Opens in new tab with correct `Content-Disposition` header from CloudFront

### 6.4 CTA sidebar
- Sticky sidebar on desktop (lg:sticky lg:top-24)
- "Request Viewing" button → opens `RequestViewingModal`
- "Trade-In Valuation" button → opens `TradeInModal`
- WhatsApp direct-link button: `https://wa.me/{number}?text=I'm interested in [vehicle title]`
- Price display (₦ formatted, large)

### 6.5 Vehicle detail SEO
- Dynamic OG tags with vehicle image
- `schema.org/Car` JSON-LD with all available spec fields
- `schema.org/Offer` nested with price and availability

_Requirement refs: 2 (Inventory — detail)_

---

## Task 7: Lead Capture & Integrations

### 7.1 Request Viewing form
- `RequestViewingModal`: name (required), email (required), phone (required), preferred date (date picker), preferred time (dropdown), message (optional)
- Honeypot field for spam protection
- On submit: `POST /api/leads` with `type: REQUEST_VIEWING` + `vehicleId`
- Show success toast on completion; close modal

### 7.2 Trade-In Valuation form
- `TradeInModal`: current vehicle make/model/year/mileage/condition (all required), contact name, email, phone
- On submit: `POST /api/leads` with `type: TRADE_IN`

### 7.3 Schedule Private Viewing form (Contact page)
- Same fields as Request Viewing but standalone page section (not modal)
- `POST /api/leads` with `type: SCHEDULE_VIEWING`

### 7.4 CRM integration service
- `apps/api/src/services/crm.service.ts`
- `createOrUpdateContact(lead)` — POST to HubSpot Contacts API (or Zoho CRM API)
- Maps lead fields to CRM contact properties
- Stores returned CRM contact ID back to lead record
- Graceful error handling: CRM failure must NOT block lead save to DB

### 7.5 WhatsApp Business API notification
- `apps/api/src/services/whatsapp.service.ts`
- On lead creation: send WhatsApp message to configured sales team number
- Message template: "🚗 New Lead — [Type]\nName: [name]\nPhone: [phone]\nVehicle: [vehicle title or 'General']\nMessage: [message snippet]"
- Uses WhatsApp Business Cloud API (Meta) with pre-approved message template

### 7.6 Brevo email service
- `apps/api/src/services/email.service.ts`
- `sendLeadConfirmation(lead)` — transactional email to user confirming receipt
- `subscribeToNewsletter(email)` — adds contact to Brevo newsletter list

### 7.7 Newsletter signup
- `NewsletterForm` component used in Footer and Contact page
- Email input + "Subscribe" button
- `POST /api/newsletters`; show success/error inline

_Requirement refs: 2 (CTAs), 6 (Contact forms), Integrations_

---

## Task 8: Static Pages

### 8.1 Services page
- Section layout: hero banner, then card grid for each service: Sourcing, Trade-In Appraisal, Financing & Insurance, Delivery & Registration, After-Sales Care
- Financing section: partner logos + external referral link buttons (open in new tab, `rel="noopener noreferrer"`)

### 8.2 About page
- Brand story section (rich text + hero image)
- Team grid: photo, name, role, short bio (data sourced from Strapi or static JSON)
- Certifications/accreditations strip with logos

### 8.3 Testimonials page
- Video testimonials: responsive video embeds in card layout
- Text reviews: star rating + quote + customer name + vehicle purchased
- Trade-in case studies: before/after cards (old vehicle → new vehicle, savings highlight)

### 8.4 Contact page
- Three office cards (Lagos, Abuja, PH) each with: address, phone, email, Google Maps embed (`<iframe>`)
- Prominent WhatsApp floating button and inline button: `https://wa.me/{number}`
- Schedule Private Viewing form (Task 7.3)
- Newsletter signup (Task 7.7)

### 8.5 Blog listing page
- Fetches from Strapi via ISR (1-hour revalidation)
- Category filter tabs: All | Import/Duty Guides | Maintenance Tips | Car of the Week
- Article cards: cover image, title, excerpt, author, date, read-time estimate

### 8.6 Blog detail page
- SSG with `generateStaticParams` from Strapi slugs
- Rich-text body rendered via `@tailwindcss/typography` prose styles
- Author bio block, published date, tags
- Social share buttons (Twitter/X, WhatsApp, Facebook, Copy Link)
- Related posts section (same tag, max 3)
- SEO: OG image from cover image, `schema.org/BlogPosting` JSON-LD

_Requirement refs: 3 (Services), 4 (About), 5 (Testimonials), 6 (Contact), 7 (Blog)_

---

## Task 9: Admin Dashboard

### 9.1 Admin authentication
- Configure NextAuth.js with credentials provider
- `(admin)/layout.tsx`: `withAuth` middleware redirects unauthenticated users to `/admin/login`
- Login page: email + password form; JWT session stored as HTTP-only cookie
- Role-based route protection: EDITOR cannot access delete actions

### 9.2 Inventory manager
- Data table: searchable, sortable columns (title, price, location, status, created date)
- "Add Vehicle" button → full-page form with:
  - All vehicle fields
  - Drag-and-drop image upload (direct to S3 via presigned URL, preview grid)
  - Video URL field
  - 360° images upload
  - Inspection PDF upload
- "Edit" row action → prefilled form
- "Toggle Available" / "Delete" row actions with confirmation dialog

### 9.3 Leads management
- Data table: lead type, name, phone, vehicle, status, date, CRM link
- Filter by: status, type, date range, location
- Click row → lead detail panel (slide-over): all fields, status dropdown, notes field, "Open in CRM" external link

### 9.4 Blog CMS view
- Lists Strapi blog posts with title, status (published/draft), date
- "Publish / Unpublish" toggle calls Strapi API
- "New Post" and "Edit" buttons deep-link to Strapi admin UI (opens in new tab)

### 9.5 Analytics dashboard
- Key metrics cards: Total Users (30d), Top Vehicle Pages, Leads This Month, Lead Conversion Rate
- Data sourced from GA4 Data API via server-side fetch
- "Top 5 Inventory Pages" table with page views
- Leads by source bar chart (Recharts or Victory)

_Requirement refs: 8 (Admin Dashboard)_

---

## Task 10: SEO, Performance & Launch Hardening

### 10.1 Sitemap & robots.txt
- Install `next-sitemap`; configure to include all static pages, all vehicle slugs, all blog slugs
- `robots.txt` disallows `/admin` and `/api`

### 10.2 Core Web Vitals optimisation
- Audit with Lighthouse; target LCP < 2.5s, CLS < 0.1, FID < 100ms
- Ensure all above-fold images have `priority` prop
- Defer non-critical third-party scripts (GA4, Google Maps) via `next/script strategy="lazyOnload"`
- Add `<link rel="preconnect">` for Google Fonts, AWS CloudFront, and WhatsApp CDN domains

### 10.3 Structured data audit
- Verify `schema.org/AutoDealer` on homepage
- Verify `schema.org/Car` + `schema.org/Offer` on all vehicle detail pages
- Verify `schema.org/BlogPosting` on all blog posts
- Use Google Rich Results Test to validate

### 10.4 Accessibility audit
- Run automated axe-core scan across all pages; fix all critical and serious violations
- Manual keyboard navigation test for: nav, filters, forms, modals, gallery
- Verify all form inputs have associated `<label>` elements
- Verify ARIA roles on custom interactive components (slider, modal, dropdown)

### 10.5 Environment configuration & secrets
- Document all required environment variables in `.env.example`
- Configure Vercel environment variables for production
- Configure AWS Secrets Manager for API server secrets
- Ensure no secrets are present in repository

### 10.6 Error monitoring
- Integrate Sentry in both Next.js (`@sentry/nextjs`) and Node.js API (`@sentry/node`)
- Configure source maps upload to Sentry in CI
- Set up Sentry alert for error rate > 1%

### 10.7 CI/CD pipeline
- GitHub Actions workflow: lint → type-check → build → (deploy to Vercel on merge to `main`)
- Run `prisma migrate deploy` as part of API deployment
- Add Lighthouse CI step with budget assertions (Performance ≥ 90)

### 10.8 Final QA checklist
- [ ] All forms submit correctly and CRM/WhatsApp notifications fire
- [ ] Inventory filters update URL and results correctly
- [ ] Vehicle detail gallery (photos, 360°, video) works on mobile and desktop
- [ ] PDF download works from CloudFront
- [ ] Admin CRUD for vehicles works end-to-end
- [ ] Newsletter subscription adds contact to Brevo
- [ ] PageSpeed ≥ 90 confirmed on production URL
- [ ] All three office maps render correctly
- [ ] WhatsApp button links to correct number

_Requirement refs: SEO, Performance, Accessibility, Security_
