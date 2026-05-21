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

interface Step {
  glyph: string
  title: React.ReactNode
  body: string
}

const STEPS: Step[] = [
  {
    glyph: '🍽️',
    title: (
      <>
        דרג <span className="text-lime-500">מנות</span>,<br />
        לא מסעדות
      </>
    ),
    body: 'מסעדה אחת יכולה להגיש המבורגר מעולה ופסטה גרועה. אצלנו, כל מנה מקבלת דירוג בנפרד.',
  },
  {
    glyph: '⌕',
    title: (
      <>
        חפש <span className="text-lime-500">מנה</span><br />
        ספציפית
      </>
    ),
    body: 'במקום "איזו מסעדה איטלקית הכי טובה?", שאל "איפה הקרבונרה הכי טובה?". מצא מנה - לא מסעדה.',
  },
  {
    glyph: '✦',
    title: (
      <>
        בנה את <span className="text-lime-500">הטעם</span><br />
        שלך
      </>
    ),
    body: 'כל דירוג שלך עוזר לזכור איפה אכלת מה, ומציע מנות חדשות לאנשים עם טעם דומה לשלך.',
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
    <div className="fixed inset-0 bg-ink-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 shrink-0">
        <Logo size={28} />
        {!isLast && (
          <button
            onClick={finish}
            className="text-xs text-ink-400 hover:text-ink-200 uppercase tracking-wider font-bold px-3 py-2"
          >
            דלג
          </button>
        )}
        {isLast && <div className="w-12" />}
      </div>

      {/* Content - vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-7xl sm:text-8xl mb-10 shadow-glow-lime">
          {current.glyph}
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-500 font-bold mb-3">
          {step + 1} מתוך {STEPS.length}
        </p>

        <h1 className="display-xl text-4xl sm:text-5xl text-ink-100 leading-[1.05]">
          {current.title}
        </h1>

        <p className="text-ink-300 mt-6 max-w-xs text-base leading-relaxed">
          {current.body}
        </p>
      </div>

      {/* Footer with dots + button */}
      <div className="px-6 pb-8 sm:pb-10 shrink-0">
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`עבור לשלב ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'bg-lime-500 w-10' : 'bg-ink-600 hover:bg-ink-500 w-2'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full max-w-md mx-auto block bg-lime-500 hover:bg-lime-400 active:scale-95 text-ink-900 py-4 rounded-full font-black uppercase tracking-wider text-sm shadow-glow-lime transition-all"
        >
          {isLast ? 'בואו נתחיל ←' : 'הבא ←'}
        </button>
      </div>
    </div>
  )
}
