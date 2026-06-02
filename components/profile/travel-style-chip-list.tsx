import { TRAVEL_STYLE_OPTIONS } from '@/lib/profile-travel-styles'
import { cn } from '@/lib/utils'

interface TravelStyleChipListProps {
  values: string[]
  className?: string
}

export function TravelStyleChipList({ values, className }: TravelStyleChipListProps) {
  if (values.length === 0) {
    return null
  }

  const labelByValue = new Map<string, string>(
    TRAVEL_STYLE_OPTIONS.map((option) => [option.value, option.label]),
  )

  return (
    <div className={cn('border-t border-[#c8a882]/12 pt-6 sm:pt-7', className)}>
      <p className="mb-4 text-sm font-medium text-[#713522]/82">How they travel</p>
      <ul className="flex flex-wrap gap-2" aria-label="Travel styles">
        {values.map((value) => {
          const label = labelByValue.get(value)
          if (!label) {
            return null
          }

          return (
            <li key={value}>
              <span
                className={cn(
                  'inline-block rounded-full border px-3.5 py-1.5 text-[0.78rem] font-medium',
                  'border-[#fab642]/55 bg-[#fef6e4] text-[#713522]',
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
