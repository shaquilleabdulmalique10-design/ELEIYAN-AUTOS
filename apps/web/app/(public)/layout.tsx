import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFAB from '@/components/layout/WhatsAppFAB'
import WishlistDrawer from '@/components/wishlist/WishlistDrawer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WhatsAppFAB />
      <WishlistDrawer />
    </>
  )
}
