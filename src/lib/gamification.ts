import type { Level, DishCategory } from '../types/db'

export interface LevelDef {
  key: Level
  label: string
  emoji: string
  min: number
  max: number
}

export const LEVELS: LevelDef[] = [
  { key: 'beginner',    label: 'מתחיל',    emoji: '🌱', min: 0,   max: 5 },
  { key: 'advanced',    label: 'מתקדם',    emoji: '🍴', min: 6,   max: 15 },
  { key: 'experienced', label: 'מנוסה',    emoji: '👨‍🍳', min: 16, max: 40 },
  { key: 'pro',         label: 'מקצוען',   emoji: '⭐', min: 41, max: 99 },
  { key: 'master',      label: 'מאסטר',   emoji: '👑', min: 100, max: Infinity },
]

export function levelForCount(count: number): LevelDef {
  return LEVELS.find((l) => count >= l.min && count <= l.max) ?? LEVELS[0]
}

export function levelByKey(key: Level): LevelDef {
  return LEVELS.find((l) => l.key === key) ?? LEVELS[0]
}

export function nextLevel(count: number): LevelDef | null {
  const current = levelForCount(count)
  const idx = LEVELS.findIndex((l) => l.key === current.key)
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null
}

export function progressToNext(count: number): { current: LevelDef; next: LevelDef | null; pct: number; remaining: number } {
  const current = levelForCount(count)
  const next = nextLevel(count)
  if (!next) return { current, next: null, pct: 100, remaining: 0 }
  const span = next.min - current.min
  const inLevel = count - current.min
  return {
    current,
    next,
    pct: Math.min(100, Math.round((inLevel / span) * 100)),
    remaining: next.min - count,
  }
}

export const CATEGORY_LABELS: Record<DishCategory, string> = {
  starters: 'ראשונות',
  mains: 'עיקריות',
  desserts: 'קינוחים',
  drinks: 'שתייה',
  sides: 'תוספות',
}

export const CATEGORY_EMOJI: Record<DishCategory, string> = {
  starters: '🥗',
  mains: '🍝',
  desserts: '🍰',
  drinks: '🥤',
  sides: '🍟',
}

// Color-key per category for image-less dish backgrounds (vinyl cover fallback)
export const CATEGORY_GRADIENT: Record<DishCategory, string> = {
  starters: 'from-emerald-900 via-emerald-800 to-ink-900',
  mains:    'from-orange-900 via-red-900 to-ink-900',
  desserts: 'from-pink-900 via-rose-900 to-ink-900',
  drinks:   'from-sky-900 via-indigo-900 to-ink-900',
  sides:    'from-amber-900 via-yellow-900 to-ink-900',
}

export const SPECIALTY_THRESHOLD = 5

export function computeSpecialty(
  countsByCategory: Partial<Record<DishCategory, number>>,
): { category: DishCategory; count: number } | null {
  let best: { category: DishCategory; count: number } | null = null
  for (const [cat, count] of Object.entries(countsByCategory) as [DishCategory, number][]) {
    if (count >= SPECIALTY_THRESHOLD && (!best || count > best.count)) {
      best = { category: cat, count }
    }
  }
  return best
}
