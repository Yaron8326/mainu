import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

const ONBOARDED_KEY = 'mainu_onboarded'

export function hasOnboarded(): boolean {
  return typeof window !== 'undefined' && localStorage.getItem(ONBOARDED_KEY) === '1'
}

export function markOnboarded() {
  localStorage.setItem(ONBOARDED_KEY, '1')
}

const STEPS = [
  {
    glyph: '🍽️',
    title: 'דרג מנות, לא מסעדות',
    body: 'מסעדה אחת יכולה לתת המבורגר מדהים ופסטה גרועה. אצלנו, כל מנה מקבלת דירוג בנפרד.',
  },
  {
    glyph: '⌕',
    title: 'חפש מנה ספציפית',
    body: 'במקום "איזו מסעדה איטלקית הכי טובה?" שאל "איפה הקרבונרה הכי טובה?". מצא את המנה שאתה רוצה, לא את המסעדה.',
  },
  {
    glyph: '✦',
    title: 'בנה את ההיסטוריה שלך',
    body: 'כל דירוג שלך עוזר לך לזכור איפה אכלת מה, ומציע למשתמשים עם טעם דומה מנות חדשות לטעום.',
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const nav = useNavigate()
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  const finish = () => {
    markOnboarded()
    nav('/auth', { replace: true })
  }

  const next = () => {
    if (isLast) finish()
    else setStep(step + 1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-900 p-6">
      <header className="flex items-center justify-between max-w-md mx-auto w-full">
        <Logo size={32} />
        {!isLast && (
          <button onClick={finish} className="text-xs text-ink-400 hover:text-ink-200 uppercase tracking-wider">
            דלג
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        <div className="w-32 h-32 rounded-3xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-7xl mb-8">
          {current.glyph}
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-500 font-bold">
          שלב {step + 1} מתוך {STEPS.length}
        </p>
        <h1 className="display-xl text-4xl text-ink-100 mt-3">{current.title}</h1>
        <p className="text-ink-300 mt-4 max-w-xs leading-relaxed">{current.body}</p>
      </main>

      <footer className="max-w-md mx-auto w-full">
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'bg-lime-500 w-8' : 'bg-ink-600 w-1.5'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full bg-lime-500 hover:bg-lime-400 text-ink-900 py-4 rounded-full font-black uppercase tracking-wider text-sm shadow-glow-lime"
        >
          {isLast ? 'בואו נתחיל' : 'הבא ←'}
        </button>
      </footer>
    </div>
  )
}
