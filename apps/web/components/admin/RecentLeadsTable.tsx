import type { Lead } from '@eleniyan/types'
import { formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface RecentLeadsTableProps {
  leads: Lead[]
}

const statusVariant: Record<string, 'gold' | 'navy' | 'green' | 'gray' | 'red'> = {
  NEW: 'gold',
  CONTACTED: 'navy',
  QUALIFIED: 'green',
  CLOSED_WON: 'green',
  CLOSED_LOST: 'red',
}

const typeLabel: Record<string, string> = {
  REQUEST_VIEWING: 'Viewing',
  TRADE_IN: 'Trade-In',
  CONTACT: 'Contact',
  NEWSLETTER: 'Newsletter',
  SCHEDULE_VIEWING: 'Schedule',
}

export default function RecentLeadsTable({ leads }: RecentLeadsTableProps) {
  if (!leads.length) {
    return <p className="text-gray-400 text-sm py-4">No leads yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Recent leads">
        <thead>
          <tr className="border-b border-gray-100">
            <th scope="col" className="text-left py-2 font-medium text-gray-400 text-xs">Name</th>
            <th scope="col" className="text-left py-2 font-medium text-gray-400 text-xs">Type</th>
            <th scope="col" className="text-left py-2 font-medium text-gray-400 text-xs">Status</th>
            <th scope="col" className="text-left py-2 font-medium text-gray-400 text-xs">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="py-2.5 font-medium text-navy">{lead.name}</td>
              <td className="py-2.5 text-gray-500">{typeLabel[lead.type] || lead.type}</td>
              <td className="py-2.5">
                <Badge variant={statusVariant[lead.status] || 'gray'}>{lead.status}</Badge>
              </td>
              <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">
                {formatDate(lead.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
