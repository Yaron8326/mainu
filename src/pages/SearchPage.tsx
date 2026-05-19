import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import DishCard from '../components/DishCard'
import { searchDishes } from '../lib/queries'

const SUGGESTIONS = ['פסטה', 'המבורגר', 'סושי', 'חומוס', 'ראמן', 'פלאפל']

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [submitted, setSubmitted] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['search', submitted],
    queryFn: () => searchDishes(submitted),
    enabled: submitted.length > 0,
  })

  const search = (s: string) => {
    setQ(s)
    setSubmitted(s.trim())
  }

  return (
    <div className="pb-32">
      <Header />

      <div className="max-w-md mx-auto px-4 pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-lime-500 font-bold">חיפוש מנה</p>
        <h1 className="display-xl text-4xl text-ink-100 mt-2 mb-5">
          איפה <br /> ה<span className="text-lime-500">{q || 'מנה'}</span> הכי טובה?
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(q.trim())
          }}
          className="bg-ink-800 border border-ink-700 rounded-full flex items-center p-1.5 gap-2"
        >
          <span className="text-lime-500 text-lg pr-3">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="הקלד שם של מנה..."
            className="flex-1 bg-transparent text-ink-100 placeholder-ink-400 focus:outline-none text-sm"
            autoFocus
          />
          <button type="submit" className="bg-lime-500 hover:bg-lime-400 text-ink-900 px-5 py-2 rounded-full font-black text-sm uppercase tracking-wider">
            חפש
          </button>
        </form>

        {!submitted && (
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

        <div className="mt-6 grid gap-3">
          {submitted && isLoading && <p className="text-center text-ink-400 py-6">מחפש...</p>}
          {submitted && data && data.length === 0 && (
            <p className="text-center text-ink-400 py-6">לא נמצאו מנות בשם "{submitted}"</p>
          )}
          {data?.map((dish, i) => (
            <div key={dish.id} className="flex gap-3 items-stretch">
              <div className="flex items-center justify-center w-8 shrink-0 text-2xl font-black text-ink-500 tabular">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0"><DishCard dish={dish} showRestaurant /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
