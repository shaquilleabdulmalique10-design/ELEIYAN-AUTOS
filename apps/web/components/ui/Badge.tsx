import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'navy' | 'green' | 'gray' | 'red'
  className?: string
}

export default function Badge({ children, variant = 'gold', className }: BadgeProps) {
  const variants = {
    gold: 'bg-gold/10 text-yellow-800 border border-gold/30',
    navy: 'bg-navy/10 text-navy border border-navy/20',
    green: 'bg-green-50 text-green-700 border border-green-200',
    gray: 'bg-gray-100 text-gray-600 border border-gray-200',
    red: 'bg-red-50 text-red-700 border border-red-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
