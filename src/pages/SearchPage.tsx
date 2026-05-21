import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import DishCard from '../components/DishCard'
import RestaurantCard from '../components/RestaurantCard'
import { searchDishes, searchRestaurants } from '../lib/queries'

type Tab = 'dishes' | 'restaurants'

const SUGGESTIONS = ['פסטה', 'המבורגר', 'סושי', 'חומוס', 'ראמן', 'פלאפל', 'שווארמה', 'פיצה']

// Debounce hook — keeps autocomplete from firing on every keystroke
function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initialQ = params.get('q') ?? ''
  const initialTab = (params.get('t') as Tab) || 'dishes'
  const [q, setQ] = useState(initialQ)
  const [tab, setTab] = useState<Tab>(initialTab)

  const debouncedQ = useDebounced(q.trim(), 250)

  useEffect(() => {
    if (debouncedQ) setParams({ q: debouncedQ, t: tab }, { replace: true })
    else if (params.get('q')) setParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, tab])

  useEffect(() => {
    const qp = params.get('q') ?? ''
    if (qp && qp !== q) setQ(qp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const { data: dishResults, isLoading: dishLoading } = useQuery({
    queryKey: ['search-dishes', debouncedQ],
    queryFn: () => searchDishes(debouncedQ),
    enabled: debouncedQ.length > 0,
  })

  const { data: restResults, isLoading: restLoading } = useQuery({
    queryKey: ['search-restaurants', debouncedQ],
    queryFn: () => searchRestaurants(debouncedQ, 20),
    enabled: debouncedQ.length > 0,
  })

  const search = (s: string) => setQ(s)

  return (
    <div className="pb-32">
      <Header />

      <div className="max-w-md mx-auto px-4 pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-lime-500 font-bold">חיפוש</p>
        <h1 className="display-xl text-4xl text-ink-100 mt-2 mb-5">
          איפה <br /> ה<span className="text-lime-500">{q || 'מנה'}</span> הכי טובה?
        </h1>

        <div className="bg-ink-800 border border-ink-700 rounded-full flex items-center p-1.5 gap-2">
          <span className="text-lime-500 text-lg pr-3">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="הקלד שם של מנה או מסעדה..."
            className="flex-1 bg-transparent text-ink-100 placeholder-ink-400 focus:outline-none text-sm"
            autoFocus
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="text-ink-400 px-2 hover:text-ink-100"
              aria-label="נקה"
            >
              ×
            </button>
          )}
        </div>

        {!debouncedQ && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mb-3">מנות פופולריות</p>
            <div className="flex gap-2 flex-wrap">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => search(s)}
                  className="text-xs font-bold text-ink-200 bg-ink-800 border border-ink-700 hover:border-lime-500/40 px-3 py-2 rounded-full"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {debouncedQ && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mt-6 mb-4 bg-ink-800 border border-ink-700 rounded-full p-1">
              {([
                { key: 'dishes', label: 'מנות', count: dishResults?.length },
                { key: 'restaurants', label: 'מסעדות', count: restResults?.length },
              ] as const).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-colors ${
                    tab === t.key
                      ? 'bg-lime-500 text-ink-900'
                      : 'text-ink-300 hover:text-ink-100'
                  }`}
                >
                  {t.label}
                  {t.count !== undefined && (
                    <span className={`mr-1 tabular ${tab === t.key ? 'text-ink-700' : 'text-ink-500'}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {tab === 'dishes' && (
              <div className="grid gap-3">
                {dishLoading && <p className="text-center text-ink-400 py-6">מחפש...</p>}
                {!dishLoading && dishResults?.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-ink-400">לא נמצאה מנה בשם "{debouncedQ}"</p>
                    <Link
                      to="/add/dish"
                      className="inline-block mt-3 text-xs text-lime-500 font-bold uppercase tracking-wider underline"
                    >
                      + הוסף אותה בעצמך
                    </Link>
                  </div>
                )}
                {dishResults?.map((dish, i) => (
                  <div key={dish.id} className="flex gap-3 items-stretch">
                    <div className="flex items-center justify-center w-8 shrink-0 text-2xl font-black text-ink-500 tabular">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0"><DishCard dish={dish} showRestaurant /></div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'restaurants' && (
              <div className="grid gap-3">
                {restLoading && <p className="text-center text-ink-400 py-6">מחפש...</p>}
                {!restLoading && restResults?.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-ink-400">לא נמצאה מסעדה בשם "{debouncedQ}"</p>
                    <Link
                      to="/add/restaurant"
                      className="inline-block mt-3 text-xs text-lime-500 font-bold uppercase tracking-wider underline"
                    >
                      + הוסף אותה בעצמך
                    </Link>
                  </div>
                )}
                {restResults?.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
