import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import DishCard from '../components/DishCard'
import ScoreBadge from '../components/ScoreBadge'
import RestaurantHours from '../components/RestaurantHours'
import { getRestaurant, listDishesByRestaurant } from '../lib/queries'
import { CATEGORY_LABELS, CATEGORY_EMOJI } from '../lib/gamification'
import type { Dish, DishCategory } from '../types/db'

type SortMode = 'rating' | 'price-asc' | 'price-desc' | 'alpha'

const CATEGORY_ORDER: DishCategory[] = ['starters', 'mains', 'sides', 'desserts', 'drinks']

function sortDishes(list: Dish[], mode: SortMode): Dish[] {
  const sorted = list.slice()
  switch (mode) {
    case 'rating':
      return sorted.sort((a, b) => b.avg_rating - a.avg_rating)
    case 'price-asc':
      return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
    case 'price-desc':
      return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
    case 'alpha':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'he'))
  }
}

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>()
  const [sortMode, setSortMode] = useState<SortMode>('rating')
  const [showHours, setShowHours] = useState(false)

  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurant(id!),
    enabled: !!id,
  })

  const { data: dishes, isLoading } = useQuery({
    queryKey: ['dishes', id],
    queryFn: () => listDishesByRestaurant(id!),
    enabled: !!id,
  })

  // Group + sort within each category
  const grouped: Record<string, Dish[]> = {}
  dishes?.forEach((d) => {
    grouped[d.category] = grouped[d.category] ?? []
    grouped[d.category].push(d)
  })
  Object.keys(grouped).forEach((cat) => {
    grouped[cat] = sortDishes(grouped[cat], sortMode)
  })

  const topDish = dishes && dishes.length > 0 ? sortDishes(dishes, 'rating')[0] : null

  // Encode address for Waze / Google Maps deep links
  const mapsHref = restaurant?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`
    : null

  return (
    <div className="pb-32">
      <Header back transparent />

      {restaurant && (
        <div className="max-w-md mx-auto">
          {/* Hero */}
          <div className="relative -mt-14 h-72 bg-ink-700">
            {restaurant.cover_image_url ? (
              <img src={restaurant.cover_image_url} alt={restaurant.name} className="w-full h-full object-cover opacity-70" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">🍴</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
            <div className="absolute bottom-4 inset-x-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold mb-2">
                {restaurant.cuisine_tags?.join(' · ') ?? 'מסעדה'}
              </p>
              <h1 className="display-xl text-4xl text-ink-100">{restaurant.name}</h1>
              {restaurant.address && (
                <a
                  href={mapsHref ?? '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-ink-200 mt-1 inline-flex items-center gap-1 hover:text-lime-500"
                >
                  📍 {restaurant.address}
                </a>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="px-4 -mt-2 relative">
            <div className="bg-ink-800 border border-ink-700 rounded-2xl p-4 flex items-center justify-between">
              <ScoreBadge value={restaurant.avg_dish_rating} size="lg" />
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">ממוצע ממנות</p>
                <p className="text-sm text-ink-200 mt-1">{dishes?.length ?? 0} מנות בתפריט</p>
              </div>
            </div>

            {/* Action row: phone, reservation, hours, share */}
            <div className="mt-3 flex gap-2 flex-wrap">
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex-1 min-w-[100px] bg-ink-800 border border-ink-700 hover:border-lime-500/40 rounded-xl py-2.5 text-center text-xs font-bold text-ink-100 uppercase tracking-wider"
                >
                  ☎ התקשר
                </a>
              )}
              {restaurant.reservation_url && (
                <a
                  href={restaurant.reservation_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[100px] bg-lime-500/10 border border-lime-500/30 hover:bg-lime-500/15 rounded-xl py-2.5 text-center text-xs font-bold text-lime-500 uppercase tracking-wider"
                >
                  הזמן שולחן
                </a>
              )}
              <button
                onClick={() => setShowHours(!showHours)}
                className="flex-1 min-w-[100px] bg-ink-800 border border-ink-700 hover:border-lime-500/40 rounded-xl py-2.5 text-center text-xs font-bold text-ink-100 uppercase tracking-wider"
              >
                ⏱ שעות {showHours ? '▲' : '▼'}
              </button>
              {mapsHref && (
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[100px] bg-ink-800 border border-ink-700 hover:border-lime-500/40 rounded-xl py-2.5 text-center text-xs font-bold text-ink-100 uppercase tracking-wider"
                >
                  ↗ ניווט
                </a>
              )}
            </div>

            {showHours && (
              <div className="mt-3">
                <RestaurantHours hours={restaurant.hours} />
              </div>
            )}

            {/* Top dish callout */}
            {topDish && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold mb-2">
                  ★ המנה הכי טובה כאן
                </p>
                <DishCard dish={topDish} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 mt-8">
        {/* Sort controls */}
        <div className="flex gap-1 mb-5 bg-ink-800 border border-ink-700 rounded-full p-1">
          {([
            { key: 'rating', label: 'דירוג' },
            { key: 'price-asc', label: 'מחיר ↑' },
            { key: 'price-desc', label: 'מחיר ↓' },
            { key: 'alpha', label: 'א-ב' },
          ] as { key: SortMode; label: string }[]).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortMode(opt.key)}
              className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                sortMode === opt.key ? 'bg-lime-500 text-ink-900' : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-center text-ink-400">טוען תפריט...</p>}

        {CATEGORY_ORDER.map((cat) => {
          const list = grouped[cat]
          if (!list || list.length === 0) return null
          return (
            <section key={cat} className="mb-8">
              <div className="flex items-end justify-between mb-3">
                <h2 className="display-xl text-2xl text-ink-100">{CATEGORY_LABELS[cat]}</h2>
                <span className="text-2xl">{CATEGORY_EMOJI[cat]}</span>
              </div>
              <div className="grid gap-3">
                {list.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
