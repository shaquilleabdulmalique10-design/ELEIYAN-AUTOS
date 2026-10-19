import type {
  Vehicle,
  VehicleListItem,
  VehicleFilters,
  PaginatedVehicles,
  Lead,
  CreateLeadInput,
} from '@eleniyan/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export async function getVehicles(filters: VehicleFilters = {}): Promise<PaginatedVehicles> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v))
  })
  return fetcher<PaginatedVehicles>(`/api/vehicles?${params.toString()}`)
}

export async function getFeaturedVehicles(): Promise<VehicleListItem[]> {
  const result = await getVehicles({ isFeatured: true, limit: 6 })
  return result.data
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle> {
  return fetcher<Vehicle>(`/api/vehicles/${slug}`)
}

export async function createVehicle(data: Partial<Vehicle>, token: string): Promise<Vehicle> {
  return fetcher<Vehicle>('/api/vehicles', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function updateVehicle(
  id: string,
  data: Partial<Vehicle>,
  token: string
): Promise<Vehicle> {
  return fetcher<Vehicle>(`/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function deleteVehicle(id: string, token: string): Promise<void> {
  return fetcher(`/api/vehicles/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function createLead(data: CreateLeadInput): Promise<Lead> {
  return fetcher<Lead>('/api/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getLeads(
  params: Record<string, string>,
  token: string
): Promise<{ data: Lead[]; total: number; page: number; totalPages: number }> {
  const qs = new URLSearchParams(params).toString()
  return fetcher(`/api/leads?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function updateLeadStatus(
  id: string,
  status: string,
  token: string
): Promise<Lead> {
  return fetcher<Lead>(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
}

// ─── Uploads ──────────────────────────────────────────────────────────────────

export async function getUploadUrl(
  filename: string,
  contentType: string,
  token: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  return fetcher('/api/uploads/image', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ filename, contentType }),
  })
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  return fetcher('/api/newsletters', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}
