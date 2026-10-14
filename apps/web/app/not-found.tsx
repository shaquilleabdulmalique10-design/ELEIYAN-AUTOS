import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center text-center px-4">
      <div>
        <p className="font-heading text-9xl text-gold opacity-30 mb-4" aria-hidden="true">404</p>
        <h1 className="font-heading text-3xl text-white mb-4">Page Not Found</h1>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">Back to Home</Link>
          <Link href="/inventory" className="btn-secondary">Browse Inventory</Link>
        </div>
      </div>
    </div>
  )
}
