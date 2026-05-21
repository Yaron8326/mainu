import type { Hours } from '../types/db'

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

interface Props {
  hours: Hours | null | undefined
}

// Computes whether the restaurant is open right now based on Asia/Jerusalem local time.
function isOpenNow(hours: Hours | null | undefined): boolean | null {
  if (!hours) return null
  const now = new Date()
  // Convert "now" to Israel time string parts
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  })
  const parts = fmt.formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const dowName = get('weekday') // Mon, Tue, ...
  const dowIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dowName)
  if (dowIdx < 0) return null
  const time = `${get('hour')}:${get('minute')}`
  const slots = hours[String(dowIdx) as keyof Hours]
  if (!slots || slots.length === 0) return false
  return slots.some((s) => time >= s.open && time <= s.close)
}

export default function RestaurantHours({ hours }: Props) {
  const open = isOpenNow(hours)

  return (
    <div className="bg-ink-800 border border-ink-700 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">שעות פתיחה</h3>
        {open !== null && (
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
              open
                ? 'text-lime-500 bg-lime-500/10 border border-lime-500/30'
                : 'text-chili-500 bg-chili-500/10 border border-chili-500/30'
            }`}
          >
            {open ? '● פתוח עכשיו' : '● סגור'}
          </span>
        )}
      </div>
      {hours ? (
        <ul className="space-y-1 text-sm">
          {DAYS_HE.map((dayName, i) => {
            const slots = hours[String(i) as keyof Hours]
            return (
              <li key={i} className="flex justify-between gap-2 tabular">
                <span className="text-ink-300">{dayName}</span>
                <span className="text-ink-100">
                  {slots && slots.length > 0
                    ? slots.map((s) => `${s.open}–${s.close}`).join(', ')
                    : <span className="text-ink-500">סגור</span>}
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-ink-500">שעות לא צוינו</p>
      )}
    </div>
  )
}
