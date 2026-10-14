import { notFound } from 'next/navigation'
import { getVehicles, getVehicleBySlug } from '@/lib/api'
import VehicleForm from '@/components/admin/VehicleForm'

interface PageProps {
  params: { id: string }
}

export const metadata = { title: 'Edit Vehicle | Admin' }

export default async function EditVehiclePage({ params }: PageProps) {
  let vehicle
  try {
    const result = await getVehicles({ limit: 500 })
    const found = result.data.find((v) => v.id === params.id)
    if (!found) notFound()
    vehicle = await getVehicleBySlug(found.slug)
  } catch {
    notFound()
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl text-navy">Edit Vehicle</h1>
        <p className="text-gray-400 text-sm mt-1">{vehicle.title}</p>
      </div>
      <VehicleForm vehicle={vehicle} />
    </div>
  )
}
