import { Link } from 'react-router-dom'
import ScoreBadge from './ScoreBadge'
import type { Restaurant } from '../types/db'

interface Props {
  restaurant: Restaurant
  rank?: number
  compact?: boolean
}

export default function RestaurantCard({ restaurant, rank, compact }: Props) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group relative block bg-ink-800 rounded-2xl overflow-hidden border border-ink-700 hover:border-lime-500/40 transition-colors"
    >
      <div className={`${compact ? 'aspect-square' : 'aspect-[16/10]'} bg-ink-700 relative`}>
        {restaurant.cover_image_url ? (
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">🍴</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />

        {rank !== undefined && (
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-lime-500 text-ink-900 font-black text-sm flex items-center justify-center shadow-glow-lime tabular">
            {rank}
          </div>
        )}

        <div className="absolute bottom-2 left-2">
          <ScoreBadge value={restaurant.avg_dish_rating} size="sm" />
        </div>
      </div>

      <div className={compact ? 'p-3' : 'p-4'}>
        <h3 className={`font-black text-ink-100 tracking-tight truncate ${compact ? 'text-sm' : 'text-xl'}`}>
          {restaurant.name}
        </h3>
        {restaurant.address && !compact && (
          <p className="text-xs text-ink-400 mt-1 truncate">{restaurant.address}</p>
        )}
        <div className={`flex flex-wrap gap-1 ${compact ? 'mt-1.5' : 'mt-3'}`}>
          {restaurant.cuisine_tags?.slice(0, compact ? 1 : 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider font-bold text-ink-300 bg-ink-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {!compact && restaurant.is_kosher && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-lime-500 bg-lime-500/10 border border-lime-500/30 px-2 py-0.5 rounded-full">כשר</span>
          )}
        </div>
      </div>
    </Link>
  )
}
