import { levelByKey } from '../lib/gamification'
import type { Level } from '../types/db'

interface Props {
  level: Level
  ratingsCount?: number
  size?: 'sm' | 'md'
}

export default function LevelBadge({ level, ratingsCount, size = 'sm' }: Props) {
  const def = levelByKey(level)
  const sizeClass = size === 'md' ? 'text-xs px-3 py-1.5' : 'text-[10px] px-2 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-ink-800 text-ink-200 font-bold uppercase tracking-wider border border-ink-600 ${sizeClass}`}>
      <span className="text-lime-500">●</span>
      <span>{def.label}</span>
      {ratingsCount !== undefined && <span className="text-ink-400 tabular">{ratingsCount}</span>}
    </span>
  )
}
