import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUser, demoSignIn } from '../hooks/useUser'
import { isDemo } from '../lib/mockData'
import { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import EmailAuthForm from '../components/EmailAuthForm'

export default function AuthPage() {
  const { user } = useUser()
  const nav = useNavigate()
  const demo = isDemo()
  const [emailOpen, setEmailOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    if (user) nav('/', { replace: true })
  }, [user, nav])

  const signInGoogle = async () => {
    setLoading('google')
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      setError(error.message)
      setLoading(null)
    }
  }

  const signInGuest = async () => {
    setLoading('guest')
    setError(null)
    if (demo) {
      demoSignIn()
      nav('/', { replace: true })
      return
    }
    // Real Supabase anonymous sign-in
    const { error } = await supabase.auth.signInAnonymously()
    if (error) {
      setError(
        error.message.includes('Anonymous')
          ? 'מצב אורח עוד לא הופעל בשרת. נסה להרשם עם אימייל.'
          : error.message,
      )
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-ink-900 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -bottom-20 -left-20 text-[28rem] font-black text-lime-500/5 leading-none tabular pointer-events-none select-none"
      >
        4.9
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-md w-full mx-auto relative">
        <Logo size={56} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-500 font-bold mt-5">MainU 1.0</p>
        <h1 className="display-xl text-5xl text-ink-100 mt-3">
          דרג מנות.
          <br /> <span className="text-lime-500">גלה</span> טעמים.
        </h1>
        <p className="text-ink-400 mt-4 max-w-xs text-sm">
          האפליקציה היחידה שמדרגת מנות ספציפיות, לא מסעדות.
        </p>

        {error && (
          <p className="mt-4 text-sm text-chili-500 bg-chili-500/10 border border-chili-500/30 rounded-lg p-2 max-w-xs">
            {error}
          </p>
        )}

        <div className="mt-8 w-full space-y-3">
          <button
            onClick={signInGoogle}
            disabled={loading !== null}
            className="w-full bg-ink-100 hover:bg-ink-200 text-ink-900 rounded-full px-6 py-4 font-black uppercase tracking-wider text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.27h2.92c1.71-1.57 2.69-3.89 2.69-6.63z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.16.29-1.71V4.96H.96A8.997 8.997 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z" fill="#FBBC05"/>
              <path d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A8.997 8.997 0 0 0 .96 4.96L3.97 7.3C4.68 5.18 6.66 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span>{loading === 'google' ? 'מעביר...' : 'התחבר עם Google'}</span>
          </button>

          <button
            onClick={() => setEmailOpen(true)}
            disabled={loading !== null}
            className="w-full bg-lime-500 hover:bg-lime-400 text-ink-900 rounded-full px-6 py-4 font-black uppercase tracking-wider text-sm shadow-glow-lime disabled:opacity-50"
          >
            הרשם עם אימייל
          </button>

          <button
            onClick={signInGuest}
            disabled={loading !== null}
            className="w-full bg-transparent text-ink-300 hover:text-ink-100 rounded-full px-6 py-3 font-bold uppercase tracking-wider text-xs border border-ink-600 disabled:opacity-50"
          >
            {loading === 'guest' ? 'נכנס...' : 'המשך כאורח'}
          </button>
        </div>

        <p className="mt-6 text-[10px] text-ink-500 max-w-xs">
          כאורח הדירוגים שלך יישמרו זמנית. הירשם בכל שלב כדי לשמור אותם לתמיד.
        </p>
      </div>

      {emailOpen && (
        <EmailAuthForm
          onClose={() => setEmailOpen(false)}
          onSuccess={() => {
            setEmailOpen(false)
            nav('/', { replace: true })
          }}
        />
      )}
    </div>
  )
}
