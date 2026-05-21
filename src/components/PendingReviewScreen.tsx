import { Link } from 'react-router-dom'

interface Props {
  type: 'restaurant' | 'dish'
  name: string
}

// Shown after a user submits a new restaurant or dish.
// Their submission is in 'pending' status — admin (Yaron) will approve via Supabase Studio.
export default function PendingReviewScreen({ type, name }: Props) {
  const noun = type === 'restaurant' ? 'המסעדה' : 'המנה'
  return (
    <div className="fixed inset-0 bg-ink-900 flex flex-col items-center justify-center text-center px-6 z-40">
      <div className="w-24 h-24 rounded-full bg-lime-500/10 border-2 border-lime-500/30 flex items-center justify-center animate-pop">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4ff00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-lime-500 font-bold mt-6 animate-fade-up">
        ממתין לאישור
      </p>
      <h1 className="display-xl text-3xl text-ink-100 mt-3 animate-fade-up max-w-xs">
        {noun} <span className="text-lime-500">"{name}"</span> נשלחה לבדיקה
      </h1>
      <p className="text-ink-300 text-sm mt-4 max-w-xs animate-fade-up leading-relaxed">
        כדי לשמור על איכות הנתונים, הנהל בודק כל הוספה לפני שהיא מופיעה לכל המשתמשים.
        בדרך כלל זה לוקח עד 24 שעות.
      </p>
      <Link
        to="/"
        className="mt-10 bg-lime-500 hover:bg-lime-400 text-ink-900 font-black py-4 px-8 rounded-full uppercase tracking-wider text-sm shadow-glow-lime"
      >
        חזרה לבית
      </Link>
    </div>
  )
}
