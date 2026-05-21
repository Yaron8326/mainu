import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Header from '../components/Header'
import { createDish, searchRestaurants } from '../lib/queries'
import { useUser } from '../hooks/useUser'
import { CATEGORY_LABELS } from '../lib/gamification'
import type { Restaurant, DishCategory } from '../types/db'

type Step = 'restaurant' | 'details' | 'done'

const CATEGORIES: DishCategory[] = ['starters', 'mains', 'sides', 'desserts', 'drinks']

export default function AddDishPage() {
  const nav = useNavigate()
  const qc = useQueryClient()
  const { user } = useUser()

  const [step, setStep] = useState<Step>('restaurant')
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [search, setSearch] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<DishCategory>('mains')
  const [price, setPrice] = useState('')

  const { data: restaurants } = useQuery({
    queryKey: ['rest-search', search],
    queryFn: () => searchRestaurants(search, 8),
    enabled: step === 'restaurant',
  })

  const submit = useMutation({
    mutationFn: async () => {
      if (!restaurant) throw new Error('בחר מסעדה')
      if (!name.trim()) throw new Error('שם המנה חובה')
      return createDish({
        restaurant_id: restaurant.id,
        name: name.trim(),
        description: description.trim() || null,
        category,
        price: price ? Number(price) : null,
      })
    },
    onSuccess: (dish) => {
      qc.invalidateQueries({ queryKey: ['dishes', restaurant!.id] })
      qc.invalidateQueries({ queryKey: ['top-dishes'] })
      nav(`/dish/${dish.id}`, { replace: true })
    },
  })

  if (!user) {
    return (
      <div className="pb-32">
        <Header back />
        <div className="max-w-md mx-auto px-4 pt-10 text-center">
          <h1 className="display-xl text-3xl text-ink-100">צריך להתחבר</h1>
          <p className="text-ink-400 mt-3">כדי להוסיף מנה צריך לפתוח חשבון או להמשיך כאורח.</p>
          <button
            onClick={() => nav('/auth')}
            className="mt-6 bg-lime-500 hover:bg-lime-400 text-ink-900 font-black py-3 px-8 rounded-full uppercase tracking-wider text-sm shadow-glow-lime"
          >
            התחברות
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-32">
      <Header back />
      <div className="max-w-md mx-auto px-4 pt-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-500 font-bold">
          שלב {step === 'restaurant' ? '1' : '2'} מתוך 2
        </p>
        <h1 className="display-xl text-3xl text-ink-100 mt-2 mb-6">
          {step === 'restaurant' ? 'באיזו מסעדה?' : 'פרטי המנה'}
        </h1>

        {step === 'restaurant' && (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חפש מסעדה..."
              autoFocus
              className="w-full bg-ink-800 border border-ink-700 rounded-full px-5 py-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500 mb-4"
            />

            <div className="space-y-2">
              {restaurants?.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRestaurant(r)
                    setStep('details')
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-ink-800 border border-ink-700 hover:border-lime-500/40 rounded-xl text-right transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-ink-700 overflow-hidden shrink-0">
                    {r.cover_image_url ? (
                      <img src={r.cover_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🍴</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-ink-100 truncate">{r.name}</p>
                    {r.address && <p className="text-xs text-ink-400 truncate">{r.address}</p>}
                  </div>
                </button>
              ))}
              {restaurants && restaurants.length === 0 && (
                <p className="text-center text-ink-400 py-6">לא נמצאו מסעדות</p>
              )}
            </div>

            <Link
              to="/add/restaurant"
              className="mt-6 block text-center w-full bg-ink-800 border border-dashed border-ink-600 hover:border-lime-500/40 text-ink-200 rounded-2xl py-3 font-bold text-sm"
            >
              + הוסף מסעדה חדשה
            </Link>
          </>
        )}

        {step === 'details' && restaurant && (
          <>
            <div className="flex items-center gap-3 p-3 bg-ink-800 border border-ink-700 rounded-xl mb-6">
              <span className="text-xs text-ink-400 uppercase tracking-wider">מסעדה:</span>
              <span className="flex-1 font-black text-ink-100 truncate">{restaurant.name}</span>
              <button
                onClick={() => {
                  setRestaurant(null)
                  setStep('restaurant')
                }}
                className="text-xs text-lime-500 underline"
              >
                החלף
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit.mutate()
              }}
              className="space-y-4"
            >
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">שם המנה *</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="לדוגמה: פסטה עם פטריות"
                  required
                  autoFocus
                  className="mt-1 w-full bg-ink-800 border border-ink-700 rounded-xl p-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
                />
              </label>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">קטגוריה *</span>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`py-2 rounded-xl text-[11px] font-bold transition-colors ${
                        category === c
                          ? 'bg-lime-500 text-ink-900'
                          : 'bg-ink-800 text-ink-300 border border-ink-700'
                      }`}
                    >
                      {CATEGORY_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">מחיר (₪)</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="לדוגמה: 58"
                  min={0}
                  step="0.5"
                  className="mt-1 w-full bg-ink-800 border border-ink-700 rounded-xl p-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">תיאור</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  rows={3}
                  placeholder="רכיבים עיקריים, סגנון הכנה..."
                  className="mt-1 w-full bg-ink-800 border border-ink-700 rounded-xl p-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
                />
                <span className="text-[10px] text-ink-500 tabular">{description.length}/200</span>
              </label>

              {submit.isError && (
                <p className="text-sm text-chili-500 bg-chili-500/10 border border-chili-500/30 rounded-lg p-2">
                  {(submit.error as Error).message}
                </p>
              )}

              <button
                type="submit"
                disabled={submit.isPending || !name.trim()}
                className="w-full bg-lime-500 hover:bg-lime-400 text-ink-900 font-black py-4 rounded-full uppercase tracking-wider text-sm disabled:opacity-50 shadow-glow-lime"
              >
                {submit.isPending ? 'שומר...' : 'הוסף מנה'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
