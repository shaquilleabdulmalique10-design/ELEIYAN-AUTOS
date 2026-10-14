import Link from 'next/link'
import { ExternalLink, BookOpen, PlusCircle } from 'lucide-react'

export default function AdminBlogPage() {
  const STRAPI_URL = process.env.STRAPI_URL?.replace('/api', '') || 'http://localhost:1337'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-navy">Blog</h1>
        <p className="text-sm text-gray-400">Blog content is managed through Strapi CMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Open Strapi */}
        <a
          href={`${STRAPI_URL}/admin`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-card shadow-card p-6 flex items-start gap-4 hover:shadow-card-hover transition-shadow group"
        >
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
            <ExternalLink className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="font-heading text-base text-navy">Open Strapi Admin</p>
            <p className="text-sm text-gray-500 mt-1">
              Create, edit, and publish blog posts, categories, and tags directly in the Strapi CMS.
            </p>
            <p className="text-xs text-gold mt-2 font-medium">{STRAPI_URL}/admin →</p>
          </div>
        </a>

        {/* View Blog */}
        <Link
          href="/blog"
          target="_blank"
          className="bg-white rounded-card shadow-card p-6 flex items-start gap-4 hover:shadow-card-hover transition-shadow group"
        >
          <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center shrink-0 group-hover:bg-navy/20 transition-colors">
            <BookOpen className="w-5 h-5 text-navy" />
          </div>
          <div>
            <p className="font-heading text-base text-navy">View Live Blog</p>
            <p className="text-sm text-gray-500 mt-1">
              Preview published posts as they appear on the public website.
            </p>
            <p className="text-xs text-navy mt-2 font-medium">eleniyan.com/blog →</p>
          </div>
        </Link>
      </div>

      {/* Quick guide */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-heading text-base text-navy mb-4 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-gold" />
          How to Create a Blog Post
        </h2>
        <ol className="space-y-3 text-sm text-gray-600">
          {[
            'Open the Strapi Admin link above and log in.',
            'Navigate to Content Manager → Blog Posts.',
            'Click "Create new entry" and fill in the title, slug, excerpt, body, and cover image.',
            'Assign a category (import-duty-guides, maintenance-tips, or car-of-the-week) and tags.',
            'Fill in SEO Title and SEO Description for better search rankings.',
            'Click "Publish" — the post will appear on the site within 1 hour (ISR cache).',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
