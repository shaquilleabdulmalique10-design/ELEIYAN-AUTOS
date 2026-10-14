# Requirements: Luxury Car Dealership Platform

## Overview

A full-stack luxury car dealership web platform targeting the Nigerian market. The platform enables buyers to browse, filter, and inquire about premium vehicles (Rolls-Royce, Bentley, Range Rover, Maybach and similar), while giving the dealership a custom admin dashboard to manage inventory, leads, blog content, and analytics.

---

## Functional Requirements

### 1. Homepage

- MUST display a full-width hero section with an autoplay video/image slider featuring luxury car visuals (Rolls-Royce, Bentley, Range Rover, Maybach)
- MUST include a quick-filter bar with fields: Make, Model, Price Range (₦), Year, Location (Lagos / Abuja / Port Harcourt)
- MUST display a "Featured Listings" section showing curated vehicles
- MUST display trust badges: Verified Sellers, Inspection Reports, Warranty
- MUST be responsive across mobile, tablet, and desktop

### 2. Inventory

- MUST provide an advanced filter panel with: price range (₦), mileage, fuel type, transmission, body type, make, model, year, location
- MUST support grid view and list view toggle for search results
- MUST display paginated vehicle listing cards with key specs and price
- MUST provide individual vehicle detail pages containing:
  - 360° image gallery
  - Video walkaround embed
  - Full specification table
  - Downloadable inspection report PDF
  - "Request Viewing" CTA
  - "Trade-In Valuation" CTA
- MUST submit both CTAs to the configured CRM (HubSpot or Zoho) in real time
- MUST trigger a WhatsApp Business API notification to the sales team on each CTA submission
- MUST support URL-shareable filter state (query parameters)

### 3. Services Page

- MUST describe vehicle sourcing from UK, US, and Japan imports
- MUST describe the trade-in appraisal process
- MUST display financing and insurance partner referral links (no in-platform application forms)
- MUST describe delivery & registration assistance
- MUST describe after-sales care offerings

### 4. About Page

- MUST include a brand story section
- MUST include team member profiles (photo, name, role, bio)
- MUST display certifications and accreditations

### 5. Testimonials Page

- MUST display video testimonials (embedded or hosted)
- MUST display text-based customer reviews
- MUST include trade-in case studies with before/after details

### 6. Contact Page

- MUST display addresses and maps for Lagos, Abuja, and Port Harcourt offices using Google Maps embeds
- MUST include a prominent WhatsApp Business button as the primary contact method
- MUST include a "Schedule Private Viewing" form (name, phone, email, preferred vehicle, preferred date/time)
- MUST include a newsletter signup form integrated with Brevo
- Form submissions MUST be sent to the CRM and trigger a WhatsApp notification

### 7. Blog

- MUST support article categories: Import/Duty Guides, Maintenance Tips, Car of the Week
- MUST support rich-text content, cover images, and metadata (author, date, tags, SEO fields)
- MUST be powered by Strapi CMS (headless)
- MUST support social sharing on individual posts
- MUST include related posts section

### 8. Admin Dashboard (Custom, Next.js)

- MUST be accessible only to authenticated admin users (JWT-based auth)
- MUST provide Inventory CRUD: create, read, update, delete vehicle listings including all media uploads
- MUST provide a Lead Management view: list of all CRM leads with status, source, and timestamps
- MUST provide a Blog CMS view: create, edit, publish, unpublish blog posts via Strapi API
- MUST display an Analytics dashboard surfacing: page views, top listings, lead conversion rate (via GA4 data)
- MUST support role-based access (admin vs. editor roles)

---

## Non-Functional Requirements

### Performance
- MUST achieve a PageSpeed Insights score of 90+ on both mobile and desktop
- Images MUST be served in modern formats (WebP/AVIF) with lazy loading
- MUST implement Next.js static generation (SSG) or incremental static regeneration (ISR) for public-facing pages

### SEO
- MUST include structured data (JSON-LD) for vehicle listings (schema.org/Car)
- MUST generate dynamic Open Graph and Twitter Card meta tags per page
- MUST produce an auto-generated XML sitemap
- MUST target top-3 Google ranking for "luxury cars for sale Nigeria" and related long-tail keywords

### Accessibility
- MUST comply with WCAG 2.1 Level AA
- All interactive elements MUST be keyboard navigable
- All images MUST have descriptive alt text
- Color contrast ratios MUST meet AA thresholds (4.5:1 for normal text, 3:1 for large text)

### Security
- All form submissions MUST be protected by rate limiting and spam detection (e.g., honeypot or reCAPTCHA)
- Admin dashboard MUST enforce authentication on all routes
- Environment variables MUST store all API keys and secrets (never committed to source control)
- HTTPS MUST be enforced across all environments

### Internationalisation
- Currency display MUST default to Nigerian Naira (₦)
- Dates and phone numbers MUST follow Nigerian conventions

---

## Design Requirements

- Color palette: Deep navy (#0A1628), Gold (#C9A84C), Charcoal (#2D2D2D), White (#FFFFFF)
- Typography: Playfair Display for headings; Inter for body text
- Imagery: High-resolution vehicle photography; no stock car placeholders in production
- Tone: Premium, aspirational, trustworthy

---

## Integrations

| Integration | Purpose |
|---|---|
| WhatsApp Business API | Primary contact; CTA notifications to sales team |
| Google Maps Embed API | Office location maps on Contact page |
| HubSpot or Zoho CRM | Lead capture from all CTAs and contact forms |
| Brevo (Sendinblue) | Newsletter signup and transactional emails |
| Paystack | Payment processing (deposits, booking fees) |
| Google Analytics 4 | Site analytics and conversion tracking |
| Strapi CMS | Headless CMS for blog and inventory content |

---

## Success Metrics

- PageSpeed Insights score ≥ 90 (mobile and desktop)
- Lead response time < 24 hours (operational KPI)
- Top-3 Google ranking for "luxury cars for sale Nigeria"
- Newsletter signup conversion rate tracked via GA4
