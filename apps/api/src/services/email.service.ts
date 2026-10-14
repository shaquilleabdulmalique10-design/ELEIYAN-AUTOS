import axios from 'axios'

const BREVO_KEY      = process.env.BREVO_API_KEY || ''
const BREVO_LIST_ID  = Number(process.env.BREVO_NEWSLETTER_LIST_ID || '1')
const FROM_EMAIL     = process.env.FROM_EMAIL     || 'eleniyanautos@gmail.com'
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'eleniyanautos@gmail.com'
const WA_NUMBER      = process.env.WHATSAPP_SALES_NUMBER || '2349036942616'
const FROM_NAME      = 'Eleniyan Motors'

interface LeadRecord {
  id: string
  name: string
  email: string
  phone: string
  type: string
  vehicleTitle?: string | null
  message?: string | null
  preferredDate?: string | null
  preferredTime?: string | null
  tradeInMake?: string | null
  tradeInModel?: string | null
  tradeInYear?: number | null
  tradeInMileage?: number | null
  tradeInCondition?: string | null
}

const brevo = axios.create({
  baseURL: 'https://api.brevo.com/v3',
  headers: {
    'api-key': BREVO_KEY,
    'Content-Type': 'application/json',
  },
})

const TYPE_SUBJECT: Record<string, string> = {
  REQUEST_VIEWING:   'Your Viewing Request — Eleniyan Motors',
  TRADE_IN:          'Trade-In Valuation Request Received',
  CONTACT:           'We Received Your Message — Eleniyan Motors',
  SCHEDULE_VIEWING:  'Your Private Viewing Request — Eleniyan Motors',
  NEWSLETTER:        'Welcome to the Eleniyan Circle',
}

const TYPE_LABEL: Record<string, string> = {
  REQUEST_VIEWING:   'Request Viewing',
  TRADE_IN:          'Trade-In Valuation',
  CONTACT:           'General Contact',
  SCHEDULE_VIEWING:  'Schedule Private Viewing',
  NEWSLETTER:        'Newsletter Signup',
}

// ─── Shared HTML wrapper ──────────────────────────────────────────────────────
function emailWrapper(body: string): string {
  return `
    <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;color:#2D2D2D;background:#ffffff;">
      <!-- Header -->
      <div style="background:#0A1628;padding:28px 32px;text-align:center;">
        <h1 style="font-family:Georgia,serif;color:#C9A84C;margin:0;font-size:26px;letter-spacing:1px;">
          Eleniyan Motors
        </h1>
        <p style="color:#ffffff60;font-size:11px;margin:4px 0 0;letter-spacing:3px;text-transform:uppercase;">
          Luxury Cars Nigeria
        </p>
      </div>
      <!-- Body -->
      <div style="padding:32px;">
        ${body}
      </div>
      <!-- Footer -->
      <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
        <p style="font-size:12px;color:#9CA3AF;margin:0 0 4px;">
          Eleniyan Motors Ltd &nbsp;·&nbsp; Victoria Island, Lagos &nbsp;·&nbsp; Abuja &nbsp;·&nbsp; Port Harcourt
        </p>
        <p style="font-size:12px;color:#9CA3AF;margin:0;">
          <a href="mailto:eleniyanautos@gmail.com" style="color:#C9A84C;">eleniyanautos@gmail.com</a>
          &nbsp;·&nbsp;
          <a href="https://wa.me/${WA_NUMBER}" style="color:#C9A84C;">WhatsApp Us</a>
        </p>
      </div>
    </div>
  `
}

