import VehicleForm from '@/components/admin/VehicleForm'

export const metadata = { title: 'Add Vehicle | Admin' }

export default function NewVehiclePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl text-navy">Add New Vehicle</h1>
        <p className="text-gray-400 text-sm mt-1">Fill in the details below to add a new listing.</p>
      </div>
      <VehicleForm />
    </div>
  )
}
