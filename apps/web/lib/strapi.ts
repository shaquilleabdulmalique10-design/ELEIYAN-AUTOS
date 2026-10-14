import type { BlogPost, BlogTag } from '@eleniyan/types'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

async function strapiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<{ data: T; meta?: { pagination?: { total: number } } }> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 3600 }, // 1 hour ISR
    ...options,
  })
  if (!res.ok) throw new Error(`Strapi request failed: ${res.status}`)
  return res.json()
}

function mapPost(item: Record<string, unknown>): BlogPost {
  const attrs = item.attributes as Record<string, unknown>
  return {
    id: item.id as string,
    slug: attrs.slug as string,
    title: attrs.title as string,
    excerpt: attrs.excerpt as string,
    body: attrs.body as string,
    coverImage: (
      (attrs.coverImage as Record<string, unknown>)?.data as Record<string, unknown>
    )?.attributes
      ? `${STRAPI_URL}${(((attrs.coverImage as Record<string, unknown>)?.data as Record<string, unknown>)?.attributes as Record<string, unknown>)?.url}`
      : '/images/blog-placeholder.jpg',
    author: attrs.author as string,
    publishedAt: attrs.publishedAt as string,
    tags: (
      (
        (attrs.tags as Record<string, unknown>)?.data as Array<Record<string, unknown>>
      ) || []
    ).map(
      (t) =>
        ({
          id: t.id,
          name: (t.attributes as Record<string, unknown>)?.name,
          slug: (t.attributes as Record<string, unknown>)?.slug,
        }) as BlogTag
    ),
    seoTitle: attrs.seoTitle as string | undefined,
    seoDescription: attrs.seoDescription as string | undefined,
    category: attrs.category as BlogPost['category'],
  }
}

export async function getPosts(params?: {
  category?: string
  page?: number
  pageSize?: number
}): Promise<{ posts: BlogPost[]; total: number }> {
  const qs = new URLSearchParams({
    'populate[coverImage][fields][0]': 'url',
    'populate[tags][fields][0]': 'name',
    'populate[tags][fields][1]': 'slug',
    'pagination[page]': String(params?.page || 1),
    'pagination[pageSize]': String(params?.pageSize || 10),
    'sort[0]': 'publishedAt:desc',
    ...(params?.category ? { 'filters[category][$eq]': params.category } : {}),
  })

  const res = await strapiRequest<Array<Record<string, unknown>>>(`/blog-posts?${qs}`)
  return {
    posts: res.data.map(mapPost),
    total: res.meta?.pagination?.total || 0,
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const qs = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate[coverImage][fields][0]': 'url',
    'populate[tags][fields][0]': 'name',
    'populate[tags][fields][1]': 'slug',
  })

  const res = await strapiRequest<Array<Record<string, unknown>>>(`/blog-posts?${qs}`)
  if (!res.data.length) return null
  return mapPost(res.data[0])
}

export async function getRelatedPosts(tagSlugs: string[], excludeSlug: string): Promise<BlogPost[]> {
  if (!tagSlugs.length) return []
  const qs = new URLSearchParams({
    'filters[tags][slug][$in]': tagSlugs[0],
    'filters[slug][$ne]': excludeSlug,
    'pagination[pageSize]': '3',
    'populate[coverImage][fields][0]': 'url',
    'populate[tags][fields][0]': 'name',
    'populate[tags][fields][1]': 'slug',
  })
  const res = await strapiRequest<Array<Record<string, unknown>>>(`/blog-posts?${qs}`)
  return res.data.map(mapPost)
}

export async function getStrapiPosts(): Promise<BlogPost[]> {
  const { posts } = await getPosts({ pageSize: 100 })
  return posts
}
