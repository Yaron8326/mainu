import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import DishCard from '../components/DishCard'
import ScoreBadge from '../components/ScoreBadge'
import { getRestaurant, listDishesByRestaurant } from '../lib/queries'
import { CATEGORY_LABELS, CATEGORY_EMOJI } from '../lib/gamification'
import type { Dish, DishCategory } from '../types/db'

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>()

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

  const grouped: Record<string, Dish[]> = {}
  dishes?.forEach((d) => {
    grouped[d.category] = grouped[d.category] ?? []
    grouped[d.category].push(d)
  })

  const order: DishCategory[] = ['starters', 'mains', 'sides', 'desserts', 'drinks']
  const topDish = dishes?.[0]

  return (
    <div className="pb-32">
      <Header back transparent />

      {restaurant && (
        <div className="max-w-md mx-auto">
          {/* Hero with image bleed + gradient */}
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
                <p className="text-xs text-ink-300 mt-1">{restaurant.address}</p>
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

            {topDish && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold mb-2">★ המנה הכי טובה כאן</p>
                <DishCard dish={topDish} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 mt-8">
        {isLoading && <p className="text-center text-ink-400">טוען תפריט...</p>}

        {order.map((cat) => {
          const list = grouped[cat]
          if (!list || list.length === 0) return null
          return (
            <section key={cat} className="mb-8">
              <div className="flex items-end justify-between mb-3">
                <h2 className="display-xl text-2xl text-ink-100">
                  {CATEGORY_LABELS[cat]}
                </h2>
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
