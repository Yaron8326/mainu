import { Link } from 'react-router-dom'
import Logo from './Logo'

interface Props {
  title?: string
  back?: boolean
  transparent?: boolean
}

export default function Header({ title, back, transparent }: Props) {
  const bg = transparent ? 'bg-transparent' : 'bg-ink-900/85 backdrop-blur-xl border-b border-ink-700'
  return (
    <header className={`sticky top-0 z-20 ${bg}`}>
      <div className="max-w-md mx-auto h-14 flex items-center justify-between px-4">
        {back ? (
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 -mr-2 flex items-center justify-center text-2xl text-ink-100"
            aria-label="חזרה"
          >
            ‹
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-black text-lg tracking-tight text-ink-100">MainU</span>
          </Link>
        )}
        {title && <h1 className="font-black text-ink-100 truncate uppercase tracking-wider text-sm">{title}</h1>}
        <div className="w-8" />
      </div>
    </header>
  )
}
