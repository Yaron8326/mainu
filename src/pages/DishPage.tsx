import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import StarRating from '../components/StarRating'
import LevelBadge from '../components/LevelBadge'
import RatingModal from '../components/RatingModal'
import { getDish, listRatingsByDish, getMyRatingForDish } from '../lib/queries'
import { useUser } from '../hooks/useUser'
import { CATEGORY_LABELS, CATEGORY_GRADIENT, CATEGORY_EMOJI } from '../lib/gamification'

export default function DishPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const [modalOpen, setModalOpen] = useState(false)

  const { data: dish } = useQuery({
    queryKey: ['dish', id],
    queryFn: () => getDish(id!),
    enabled: !!id,
  })

  const { data: ratings } = useQuery({
    queryKey: ['ratings', id],
    queryFn: () => listRatingsByDish(id!),
    enabled: !!id,
  })

  const { data: myRating } = useQuery({
    queryKey: ['my-rating', id],
    queryFn: () => getMyRatingForDish(id!, user!.id),
    enabled: !!id && !!user,
  })

  const histogram = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: ratings?.filter((r) => r.stars === s).length ?? 0,
  }))
  const total = ratings?.length ?? 0

  return (
    <div className="pb-40">
      <Header back transparent />

      {dish && (
        <div className="max-w-md mx-auto">
          {/* Album cover */}
          <div className="relative aspect-square -mt-14 bg-ink-700">
            {dish.image_url ? (
              <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${CATEGORY_GRADIENT[dish.category]} flex items-center justify-center text-9xl opacity-60`}>
                {CATEGORY_EMOJI[dish.category]}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/30" />
          </div>

          <div className="px-4 -mt-16 relative">
            <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold">
              {CATEGORY_LABELS[dish.category]}
            </p>
            <h1 className="display-xl text-5xl text-ink-100 mt-2">{dish.name}</h1>

            <Link
              to={`/restaurant/${dish.restaurant.id}`}
              className="text-sm text-ink-300 hover:text-lime-500 inline-flex items-center gap-1 mt-2"
            >
              <span className="text-lime-500">▸</span> {dish.restaurant.name}
            </Link>

            {dish.description && <p className="text-ink-300 mt-4 leading-relaxed">{dish.description}</p>}

            <div className="flex items-center justify-between mt-5">
              {dish.price != null && (
                <span className="display-xl text-3xl text-ink-100 tabular">₪{dish.price}</span>
              )}
              {myRating && (
                <span className="text-[10px] uppercase tracking-wider font-bold text-lime-500 bg-lime-500/10 border border-lime-500/30 px-3 py-1.5 rounded-full">
                  דירגת {myRating.stars}★
                </span>
              )}
            </div>

            {/* Big score panel */}
            <div className="mt-6 bg-ink-800 border border-ink-700 rounded-2xl p-5">
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="display-xl text-7xl text-lime-500 tabular leading-none">
                    {dish.avg_rating > 0 ? dish.avg_rating.toFixed(1) : '—'}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mt-1">
                    {dish.ratings_count} {dish.ratings_count === 1 ? 'דירוג' : 'דירוגים'}
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {histogram.map((row) => (
                    <div key={row.stars} className="flex items-center gap-2 text-[10px]">
                      <span className="text-ink-400 w-3 font-bold tabular">{row.stars}</span>
                      <div className="flex-1 h-1.5 bg-ink-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-lime-500"
                          style={{ width: total > 0 ? `${(row.count / total) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-ink-400 w-6 text-end tabular">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ratings */}
            <h3 className="display-xl text-2xl text-ink-100 mt-8 mb-3">דירוגים</h3>
            <div className="space-y-3">
              {ratings && ratings.length === 0 && (
                <p className="text-sm text-ink-400 text-center py-8 bg-ink-800 border border-ink-700 rounded-2xl">
                  אין עדיין דירוגים. היה הראשון!
                </p>
              )}
              {ratings?.map((r) => (
                <div key={r.id} className="bg-ink-800 border border-ink-700 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {r.profile.avatar_url ? (
                        <img src={r.profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-ink-700 flex items-center justify-center text-ink-400">
                          {r.profile.display_name?.[0] ?? '?'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-ink-100">{r.profile.display_name ?? 'משתמש'}</p>
                        <div className="mt-0.5">
                          <LevelBadge level={r.profile.level} />
                        </div>
                      </div>
                    </div>
                    <span className="display-xl text-3xl text-lime-500 tabular">{r.stars}<span className="text-ink-500 text-base">/5</span></span>
                  </div>
                  {r.comment && <p className="text-sm text-ink-300 mt-3 leading-relaxed">{r.comment}</p>}
                  {r.photo_url && (
                    <img src={r.photo_url} alt="" className="mt-3 w-full max-h-64 object-cover rounded-xl" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA */}
      <div className="fixed bottom-24 inset-x-0 px-4 z-20 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          {user ? (
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-lime-500 hover:bg-lime-400 text-ink-900 font-black py-4 rounded-full uppercase tracking-wider text-sm shadow-glow-lime"
            >
              {myRating ? `ערוך דירוג (${myRating.stars}★)` : 'דרג עכשיו'}
            </button>
          ) : (
            <Link
              to="/auth"
              className="block w-full bg-lime-500 hover:bg-lime-400 text-ink-900 text-center font-black py-4 rounded-full uppercase tracking-wider text-sm shadow-glow-lime"
            >
              התחבר כדי לדרג
            </Link>
          )}
        </div>
      </div>

      {dish && (
        <RatingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          dishId={dish.id}
          dishName={dish.name}
          initialStars={myRating?.stars}
          initialComment={myRating?.comment}
          initialPhotoUrl={myRating?.photo_url}
        />
      )}
    </div>
  )
}
