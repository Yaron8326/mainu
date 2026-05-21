import { Navigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Header from '../components/Header'
import { useUser } from '../hooks/useUser'
import { isAdmin } from '../lib/admin'
import {
  listPendingDishes,
  listPendingRestaurants,
  updateDishStatus,
  updateRestaurantStatus,
} from '../lib/queries'
import { CATEGORY_LABELS } from '../lib/gamification'

export default function AdminPage() {
  const { user, loading } = useUser()
  const qc = useQueryClient()

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

  const restMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      updateRestaurantStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'pending-restaurants'] })
      qc.invalidateQueries({ queryKey: ['restaurants'] })
    },
  })

  const dishMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      updateDishStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'pending-dishes'] })
      qc.invalidateQueries({ queryKey: ['top-dishes'] })
    },
  })

  if (loading) return null
  if (!user || !isAdmin(user)) return <Navigate to="/" replace />

  const totalPending = (pendingRest?.length ?? 0) + (pendingDish?.length ?? 0)

  return (
    <div className="pb-32">
      <Header back />
      <div className="max-w-md mx-auto px-4 pt-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-500 font-bold">אדמין</p>
        <h1 className="display-xl text-4xl text-ink-100 mt-2 mb-6">
          {totalPending} <span className="text-lime-500">ממתינים</span> לאישור
        </h1>

        {/* RESTAURANTS pending */}
        <section className="mb-8">
          <div className="flex items-end justify-between mb-3">
            <h2 className="display-xl text-2xl text-ink-100">מסעדות</h2>
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold tabular">
              {pendingRest?.length ?? 0}
            </span>
          </div>

          {pendingRest?.length === 0 && (
            <p className="text-sm text-ink-400 bg-ink-800 border border-ink-700 rounded-xl py-6 text-center">
              אין מסעדות ממתינות ✓
            </p>
          )}

          <div className="space-y-3">
            {pendingRest?.map((r) => (
              <div key={r.id} className="bg-ink-800 border border-ink-700 rounded-2xl p-4">
                <h3 className="font-black text-ink-100">{r.name}</h3>
                {r.address && <p className="text-xs text-ink-400 mt-1">{r.address}</p>}
                <div className="mt-2 flex gap-1 flex-wrap">
                  {r.is_kosher && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-lime-500 bg-lime-500/10 border border-lime-500/30 px-2 py-0.5 rounded-full">
                      כשר
                    </span>
                  )}
                  {r.is_vegan_friendly && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-lime-500 bg-lime-500/10 border border-lime-500/30 px-2 py-0.5 rounded-full">
                      טבעוני
                    </span>
                  )}
                  {r.cuisine_tags?.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-wider font-bold text-ink-300 bg-ink-700 px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => restMut.mutate({ id: r.id, status: 'approved' })}
                    disabled={restMut.isPending}
                    className="flex-1 bg-lime-500 hover:bg-lime-400 text-ink-900 font-black py-2 rounded-full uppercase tracking-wider text-xs disabled:opacity-50"
                  >
                    ✓ אשר
                  </button>
                  <button
                    onClick={() => restMut.mutate({ id: r.id, status: 'rejected' })}
                    disabled={restMut.isPending}
                    className="flex-1 bg-chili-500/10 hover:bg-chili-500/20 text-chili-500 border border-chili-500/30 font-bold py-2 rounded-full uppercase tracking-wider text-xs disabled:opacity-50"
                  >
                    ✗ דחה
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DISHES pending */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="display-xl text-2xl text-ink-100">מנות</h2>
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold tabular">
              {pendingDish?.length ?? 0}
            </span>
          </div>

          {pendingDish?.length === 0 && (
            <p className="text-sm text-ink-400 bg-ink-800 border border-ink-700 rounded-xl py-6 text-center">
              אין מנות ממתינות ✓
            </p>
          )}

          <div className="space-y-3">
            {pendingDish?.map((d) => (
              <div key={d.id} className="bg-ink-800 border border-ink-700 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-black text-ink-100 truncate">{d.name}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-lime-500 font-bold mt-1">
                      {d.restaurant?.name ?? '—'} · {CATEGORY_LABELS[d.category]}
                    </p>
                  </div>
                  {d.price != null && (
                    <span className="text-sm text-ink-300 shrink-0 tabular">₪{d.price}</span>
                  )}
                </div>
                {d.description && (
                  <p className="text-xs text-ink-400 mt-2 line-clamp-2">{d.description}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => dishMut.mutate({ id: d.id, status: 'approved' })}
                    disabled={dishMut.isPending}
                    className="flex-1 bg-lime-500 hover:bg-lime-400 text-ink-900 font-black py-2 rounded-full uppercase tracking-wider text-xs disabled:opacity-50"
                  >
                    ✓ אשר
                  </button>
                  <button
                    onClick={() => dishMut.mutate({ id: d.id, status: 'rejected' })}
                    disabled={dishMut.isPending}
                    className="flex-1 bg-chili-500/10 hover:bg-chili-500/20 text-chili-500 border border-chili-500/30 font-bold py-2 rounded-full uppercase tracking-wider text-xs disabled:opacity-50"
                  >
                    ✗ דחה
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
