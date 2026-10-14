import type { MetadataRoute } from 'next'
import { getVehicles } from '@/lib/api'
import { getStrapiPosts } from '@/lib/strapi'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eleniyan.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/inventory`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  let vehiclePages: MetadataRoute.Sitemap = []
  try {
    const result = await getVehicles({ limit: 500 })
    vehiclePages = result.data.map((v) => ({
      url: `${BASE_URL}/inventory/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch { /* API not available during build */ }

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await getStrapiPosts()
    blogPages = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch { /* Strapi not available during build */ }

  return [...staticPages, ...vehiclePages, ...blogPages]
}
