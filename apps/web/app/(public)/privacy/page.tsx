import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="pt-20 pb-20 bg-white">
      <div className="container-xl max-w-3xl">
        <div className="py-12">
          <h1 className="font-heading text-4xl text-navy mb-4">Privacy Policy</h1>
          <div className="gold-divider mb-8" aria-hidden="true" />
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>Eleniyan Motors Ltd (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you use our website at eleniyan.com.</p>
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly, including your name, email address, phone number, and vehicle preferences when you submit enquiry forms, schedule viewings, or sign up for our newsletter.</p>
            <h2>How We Use Your Information</h2>
            <ul>
              <li>To respond to your enquiries and schedule viewings</li>
              <li>To send you relevant vehicle listings and updates (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
            <h2>Data Sharing</h2>
            <p>We share your data with our CRM platform (HubSpot/Zoho) for lead management purposes. We do not sell your personal data to third parties.</p>
            <h2>Contact</h2>
            <p>For privacy enquiries, contact us at <a href="mailto:privacy@eleniyan.com" className="text-gold">privacy@eleniyan.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
