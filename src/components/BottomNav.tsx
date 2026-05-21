import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import AddSheet from './AddSheet'

interface NavItem {
  to: string
  label: string
  icon: string
}

const LEFT: NavItem[] = [
  { to: '/', label: 'עבורך', icon: '⌂' },
  { to: '/search', label: 'חיפוש', icon: '⌕' },
]

const RIGHT: NavItem[] = [
  { to: '/feed', label: 'עוקבים', icon: '◎' },
  { to: '/profile', label: 'אני', icon: '◉' },
]

function NavTab({ item, profileId }: { item: NavItem; profileId?: string }) {
  const to = item.to === '/profile' && profileId ? `/profile/${profileId}` : item.to
  return (
    <NavLink
      to={to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
          isActive ? 'text-lime-500' : 'text-ink-400 hover:text-ink-200'
        }`
      }
    >
      <span className="text-xl leading-none">{item.icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
    </NavLink>
  )
}

export default function BottomNav() {
  const { user } = useUser()
  const [addOpen, setAddOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-3 inset-x-0 z-30 px-3 pointer-events-none">
        <nav className="max-w-md mx-auto bg-ink-800/95 backdrop-blur-xl rounded-full border border-ink-600 pointer-events-auto shadow-2xl">
          <div className="grid grid-cols-5 items-center">
            {LEFT.map((item) => (
              <NavTab key={item.to} item={item} profileId={user?.id} />
            ))}

            <div className="flex items-center justify-center">
              <button
                onClick={() => setAddOpen(true)}
                aria-label="הוסף"
                className="w-14 h-14 -mt-7 rounded-full bg-lime-500 text-ink-900 font-black text-3xl leading-none shadow-glow-lime hover:bg-lime-400 active:scale-95 transition-all border-4 border-ink-900"
              >
                ＋
              </button>
            </div>

            {RIGHT.map((item) => (
              <NavTab key={item.to} item={item} profileId={user?.id} />
            ))}
          </div>
        </nav>
      </div>

      <AddSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}
