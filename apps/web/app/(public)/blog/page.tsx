import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'
import { getPosts } from '@/lib/strapi'
import { formatDate, estimateReadTime, truncate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog — Import Guides, Car Tips & News',
  description:
    'Luxury car import guides, maintenance tips, and the latest Nigerian automotive news from the Eleniyan Motors team.',
}

const CATEGORIES = [
  { value: '', label: 'All Posts' },
  { value: 'import-duty-guides', label: 'Import & Duty Guides' },
  { value: 'maintenance-tips', label: 'Maintenance Tips' },
  { value: 'car-of-the-week', label: 'Car of the Week' },
]

interface PageProps {
  searchParams: { category?: string; page?: string }
}

export default async function BlogPage({ searchParams }: PageProps) {
  const category = searchParams.category || ''
  const page = Number(searchParams.page) || 1

  let posts: Awaited<ReturnType<typeof getPosts>>['posts'] = []
  let total = 0

  try {
    const result = await getPosts({ category: category || undefined, page, pageSize: 9 })
    posts = result.posts
    total = result.total
  } catch {
    // Strapi unavailable — show empty state
  }

  const totalPages = Math.ceil(total / 9)

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy py-20">
        <div className="container-xl text-center">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Insights & Guides</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Our Blog</h1>
          <div className="gold-divider mx-auto mb-6" aria-hidden="true" />
          <p className="text-white/60 text-base max-w-lg mx-auto">
            Import duty guides, maintenance tips, spotlight features, and the latest from Nigeria&apos;s luxury car world.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-xl">
          {/* Category tabs */}
          <nav className="flex flex-wrap gap-2 mb-10" aria-label="Blog categories">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value ? `/blog?category=${cat.value}` : '/blog'}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-gold text-navy'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
                }`}
                aria-current={category === cat.value ? 'page' : undefined}
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Posts grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No posts available yet.</p>
              <p className="text-gray-300 text-sm mt-2">Check back soon for luxury car guides and news.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article key={post.id} className="card group flex flex-col overflow-hidden">
                    <Link
                      href={`/blog/${post.slug}`}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="block relative overflow-hidden aspect-[16/9]"
                    >
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </Link>

                    <div className="flex flex-col flex-1 p-5">
                      {/* Category badge */}
                      <div className="mb-3">
                        <Badge variant="gold">
                          {CATEGORIES.find((c) => c.value === post.category)?.label || 'General'}
                        </Badge>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="font-heading text-base text-navy hover:text-gold transition-colors leading-snug mb-3">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                        {truncate(post.excerpt, 120)}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" aria-hidden="true" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {estimateReadTime(post.body)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-12 flex justify-center gap-2" aria-label="Blog pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?${new URLSearchParams({ ...(category ? { category } : {}), page: String(p) }).toString()}`}
                      className={`w-9 h-9 rounded-sm flex items-center justify-center text-sm font-medium transition-colors ${
                        page === p ? 'bg-gold text-navy' : 'border border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
                      }`}
                      aria-current={page === p ? 'page' : undefined}
                      aria-label={`Page ${p}`}
                    >
                      {p}
                    </Link>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
