interface Props {
  value: number
  count?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: { num: 'text-lg', label: 'text-[10px]', pad: 'px-2 py-1' },
  md: { num: 'text-2xl', label: 'text-xs', pad: 'px-3 py-1.5' },
  lg: { num: 'text-4xl', label: 'text-xs', pad: 'px-4 py-2' },
  xl: { num: 'text-6xl', label: 'text-sm', pad: 'px-5 py-3' },
}

// "Audio meter"-style score - the visual signature of MainU.
// A bold number set against a dark pill, lime accent on the right edge.
export default function ScoreBadge({ value, count, size = 'md' }: Props) {
  const s = sizeMap[size]
  const has = value > 0
  return (
    <div className={`inline-flex items-center gap-2 bg-ink-700 rounded-2xl ${s.pad} border border-ink-600`}>
      <div className="flex flex-col items-start leading-none">
        <span className={`${s.num} font-black tabular text-ink-100`}>
          {has ? value.toFixed(1) : '—'}
        </span>
        {count !== undefined && (
          <span className={`${s.label} text-ink-400 mt-0.5`}>
            {count} {count === 1 ? 'דירוג' : 'דירוגים'}
          </span>
        )}
      </div>
      <div
        className="w-1.5 self-stretch rounded-full"
        style={{
          background: has
            ? `linear-gradient(to top, #d4ff00 ${value * 20}%, #2a2a2a ${value * 20}%)`
            : '#2a2a2a',
        }}
      />
    </div>
  )
}