// ─── Send confirmation to customer ───────────────────────────────────────────
async function sendCustomerConfirmation(lead: LeadRecord): Promise<void> {
  if (!BREVO_KEY) {
    console.log('[Email] BREVO_API_KEY not set — skipping customer confirmation')
    return
  }

  const subject = TYPE_SUBJECT[lead.type] || 'Thank you — Eleniyan Motors'

  const viewingDetails = lead.preferredDate
    ? `<p style="background:#f0f9ff;border-left:3px solid #C9A84C;padding:12px 16px;border-radius:4px;margin:16px 0;">
         📅 Your preferred viewing: <strong>${lead.preferredDate}</strong>
         ${lead.preferredTime ? ` at <strong>${lead.preferredTime}</strong>` : ''}
       </p>`
    : ''

  const tradeInDetails = (lead.tradeInMake && lead.tradeInModel)
    ? `<p style="background:#f0f9ff;border-left:3px solid #C9A84C;padding:12px 16px;border-radius:4px;margin:16px 0;">
         🔄 Trade-in vehicle: <strong>${lead.tradeInYear || ''} ${lead.tradeInMake} ${lead.tradeInModel}</strong>
         ${lead.tradeInMileage ? ` · ${lead.tradeInMileage.toLocaleString()} km` : ''}
         ${lead.tradeInCondition ? ` · ${lead.tradeInCondition}` : ''}
       </p>`
    : ''

  const body = `
    <h2 style="font-family:Georgia,serif;color:#0A1628;margin-top:0;">Hello ${lead.name},</h2>
    <p>Thank you for reaching out to <strong>Eleniyan Motors</strong>. We have received your enquiry and a member of our team will contact you within <strong>24 hours</strong>.</p>

    ${lead.vehicleTitle
      ? `<p>You enquired about: <strong style="color:#0A1628;">${lead.vehicleTitle}</strong></p>`
      : ''}

    ${viewingDetails}
    ${tradeInDetails}

    ${lead.message
      ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0;">
           <p style="font-size:13px;color:#6b7280;margin:0 0 4px;">Your message:</p>
           <p style="margin:0;font-size:14px;">${lead.message}</p>
         </div>`
      : ''}

    <p>For immediate assistance, you can reach us directly:</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0;">
      <a href="https://wa.me/${WA_NUMBER}?text=Hello%2C%20I%20just%20submitted%20an%20enquiry%20on%20your%20website."
         style="background:#25D366;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:600;font-size:13px;display:inline-block;">
        💬 WhatsApp Us
      </a>
      <a href="mailto:${BUSINESS_EMAIL}"
         style="background:#0A1628;color:#C9A84C;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:600;font-size:13px;display:inline-block;">
        ✉️ Email Us
      </a>
    </div>

    <p style="font-size:13px;color:#9CA3AF;margin-top:24px;">
      This is an automated confirmation. Please do not reply to this email directly — use the buttons above to reach us.
    </p>
  `

  await brevo.post('/smtp/email', {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: lead.email, name: lead.name }],
    subject,
    htmlContent: emailWrapper(body),
  })
}

// ─── Send internal notification to business email ─────────────────────────────
async function sendInternalNotification(lead: LeadRecord): Promise<void> {
  if (!BREVO_KEY) {
    // Log to console as fallback so business doesn't miss leads in dev
    console.log(`\n📩 NEW LEAD (email service not configured)`)
    console.log(`   Type:    ${TYPE_LABEL[lead.type] || lead.type}`)
    console.log(`   Name:    ${lead.name}`)
    console.log(`   Phone:   ${lead.phone}`)
    console.log(`   Email:   ${lead.email}`)
    if (lead.vehicleTitle) console.log(`   Vehicle: ${lead.vehicleTitle}`)
    if (lead.message)      console.log(`   Message: ${lead.message}`)
    console.log('')
    return
  }

  const typeLabel = TYPE_LABEL[lead.type] || lead.type

  const body = `
    <h2 style="font-family:Georgia,serif;color:#0A1628;margin-top:0;">
      🚗 New Lead — ${typeLabel}
    </h2>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${[
        ['Name',    lead.name],
        ['Phone',   `<a href="tel:${lead.phone}" style="color:#C9A84C;">${lead.phone}</a>`],
        ['Email',   `<a href="mailto:${lead.email}" style="color:#C9A84C;">${lead.email}</a>`],
        ['Type',    typeLabel],
        ...(lead.vehicleTitle ? [['Vehicle', lead.vehicleTitle]] : []),
        ...(lead.preferredDate ? [['Preferred Date', `${lead.preferredDate}${lead.preferredTime ? ` at ${lead.preferredTime}` : ''}`]] : []),
        ...(lead.tradeInMake   ? [['Trade-In', `${lead.tradeInYear || ''} ${lead.tradeInMake} ${lead.tradeInModel || ''} · ${lead.tradeInMileage ? lead.tradeInMileage.toLocaleString() + ' km' : ''} · ${lead.tradeInCondition || ''}`]] : []),
      ].map(([label, value]) => `
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;width:120px;vertical-align:top;">${label}</td>
          <td style="padding:10px 8px;font-weight:600;color:#0A1628;">${value}</td>
        </tr>
      `).join('')}
    </table>

    ${lead.message
      ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-top:16px;">
           <p style="font-size:12px;color:#6b7280;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">Message</p>
           <p style="margin:0;font-size:14px;">${lead.message}</p>
         </div>`
      : ''}

    <div style="margin-top:20px;">
      <a href="https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20this%20is%20Eleniyan%20Motors."
         style="background:#25D366;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:600;font-size:13px;display:inline-block;margin-right:8px;">
        Reply on WhatsApp
      </a>
      <a href="mailto:${lead.email}"
         style="background:#0A1628;color:#C9A84C;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:600;font-size:13px;display:inline-block;">
        Reply by Email
      </a>
    </div>
  `

  await brevo.post('/smtp/email', {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: BUSINESS_EMAIL, name: 'Eleniyan Motors' }],
    subject: `[New Lead] ${typeLabel} — ${lead.name}`,
    htmlContent: emailWrapper(body),
  })
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const emailService = {
  async sendLeadConfirmation(lead: LeadRecord): Promise<void> {
    try {
      // Send both in parallel — customer confirmation + internal notification
      await Promise.allSettled([
        sendCustomerConfirmation(lead),
        sendInternalNotification(lead),
      ])
    } catch (err) {
      console.error('[Email] sendLeadConfirmation failed:', (err as Error).message)
    }
  },

  async subscribeToNewsletter(email: string): Promise<void> {
    if (!BREVO_KEY) {
      console.log(`[Email] Newsletter signup (no Brevo key): ${email}`)
      return
    }
    try {
      await brevo.post('/contacts', {
        email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
        attributes: { SOURCE: 'website' },
      })
    } catch (err) {
      console.error('[Brevo] Newsletter subscribe failed:', (err as Error).message)
    }
  },
}
