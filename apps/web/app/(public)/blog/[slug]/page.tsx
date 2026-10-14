import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, Clock, ArrowLeft, Twitter, Facebook, Link2 } from 'lucide-react'
import { getPostBySlug, getStrapiPosts, getRelatedPosts } from '@/lib/strapi'
import { formatDate, estimateReadTime, truncate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import ShareButton from '@/components/blog/ShareButton'

export const revalidate = 86400 // 24 hours

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const posts = await getStrapiPosts()
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug)
    if (!post) return { title: 'Post Not Found' }
    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage],
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author],
      },
    }
  } catch {
    return { title: 'Blog Post' }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  let post, relatedPosts
  try {
    post = await getPostBySlug(params.slug)
    if (!post) notFound()
    relatedPosts = await getRelatedPosts(post.tags.map((t) => t.slug), params.slug)
  } catch {
    notFound()
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'Eleniyan Motors',
      logo: { '@type': 'ImageObject', url: 'https://eleniyan.com/logo.png' },
    },
  }

  const pageUrl = `https://eleniyan.com/blog/${params.slug}`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      <div className="pt-20 bg-white">
        {/* Cover */}
        <div className="relative aspect-[21/9] max-h-[500px] bg-gray-900">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover opacity-80"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
        </div>

        <div className="container-xl">
          <div className="max-w-3xl mx-auto -mt-20 relative z-10">
            {/* Article header */}
            <div className="bg-white rounded-card shadow-card p-8 mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="gold">{tag.name}</Badge>
                ))}
              </div>

              <h1 className="font-heading text-3xl md:text-4xl text-navy mb-4 leading-tight">
                {post.title}
              </h1>

              <p className="text-gray-500 text-base leading-relaxed mb-5">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gold" aria-hidden="true" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gold" aria-hidden="true" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold" aria-hidden="true" />
                  {estimateReadTime(post.body)}
                </span>
              </div>
            </div>

            {/* Article body */}
            <article
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-img:rounded-card"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {/* Share */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-4">Share this article</p>
              <div className="flex gap-3" role="group" aria-label="Share options">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter/X"
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-gold hover:text-gold px-4 py-2 rounded-sm text-sm transition-colors"
                >
                  <Twitter className="w-4 h-4" aria-hidden="true" /> Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-gold hover:text-gold px-4 py-2 rounded-sm text-sm transition-colors"
                >
                  <Facebook className="w-4 h-4" aria-hidden="true" /> Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${pageUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-gold hover:text-gold px-4 py-2 rounded-sm text-sm transition-colors"
                >
                  📱 WhatsApp
                </a>
                <ShareButton url={pageUrl} title={post.title} />
              </div>
            </div>

            {/* Back */}
            <div className="mt-8 mb-4">
              <Link href="/blog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold transition-colors">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Blog
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="max-w-3xl mx-auto mt-16 pt-16 border-t border-gray-100" aria-labelledby="related-heading">
              <h2 id="related-heading" className="font-heading text-2xl text-navy mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <article key={rp.id} className="group">
                    <Link href={`/blog/${rp.slug}`}>
                      <div className="relative aspect-[16/9] rounded-card overflow-hidden mb-3">
                        <Image
                          src={rp.coverImage}
                          alt={rp.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="33vw"
                        />
                      </div>
                      <h3 className="font-heading text-sm text-navy group-hover:text-gold transition-colors leading-snug">
                        {truncate(rp.title, 60)}
                      </h3>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="pb-20" />
      </div>
    </>
  )
}
