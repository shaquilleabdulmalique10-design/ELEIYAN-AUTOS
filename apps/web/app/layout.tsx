import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import AuthSessionProvider from '@/components/providers/SessionProvider'
import { WishlistProvider } from '@/lib/WishlistContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eleniyan.com'),
  title: {
    default: 'Eleniyan Motors | Luxury Cars for Sale in Nigeria',
    template: '%s | Eleniyan Motors',
  },
  description:
    'Nigeria\'s premier luxury car dealership. Browse Rolls-Royce, Bentley, Range Rover, Maybach and more. Verified sellers, inspection reports, financing available.',
  keywords: [
    'luxury cars Nigeria',
    'luxury cars for sale Nigeria',
    'Rolls-Royce Nigeria',
    'Bentley Nigeria',
    'Range Rover Nigeria',
    'Maybach Nigeria',
    'buy luxury car Lagos',
    'premium cars Abuja',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Eleniyan Motors',
    images: ['/images/og-default.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EleniyanMotors',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body">
        <AuthSessionProvider>
          <WishlistProvider>
            <GoogleAnalytics />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0A1628',
                  color: '#fff',
                  border: '1px solid #C9A84C',
                },
              }}
            />
          </WishlistProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
