import { Link } from 'react-router-dom'

interface Props {
  open: boolean
  onClose: () => void
}

const ACTIONS = [
  {
    to: '/add/dish',
    icon: '🍽️',
    title: 'הוסף מנה',
    body: 'מנה חדשה שעוד לא ראית במערכת',
  },
  {
    to: '/add/restaurant',
    icon: '🏛️',
    title: 'הוסף מסעדה',
    body: 'מסעדה חדשה שעדיין לא במאגר',
  },
  {
    to: '/search',
    icon: '⌕',
    title: 'דרג מנה קיימת',
    body: 'מצא מנה במאגר ודרג אותה',
  },
]

export default function AddSheet({ open, onClose }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-ink-800 border border-ink-700 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold">מה להוסיף?</p>
            <h2 className="display-xl text-2xl text-ink-100 mt-1">פעולה חדשה</h2>
          </div>
          <button onClick={onClose} className="text-ink-400 text-3xl leading-none">×</button>
        </div>
        <div className="space-y-3">
          {ACTIONS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              onClick={onClose}
              className="flex items-center gap-4 p-4 bg-ink-900 border border-ink-700 hover:border-lime-500/40 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-2xl shrink-0">
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-ink-100">{a.title}</h3>
                <p className="text-xs text-ink-400 mt-0.5">{a.body}</p>
              </div>
              <span className="text-ink-400 text-xl">‹</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
