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

interface StatProps {
  label: string
  value: number | string
  hint?: string
}

function StatCell({ label, value, hint }: StatProps) {
  return (
    <div className="text-center">
      <p className="display-xl text-3xl text-ink-100 tabular leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mt-1.5">{label}</p>
      {hint && <p className="text-[9px] text-ink-500 mt-0.5">{hint}</p>}
    </div>
  )
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const nav = useNavigate()
  const userId = id ?? user?.id

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

  // Derived stats from ratings
  const ratingsCount = ratings?.length ?? profile?.ratings_count ?? 0
  const uniqueRestaurants = new Set(ratings?.map((r) => r.dish.restaurant_id) ?? []).size

  // Specialty by category
  const counts: Partial<Record<DishCategory, number>> = {}
  ratings?.forEach((r) => {
    const c = r.dish.category
    counts[c] = (counts[c] ?? 0) + 1
  })
  const specialty = computeSpecialty(counts)
  const levelInfo = profile ? progressToNext(ratingsCount) : null
  const currentLevel = levelForCount(ratingsCount).key

  // Group recent ratings by date for the Timeline
  const grouped: Record<string, typeof ratings> = {}
  ratings?.forEach((r) => {
    const d = new Date(r.created_at)
    const key = d.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
    if (!grouped[key]) grouped[key] = []
    grouped[key]!.push(r)
  })

  // Get user initials for avatar fallback
  const initials = (profile?.display_name ?? user?.email ?? '?').slice(0, 1).toUpperCase()

  return (
    <div className="pb-32">
      <Header back={!isMe} />

      <div className="max-w-md mx-auto px-4 pt-4">
        {profile && (
          <>
            {/* IDENTITY: avatar + name + level */}
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name ?? ''}
                  className="w-20 h-20 rounded-full object-cover border-2 border-lime-500/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-ink-800 border-2 border-lime-500/30 flex items-center justify-center text-3xl font-black text-lime-500">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold">פרופיל</p>
                <h1 className="display-xl text-3xl text-ink-100 flex items-center gap-2 truncate">
                  {profile.display_name ?? 'משתמש'}
                  {profile.is_chef_verified && <span title="שף מאומת" className="text-lime-500 text-lg shrink-0">✓</span>}
                </h1>
                <div className="mt-1.5">
                  <LevelBadge level={currentLevel} size="sm" />
                </div>
              </div>
            </div>

            {/* 3-STAT GRID — matches deck page 8 */}
            <div className="mt-5 bg-ink-800 border border-ink-700 rounded-2xl p-4 grid grid-cols-3 divide-x divide-ink-700" dir="ltr">
              <StatCell label="עוקבים" value={0} hint="בקרוב" />
              <StatCell label="מסעדות" value={uniqueRestaurants} />
              <StatCell label="דירוגים" value={ratingsCount} />
            </div>

            {/* PROGRESS + SPECIALTY card */}
            {(levelInfo?.next || specialty) && (
              <div className="mt-3 bg-ink-800 border border-ink-700 rounded-2xl p-4 space-y-3">
                {levelInfo?.next && (
                  <div>
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-ink-400 font-bold mb-2">
                      <span>בדרך ל-{levelInfo.next.label} {levelInfo.next.emoji}</span>
                      <span>{levelInfo.remaining} עוד</span>
                    </div>
                    <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-500" style={{ width: `${levelInfo.pct}%` }} />
                    </div>
                  </div>
                )}
                {specialty && (
                  <div className={`flex items-center justify-between ${levelInfo?.next ? 'pt-3 border-t border-ink-700' : ''}`}>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">התמחות</p>
                      <p className="mt-1 text-ink-100 font-black">
                        {CATEGORY_EMOJI[specialty.category]} {CATEGORY_LABELS[specialty.category]}
                      </p>
                    </div>
                    <span className="display-xl text-2xl text-lime-500 tabular">{specialty.count}</span>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN entry — only for admin */}
            {isMe && isAdmin(user) && (
              <Link
                to="/admin"
                className="mt-3 flex items-center justify-between bg-lime-500/10 border border-lime-500/30 rounded-2xl p-3 hover:bg-lime-500/15"
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

            {/* LISTS placeholder — Phase 2 wishlist & shared lists */}
            <section className="mt-6">
              <h2 className="display-xl text-2xl text-ink-100 mb-3">רשימות</h2>
              <div className="bg-ink-800 border border-dashed border-ink-600 rounded-2xl p-5 text-center">
                <p className="text-3xl">☰</p>
                <p className="text-sm text-ink-300 font-black mt-2">"רוצה לטעום"</p>
                <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mt-1">בקרוב · Phase 2</p>
              </div>
            </section>

            {isMe && (
              <button
                onClick={handleSignOut}
                className="mt-6 w-full text-xs text-ink-400 underline uppercase tracking-wider"
              >
                התנתקות
              </button>
            )}
          </>
        )}

        {/* TIMELINE of ratings — grouped by date, deck page 8 */}
        <section className="mt-8">
          <h2 className="display-xl text-2xl text-ink-100 mb-3">היסטוריית הדירוגים</h2>
          {ratings && ratings.length === 0 && (
            <p className="text-sm text-ink-400 text-center bg-ink-800 border border-ink-700 rounded-2xl py-8">
              עדיין אין דירוגים. <Link to="/" className="text-lime-500 underline">התחל לטעום</Link>
            </p>
          )}

          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-5">
              <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mb-2">{date}</p>
              <div className="space-y-2 relative pr-4 border-r border-ink-700">
                {items?.map((r) => (
                  <Link
                    key={r.id}
                    to={`/dish/${r.dish.id}`}
                    className="block bg-ink-800 border border-ink-700 rounded-xl p-3 hover:border-lime-500/40 relative"
                  >
                    {/* Timeline dot */}
                    <span className="absolute -right-[21px] top-4 w-2.5 h-2.5 rounded-full bg-lime-500 border-2 border-ink-900" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-black text-ink-100 truncate">{r.dish.name}</p>
                        <p className="text-[10px] uppercase tracking-wider text-lime-500 font-bold mt-0.5">
                          {CATEGORY_EMOJI[r.dish.category]} {CATEGORY_LABELS[r.dish.category]}
                        </p>
                        {r.comment && <p className="text-xs text-ink-300 mt-1 line-clamp-1">{r.comment}</p>}
                      </div>
                      <span className="display-xl text-3xl text-lime-500 tabular shrink-0">
                        {r.stars}<span className="text-ink-500 text-sm">/5</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
