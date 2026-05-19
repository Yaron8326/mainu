import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUser, demoSignIn } from '../hooks/useUser'
import { isDemo } from '../lib/mockData'
import { useEffect } from 'react'
import Logo from '../components/Logo'

export default function AuthPage() {
  const { user } = useUser()
  const nav = useNavigate()
  const demo = isDemo()

  useEffect(() => {
    if (user) nav('/', { replace: true })
  }, [user, nav])

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const signInDemo = () => {
    demoSignIn()
    nav('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-ink-900 relative overflow-hidden">
      {/* Big background number */}
      <div
        aria-hidden
        className="absolute -bottom-20 -left-20 text-[28rem] font-black text-lime-500/5 leading-none tabular pointer-events-none select-none"
      >
        4.9
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-md w-full mx-auto relative">
        <Logo size={64} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-500 font-bold mt-6">MainU 1.0</p>
        <h1 className="display-xl text-6xl text-ink-100 mt-3">
          רק <br /> <span className="text-lime-500">האוכל</span> <br /> קובע.
        </h1>
        <p className="text-ink-400 mt-5 max-w-xs">
          דירוג ברמת המנה, לא המסעדה. הספוטיפיי של האוכל - בלי שירות, בלי אווירה, רק המנה.
        </p>

        <div className="mt-10 w-full">
          {demo ? (
            <>
              <button
                onClick={signInDemo}
                className="w-full bg-lime-500 hover:bg-lime-400 text-ink-900 rounded-full px-6 py-4 font-black uppercase tracking-wider text-sm shadow-glow-lime"
              >
                כניסה למצב דמו ◂
              </button>
              <p className="mt-4 text-[10px] uppercase tracking-wider text-lime-500/80 bg-lime-500/5 border border-lime-500/20 px-3 py-2 rounded-lg text-center">
                מצב דמו · אין חיבור לשרת · נתונים בזיכרון הדפדפן
              </p>
            </>
          ) : (
            <button
              onClick={signInGoogle}
              className="w-full bg-ink-100 hover:bg-ink-200 text-ink-900 rounded-full px-6 py-4 font-black uppercase tracking-wider text-sm"
            >
              התחברות עם Google ◂
            </button>
          )}
        </div>
      </div>

      <p className="text-[10px] text-ink-500 text-center mt-10 relative">
        בהתחברות הדירוגים שלך מוצגים לציבור עם השם והאווטאר
      </p>
    </div>
  )
}
