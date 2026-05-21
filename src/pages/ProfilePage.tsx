import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import LevelBadge from '../components/LevelBadge'
import { getProfile, listMyRatings, listPendingRestaurants, listPendingDishes } from '../lib/queries'
import { supabase } from '../lib/supabase'
import { useUser, demoSignOut } from '../hooks/useUser'
import { isDemo } from '../lib/mockData'
import { isAdmin } from '../lib/admin'
import { CATEGORY_LABELS, CATEGORY_EMOJI, computeSpecialty, levelForCount, progressToNext } from '../lib/gamification'
import type { DishCategory } from '../types/db'

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const nav = useNavigate()
  const userId = id ?? user?.id

  // After signing out, the previous profile URL still works (read is public),
  // so push the user to a sensible "logged-out" landing.
  const handleSignOut = async () => {
    if (isDemo()) demoSignOut()
    else await supabase.auth.signOut()
    nav('/auth', { replace: true })
  }

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  })

  const { data: ratings } = useQuery({
    queryKey: ['my-ratings', userId],
    queryFn: () => listMyRatings(userId!),
    enabled: !!userId,
  })

  // For admins, prefetch pending counts so we can show a notification badge
  const { data: pendingRest } = useQuery({
    queryKey: ['admin', 'pending-restaurants'],
    queryFn: listPendingRestaurants,
    enabled: isAdmin(user),
  })
  const { data: pendingDish } = useQuery({
    queryKey: ['admin', 'pending-dishes'],
    queryFn: listPendingDishes,
    enabled: isAdmin(user),
  })
  const totalPending = (pendingRest?.length ?? 0) + (pendingDish?.length ?? 0)

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-ink-400 mb-4">יש להתחבר כדי לראות את הפרופיל</p>
        <Link to="/auth" className="bg-lime-500 text-ink-900 font-black py-3 px-8 rounded-full uppercase tracking-wider text-sm">
          התחברות
        </Link>
      </div>
    )
  }

  const isMe = user?.id === userId

  const counts: Partial<Record<DishCategory, number>> = {}
  ratings?.forEach((r) => {
    const c = r.dish.category
    counts[c] = (counts[c] ?? 0) + 1
  })
  const specialty = computeSpecialty(counts)
  const totalCount = ratings?.length ?? profile?.ratings_count ?? 0
  const levelInfo = profile ? progressToNext(totalCount) : null
  const currentLevel = levelForCount(totalCount).key

  return (
    <div className="pb-32">
      <Header back={!isMe} />

      <div className="max-w-md mx-auto px-4 pt-4">
        {profile && (
          <>
            <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold">פרופיל</p>
            <h1 className="display-xl text-4xl text-ink-100 mt-2 mb-1 flex items-center gap-2">
              {profile.display_name ?? 'משתמש'}
              {profile.is_chef_verified && <span title="שף מאומת" className="text-lime-500 text-xl">✓</span>}
            </h1>
            <div className="mt-3">
              <LevelBadge level={currentLevel} ratingsCount={totalCount} size="md" />
            </div>

            <div className="mt-6 bg-ink-800 border border-ink-700 rounded-2xl p-5">
              <div className="flex items-baseline gap-2">
                <span className="display-xl text-6xl text-lime-500 tabular">{totalCount}</span>
                <span className="text-sm text-ink-400 uppercase tracking-wider font-bold">מנות דורגו</span>
              </div>

              {levelInfo?.next && (
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-ink-400 font-bold mb-2">
                    <span>{levelInfo.next.label}</span>
                    <span>{levelInfo.remaining} עוד</span>
                  </div>
                  <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
                    <div className="h-full bg-lime-500" style={{ width: `${levelInfo.pct}%` }} />
                  </div>
                </div>
              )}

              {specialty && (
                <div className="mt-4 pt-4 border-t border-ink-700">
                  <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">התמחות</p>
                  <p className="mt-1 text-ink-100 font-black">
                    {CATEGORY_EMOJI[specialty.category]} {CATEGORY_LABELS[specialty.category]}{' '}
                    <span className="text-ink-400 font-normal text-sm tabular">· {specialty.count}</span>
                  </p>
                </div>
              )}
            </div>

            {isMe && isAdmin(user) && (
              <Link
                to="/admin"
                className="mt-4 flex items-center justify-between bg-lime-500/10 border border-lime-500/30 rounded-2xl p-3 hover:bg-lime-500/15"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-lime-500 font-bold">פאנל אדמין</p>
                  <p className="text-sm text-ink-100 font-black mt-0.5">
                    {totalPending > 0 ? `${totalPending} ממתינים לאישור` : 'אין ממתינים'}
                  </p>
                </div>
                <span className="text-lime-500 text-xl">‹</span>
              </Link>
            )}

            {isMe && (
              <button
                onClick={handleSignOut}
                className="mt-4 w-full text-xs text-ink-400 underline uppercase tracking-wider"
              >
                התנתקות
              </button>
            )}
          </>
        )}

        <h2 className="display-xl text-2xl text-ink-100 mt-8 mb-3">הדירוגים שלי</h2>
        <div className="space-y-2">
          {ratings && ratings.length === 0 && (
            <p className="text-sm text-ink-400 text-center bg-ink-800 border border-ink-700 rounded-2xl py-8">
              עדיין אין דירוגים
            </p>
          )}
          {ratings?.map((r) => (
            <Link
              key={r.id}
              to={`/dish/${r.dish.id}`}
              className="flex items-center justify-between gap-3 bg-ink-800 border border-ink-700 rounded-xl p-3 hover:border-lime-500/40"
            >
              <div className="min-w-0">
                <p className="font-black text-ink-100 truncate">{r.dish.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mt-0.5">{CATEGORY_LABELS[r.dish.category]}</p>
                {r.comment && <p className="text-xs text-ink-300 mt-1 line-clamp-1">{r.comment}</p>}
              </div>
              <span className="display-xl text-3xl text-lime-500 tabular shrink-0">{r.stars}<span className="text-ink-500 text-sm">/5</span></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
