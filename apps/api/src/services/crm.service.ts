import axios from 'axios'
import prisma from '../lib/prisma'

interface LeadRecord {
  id: string
  name: string
  email: string
  phone: string
  type: string
  vehicleTitle?: string | null
  message?: string | null
}

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY || ''
const HUBSPOT_URL = 'https://api.hubapi.com/crm/v3/objects/contacts'

async function upsertHubSpotContact(lead: LeadRecord): Promise<string | null> {
  if (!HUBSPOT_API_KEY) return null

  const nameParts = lead.name.trim().split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || '-'

  const properties = {
    email: lead.email,
    phone: lead.phone,
    firstname: firstName,
    lastname: lastName,
    lead_type: lead.type,
    vehicle_interest: lead.vehicleTitle || '',
    hs_lead_status: 'NEW',
  }

  try {
    // Try to find existing contact
    const searchRes = await axios.post(
      `${HUBSPOT_URL}/search`,
      { filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: lead.email }] }] },
      { headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}`, 'Content-Type': 'application/json' } }
    )

    if (searchRes.data.results?.length > 0) {
      const existingId = searchRes.data.results[0].id
      await axios.patch(
        `${HUBSPOT_URL}/${existingId}`,
        { properties },
        { headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}`, 'Content-Type': 'application/json' } }
      )
      return existingId
    }

    // Create new contact
    const createRes = await axios.post(
      HUBSPOT_URL,
      { properties },
      { headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}`, 'Content-Type': 'application/json' } }
    )
    return createRes.data.id
  } catch (err) {
    // CRM failure must NOT block lead save
    console.error('[CRM] HubSpot sync failed:', (err as Error).message)
    return null
  }
}

export const crmService = {
  async createOrUpdateContact(lead: LeadRecord): Promise<void> {
    const crmId = await upsertHubSpotContact(lead)
    if (crmId) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { crmId },
      }).catch(console.error)
    }
  },
}
