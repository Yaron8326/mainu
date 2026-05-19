import { NavLink } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

const items = [
  { to: '/', label: 'בית', icon: '⌂' },
  { to: '/search', label: 'חיפוש', icon: '⌕' },
  { to: '/profile', label: 'אני', icon: '◉' },
]

export default function BottomNav() {
  const { user } = useUser()

  return (
    <div className="fixed bottom-4 inset-x-0 z-30 px-4 pointer-events-none">
      <nav className="max-w-md mx-auto bg-ink-800/95 backdrop-blur-xl rounded-full border border-ink-600 p-1.5 pointer-events-auto shadow-2xl">
        <div className="grid grid-cols-3">
          {items.map((item) => {
            const to = item.to === '/profile' && user ? `/profile/${user.id}` : item.to
            return (
              <NavLink
                key={item.to}
                to={to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 py-2.5 px-3 rounded-full transition-all ${
                    isActive
                      ? 'bg-lime-500 text-ink-900 font-black'
                      : 'text-ink-300 hover:text-ink-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="text-lg">{item.icon}</span>
                    {isActive && <span className="text-sm font-black uppercase tracking-wider">{item.label}</span>}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
