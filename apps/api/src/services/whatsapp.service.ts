import axios from 'axios'

interface LeadRecord {
  id: string
  name: string
  phone: string
  email: string
  type: string
  vehicleTitle?: string | null
  message?: string | null
  preferredDate?: string | null
  preferredTime?: string | null
}

const WA_TOKEN = process.env.WHATSAPP_TOKEN || ''
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
const WA_SALES_NUMBER = process.env.WHATSAPP_SALES_NUMBER || '' // e.g. "2348012345678"
const WA_TEMPLATE = process.env.WHATSAPP_TEMPLATE_NAME || 'new_lead_notification'

const TYPE_LABELS: Record<string, string> = {
  REQUEST_VIEWING: 'Request Viewing',
  TRADE_IN: 'Trade-In Valuation',
  CONTACT: 'General Contact',
  NEWSLETTER: 'Newsletter Signup',
  SCHEDULE_VIEWING: 'Schedule Private Viewing',
}

export const whatsappService = {
  async sendLeadNotification(lead: LeadRecord): Promise<void> {
    if (!WA_TOKEN || !WA_PHONE_ID || !WA_SALES_NUMBER) {
      console.warn('[WhatsApp] Missing credentials — skipping notification')
      return
    }

    const typeLabel = TYPE_LABELS[lead.type] || lead.type
    const vehicle = lead.vehicleTitle || 'General Enquiry'
    const msgSnippet = lead.message ? lead.message.slice(0, 100) : ''
    const schedule = lead.preferredDate
      ? ` | Preferred: ${lead.preferredDate} ${lead.preferredTime || ''}`
      : ''

    // Compose plain-text fallback message body
    const body =
      `🚗 *New Lead — ${typeLabel}*\n` +
      `Name: ${lead.name}\n` +
      `Phone: ${lead.phone}\n` +
      `Email: ${lead.email}\n` +
      `Vehicle: ${vehicle}${schedule}\n` +
      (msgSnippet ? `Message: ${msgSnippet}` : '')

    try {
      // Prefer template if configured, else use free-form text message to business number
      await axios.post(
        `https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: WA_SALES_NUMBER,
          type: 'text',
          text: { body },
        },
        {
          headers: {
            Authorization: `Bearer ${WA_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (err) {
      console.error('[WhatsApp] Notification failed:', (err as Error).message)
    }
  },
}
