import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'
import { getBlogPosts } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export const revalidate = 300 // 5 minutes

export const metadata: Metadata = {
  title: 'Blog | Eleniyan Motors',
  description: 'Car news, maintenance tips, buying guides and more from Eleniyan Motors, Ijebu-Ode.',
}

const CATEGORIES = [
  { value: '', label: 'All Posts' },
  { value: 'CAR_NEWS', label: 'Car News' },
  { value: 'MAINTENANCE_TIPS', label: 'Maintenance Tips' },
  { value: 'CAR_OF_THE_WEEK', label: 'Car of the Week' },
  { value: 'BUYING_GUIDE', label: 'Buying Guide' },
]

interface PageProps {
  searchParams: { category?: string; page?: string }
}

export default async function BlogPage({ searchParams }: PageProps) {
  const category = searchParams.category || ''
  const page = Number(searchParams.page) || 1

  let result: { data: BlogPost[]; total: number; page: number; totalPages: number } = { data: [], total: 0, page: 1, totalPages: 0 }
  try {
    const params: Record<string, string> = { page: String(page), limit: '9' }
    if (category) params.category = category
    result = await getBlogPosts(params)
  } catch {
    // API down — show empty state
  }

  const { data: posts, total, totalPages } = result

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-navy py-10 sm:py-16">
        <div className="container-xl text-center">
          <p className="text-gold text-xs sm:text-sm uppercase tracking-[0.3em] mb-2">Eleniyan Blog</p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-3">
            News & Guides
          </h1>
          <div className="gold-divider mx-auto mb-4" aria-hidden="true" />
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Car tips, buying guides, and the latest from the world of automobiles.
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-16 sm:top-20 z-30">
        <div className="container-xl overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {CATEGORIES.map(({ value, label }) => (
              <Link
                key={value}
                href={value ? `/blog?category=${value}` : '/blog'}
                className={`px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  category === value
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-navy'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-xl py-8 sm:py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-navy mb-2">No posts yet</p>
            <p className="text-gray-400 text-sm">Check back soon for articles and guides.</p>
          </div>
        ) : (
          <>
            {/* Posts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
              {posts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Cover image */}
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={i < 3}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy/80 to-navy flex items-center justify-center">
                        <span className="font-heading text-gold text-4xl">E</span>
                      </div>
                    )}
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-gold text-navy text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h2 className="font-heading text-base sm:text-lg text-navy leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      <span className="text-gold font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/blog?${category ? `category=${category}&` : ''}page=${page - 1}`}
                    className="px-4 py-2 text-sm border border-gray-200 rounded hover:border-gold hover:text-gold transition-colors"
                  >
                    Previous
                  </Link>
                )}
                <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link
                    href={`/blog?${category ? `category=${category}&` : ''}page=${page + 1}`}
                    className="px-4 py-2 text-sm border border-gray-200 rounded hover:border-gold hover:text-gold transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
