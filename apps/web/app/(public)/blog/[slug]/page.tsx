import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag, ChevronRight, ArrowLeft, MessageCircle } from 'lucide-react'
import { getBlogPost, getBlogPosts } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { getWhatsAppLink } from '@/lib/utils'

export const revalidate = 300

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const result = await getBlogPosts({ limit: '100' })
    return result.data.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug)
    return {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : [],
        type: 'article',
      },
    }
  } catch {
    return { title: 'Blog Post | Eleniyan Motors' }
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  CAR_NEWS: 'Car News',
  MAINTENANCE_TIPS: 'Maintenance Tips',
  CAR_OF_THE_WEEK: 'Car of the Week',
  BUYING_GUIDE: 'Buying Guide',
}

// Simple markdown to HTML converter (no external dependency needed)
function markdownToHtml(md: string): string {
  return md
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="font-heading text-xl text-navy mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-heading text-2xl text-navy mt-8 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-heading text-3xl text-navy mt-8 mb-4">$1</h1>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-gold hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="space-y-1 my-4">$&</ul>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-gray-200 my-6" />')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-600 leading-relaxed">')
    // Wrap everything in a paragraph
    .replace(/^/, '<p class="mb-4 text-gray-600 leading-relaxed">')
    .replace(/$/, '</p>')
    // Clean up empty paragraphs
    .replace(/<p[^>]*>\s*<\/p>/g, '')
    .replace(/<p[^>]*>(<h[1-3])/g, '$1')
    .replace(/(<\/h[1-3]>)<\/p>/g, '$1')
    .replace(/<p[^>]*>(<ul|<hr)/g, '$1')
    .replace(/(<\/ul>|<\/hr>)<\/p>/g, '$1')
}

export default async function BlogPostPage({ params }: PageProps) {
  let post
  try {
    post = await getBlogPost(params.slug)
  } catch {
    notFound()
  }

  if (!post.published) notFound()

  const htmlBody = markdownToHtml(post.body)
  const waMessage = `Hello Eleniyan Motors! I read your blog post "${post.title}" and would like to enquire about a vehicle.`

  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'Eleniyan Motors' },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.createdAt,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />

      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-xl py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
                <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                <li><ChevronRight className="w-3 h-3" /></li>
                <li><Link href="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
                <li><ChevronRight className="w-3 h-3" /></li>
                <li className="text-charcoal font-medium truncate max-w-[200px]">{post.title}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container-xl py-8 sm:py-12">
          <div className="max-w-3xl mx-auto">

            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Article */}
            <article className="bg-white rounded-card shadow-card overflow-hidden">
              {/* Cover image */}
              {post.coverImage && (
                <div className="relative aspect-[16/8] bg-gray-100">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                  />
                </div>
              )}

              <div className="p-5 sm:p-8">
                {/* Category + tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-gold text-navy text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  {post.tags?.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-500 text-[10px] px-2.5 py-1 rounded-full">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-navy leading-snug mb-4">
                  {post.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100 mb-6">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 font-medium border-l-4 border-gold pl-4 italic">
                  {post.excerpt}
                </p>

                {/* Body */}
                <div
                  className="prose prose-sm sm:prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: htmlBody }}
                />
              </div>
            </article>

            {/* CTA */}
            <div className="mt-8 bg-navy rounded-card p-6 sm:p-8 text-center">
              <p className="font-heading text-xl sm:text-2xl text-white mb-2">
                Ready to find your next car?
              </p>
              <p className="text-white/60 text-sm mb-5">
                Visit our showroom at Molipa Express, Ijebu-Ode or chat with us on WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/inventory" className="btn-primary text-sm w-full sm:w-auto justify-center">
                  Browse Inventory
                </Link>
                <a
                  href={getWhatsAppLink(WHATSAPP_NUMBER, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-3 px-6 rounded-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
