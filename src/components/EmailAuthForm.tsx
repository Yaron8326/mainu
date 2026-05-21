import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'signin' | 'signup'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function EmailAuthForm({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: displayName.trim() || email.split('@')[0] },
          },
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      onSuccess()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-ink-800 border border-ink-700 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold">
              {mode === 'signup' ? 'הרשמה' : 'התחברות'}
            </p>
            <h2 className="display-xl text-2xl text-ink-100 mt-1">
              {mode === 'signup' ? 'יוצרים חשבון' : 'ברוך השב'}
            </h2>
          </div>
          <button onClick={onClose} className="text-ink-400 text-3xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">שם תצוגה</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="איך לקרוא לך?"
                className="mt-1 w-full bg-ink-900 border border-ink-700 rounded-xl p-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
              />
            </label>
          )}
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">אימייל</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              dir="ltr"
              className="mt-1 w-full bg-ink-900 border border-ink-700 rounded-xl p-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">סיסמה</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="לפחות 6 תווים"
              dir="ltr"
              className="mt-1 w-full bg-ink-900 border border-ink-700 rounded-xl p-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
            />
          </label>

          {error && (
            <p className="text-sm text-chili-500 bg-chili-500/10 border border-chili-500/30 rounded-lg p-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-400 text-ink-900 py-3 rounded-full font-black uppercase tracking-wider text-sm disabled:opacity-50 shadow-glow-lime"
          >
            {loading ? 'רגע...' : mode === 'signup' ? 'הירשם' : 'התחבר'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup')
              setError(null)
            }}
            className="w-full text-xs text-ink-400 hover:text-ink-200 underline"
          >
            {mode === 'signup' ? 'כבר יש לי חשבון' : 'אין לי חשבון - להרשמה'}
          </button>
        </form>
      </div>
    </div>
  )
}
