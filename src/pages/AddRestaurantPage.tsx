import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Header from '../components/Header'
import { createRestaurant } from '../lib/queries'
import { useUser } from '../hooks/useUser'
import PendingReviewScreen from '../components/PendingReviewScreen'

const CUISINE_OPTIONS = [
  'איטלקי', 'אמריקאי', 'אסייתי', 'יפני', 'סושי', 'ראמן', 'ים תיכוני',
  'ישראלי', 'חומוס', 'פלאפל', 'שווארמה', 'המבורגר', 'פיצה',
  'בריאות', 'בית קפה', 'מקסיקני', 'הודי', 'תאילנדי',
]

export default function AddRestaurantPage() {
  const nav = useNavigate()
  const qc = useQueryClient()
  const { user } = useUser()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isKosher, setIsKosher] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [submittedName, setSubmittedName] = useState<string | null>(null)

  const toggleTag = (t: string) => {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  }

  const submit = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error('שם המסעדה חובה')
      return createRestaurant({
        name: name.trim(),
        address: address.trim() || null,
        cuisine_tags: tags.length ? tags : null,
        is_kosher: isKosher,
        is_vegan_friendly: isVegan,
      })
    },
    onSuccess: (rest) => {
      qc.invalidateQueries({ queryKey: ['restaurants'] })
      // Show "pending review" screen instead of jumping to the restaurant page.
      // The restaurant won't be visible to other users until admin approval.
      setSubmittedName(rest.name)
    },
  })

  if (submittedName) {
    return <PendingReviewScreen type="restaurant" name={submittedName} />
  }

  if (!user) {
    return (
      <div className="pb-32">
        <Header back />
        <div className="max-w-md mx-auto px-4 pt-10 text-center">
          <h1 className="display-xl text-3xl text-ink-100">צריך להתחבר</h1>
          <p className="text-ink-400 mt-3">כדי להוסיף מסעדה צריך לפתוח חשבון או להמשיך כאורח.</p>
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
        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-500 font-bold">הוספה למאגר</p>
        <h1 className="display-xl text-3xl text-ink-100 mt-2 mb-6">מסעדה חדשה</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit.mutate()
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">שם המסעדה *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: פסטה בסטה"
              required
              className="mt-1 w-full bg-ink-800 border border-ink-700 rounded-xl p-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
            />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">כתובת</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="דיזנגוף 150, תל אביב"
              className="mt-1 w-full bg-ink-800 border border-ink-700 rounded-xl p-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
            />
          </label>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">קטגוריות (בחר ככל שמתאים)</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                    tags.includes(t)
                      ? 'bg-lime-500 text-ink-900 border-lime-500'
                      : 'bg-ink-800 text-ink-200 border-ink-700 hover:border-lime-500/40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsKosher(!isKosher)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                isKosher
                  ? 'bg-lime-500 text-ink-900'
                  : 'bg-ink-800 text-ink-300 border border-ink-700'
              }`}
            >
              {isKosher ? '✓ ' : ''}כשר
            </button>
            <button
              type="button"
              onClick={() => setIsVegan(!isVegan)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                isVegan
                  ? 'bg-lime-500 text-ink-900'
                  : 'bg-ink-800 text-ink-300 border border-ink-700'
              }`}
            >
              {isVegan ? '✓ ' : ''}טבעוני
            </button>
          </div>

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
            {submit.isPending ? 'שומר...' : 'הוסף מסעדה'}
          </button>
        </form>
      </div>
    </div>
  )
}
