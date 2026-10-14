import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="pt-20 pb-20 bg-white">
      <div className="container-xl max-w-3xl">
        <div className="py-12">
          <h1 className="font-heading text-4xl text-navy mb-4">Terms of Service</h1>
          <div className="gold-divider mb-8" aria-hidden="true" />
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>By accessing and using the Eleniyan Motors website, you accept and agree to be bound by these Terms of Service.</p>
            <h2>Use of Website</h2>
            <p>The content on this website is for general information and enquiry purposes. Vehicle prices, availability, and specifications are subject to change without notice.</p>
            <h2>Vehicle Listings</h2>
            <p>All vehicles are subject to prior sale. Prices displayed are in Nigerian Naira and exclude any applicable taxes, registration fees, or delivery charges unless stated.</p>
            <h2>Enquiries & Viewings</h2>
            <p>Submitting an enquiry form does not constitute a reservation or purchase of any vehicle. Our team will contact you to confirm availability.</p>
            <h2>Limitation of Liability</h2>
            <p>Eleniyan Motors Ltd shall not be liable for any indirect or consequential loss arising from the use of information on this website.</p>
            <h2>Contact</h2>
            <p>For enquiries regarding these terms, contact <a href="mailto:legal@eleniyan.com" className="text-gold">legal@eleniyan.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
