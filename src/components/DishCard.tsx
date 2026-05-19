import { Link } from 'react-router-dom'
import ScoreBadge from './ScoreBadge'
import { CATEGORY_GRADIENT, CATEGORY_EMOJI } from '../lib/gamification'
import type { Dish, DishWithRestaurant } from '../types/db'

interface Props {
  dish: Dish | DishWithRestaurant
  showRestaurant?: boolean
  variant?: 'row' | 'square'
}

function DishCover({ dish, className }: { dish: Dish; className?: string }) {
  if (dish.image_url) {
    return <img src={dish.image_url} alt={dish.name} className={`w-full h-full object-cover ${className ?? ''}`} />
  }
  return (
    <div className={`w-full h-full bg-gradient-to-br ${CATEGORY_GRADIENT[dish.category]} flex items-center justify-center ${className ?? ''}`}>
      <span className="text-4xl opacity-60">{CATEGORY_EMOJI[dish.category]}</span>
    </div>
  )
}

export default function DishCard({ dish, showRestaurant, variant = 'row' }: Props) {
  const withRest = dish as DishWithRestaurant

  if (variant === 'square') {
    return (
      <Link to={`/dish/${dish.id}`} className="block w-44 shrink-0">
        <div className="relative w-44 h-44 rounded-xl overflow-hidden bg-ink-700">
          <DishCover dish={dish} />
          <div className="absolute top-2 right-2">
            <ScoreBadge value={dish.avg_rating} size="sm" />
          </div>
        </div>
        <p className="mt-2 font-bold text-ink-100 text-sm truncate">{dish.name}</p>
        {showRestaurant && withRest.restaurant && (
          <p className="text-xs text-ink-400 truncate">{withRest.restaurant.name}</p>
        )}
      </Link>
    )
  }

  return (
    <Link
      to={`/dish/${dish.id}`}
      className="flex gap-3 p-3 bg-ink-800 rounded-xl border border-ink-700 hover:border-lime-500/40 transition-colors"
    >
      <div className="w-20 h-20 rounded-lg bg-ink-700 overflow-hidden shrink-0">
        <DishCover dish={dish} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-black text-ink-100 truncate">{dish.name}</h3>
            {showRestaurant && withRest.restaurant && (
              <p className="text-xs text-lime-500 font-bold uppercase tracking-wider mt-0.5">
                {withRest.restaurant.name}
              </p>
            )}
          </div>
          {dish.price != null && (
            <span className="text-sm text-ink-300 shrink-0 tabular">₪{dish.price}</span>
          )}
        </div>
        {dish.description && (
          <p className="text-xs text-ink-400 line-clamp-2 mt-1">{dish.description}</p>
        )}
        <div className="mt-2">
          <ScoreBadge value={dish.avg_rating} count={dish.ratings_count} size="sm" />
        </div>
      </div>
    </Link>
  )
}
