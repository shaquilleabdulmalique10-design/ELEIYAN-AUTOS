import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function AdminBlogPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl text-navy">Blog</h1>
        <p className="text-sm text-gray-400">Coming soon</p>
      </div>

      <div className="bg-white rounded-card shadow-card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-gold" />
        </div>
        <h2 className="font-heading text-xl text-navy mb-2">Blog Coming Soon</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
          The blog feature will be available in a future update.
          For now, manage your inventory and leads below.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/admin/dashboard/inventory" className="btn-primary text-sm">
            Go to Inventory
          </Link>
          <Link href="/admin/dashboard/leads" className="btn-secondary text-sm">
            View Leads
          </Link>
        </div>
      </div>
    </div>
  )
}
