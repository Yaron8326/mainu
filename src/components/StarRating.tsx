import { useState } from 'react'

interface Props {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

const sizes = {
  sm: 'text-sm',
  md: 'text-2xl',
  lg: 'text-4xl',
}

// Stars are still used inside the rating modal for input.
// On lists we mostly show <ScoreBadge> instead.
export default function StarRating({ value, onChange, size = 'md', showValue = false }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const editable = Boolean(onChange)
  const display = hover ?? value

  return (
    <div className="inline-flex items-center gap-1 select-none" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = display >= star
        const half = !filled && display >= star - 0.5
        return (
          <button
            key={star}
            type="button"
            disabled={!editable}
            onMouseEnter={() => editable && setHover(star)}
            onMouseLeave={() => editable && setHover(null)}
            onClick={() => onChange?.(star)}
            className={`${sizes[size]} leading-none transition-transform ${
              editable ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
            } ${filled ? 'text-lime-500' : half ? 'text-lime-700' : 'text-ink-500'}`}
            aria-label={`${star} כוכבים`}
          >
            ★
          </button>
        )
      })}
      {showValue && value > 0 && (
        <span className="mr-2 font-bold text-ink-100 tabular">{value.toFixed(1)}</span>
      )}
    </div>
  )
}
