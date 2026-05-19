import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import RestaurantCard from '../components/RestaurantCard'
import DishCard from '../components/DishCard'
import { listRestaurants, listTopDishes, listDishesByKeyword } from '../lib/queries'

// Cuisine-style browse tiles — each one runs a name-based search ("המבורגר", "פסטה"…)
// and surfaces the top-rated matching dish across all restaurants.
const CUISINES = [
  { key: 'burger',   label: 'המבורגר',  emoji: '🍔', keyword: 'בורגר' },
  { key: 'pasta',    label: 'פסטה',     emoji: '🍝', keyword: 'פסטה' },
  { key: 'sushi',    label: 'סושי',     emoji: '🍣', keyword: 'סושי' },
  { key: 'pizza',    label: 'פיצה',     emoji: '🍕', keyword: 'פיצה' },
  { key: 'humus',    label: 'חומוס',    emoji: '🥣', keyword: 'חומוס' },
  { key: 'ramen',    label: 'ראמן',     emoji: '🍜', keyword: 'ראמן' },
  { key: 'falafel',  label: 'פלאפל',    emoji: '🧆', keyword: 'פלאפל' },
  { key: 'shawarma', label: 'שווארמה',  emoji: '🌯', keyword: 'שווארמה' },
]

function CuisineSpotlight({ cuisine }: { cuisine: typeof CUISINES[number] }) {
  const { data } = useQuery({
    queryKey: ['dishes-by-keyword', cuisine.keyword],
    queryFn: () => listDishesByKeyword(cuisine.keyword, 3),
  })

  if (!data || data.length === 0) return null

  return (
    <section className="-mx-4 mb-8">
      <div className="px-4 flex items-end justify-between mb-3">
        <h2 className="display-xl text-2xl text-ink-100">
          {cuisine.emoji} {cuisine.label}
        </h2>
        <Link
          to={`/search?q=${encodeURIComponent(cuisine.keyword)}`}
          className="text-[10px] uppercase tracking-wider text-lime-500 font-bold"
        >
          הכל ←
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-2">
        {data.map((dish) => (
          <DishCard key={dish.id} dish={dish} showRestaurant variant="square" />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { data: topDishes } = useQuery({
    queryKey: ['top-dishes'],
    queryFn: () => listTopDishes(10),
  })

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: listRestaurants,
  })

  return (
    <div className="pb-32">
      <Header />

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* HERO */}
        <div className="mb-7 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lime-500 font-bold">5 מנות. 5 כוכבים.</p>
          <h1 className="display-xl text-5xl text-ink-100 mt-3">
            מה כדאי
            <br /> <span className="text-lime-500">להזמין</span> הערב?
          </h1>
          <p className="text-ink-400 text-sm mt-4 max-w-xs mx-auto">
            לא דירוג מסעדה - <strong className="text-ink-200">דירוג של המנה</strong>.
          </p>
        </div>

        {/* SEARCH */}
        <Link
          to="/search"
          className="flex items-center justify-center gap-3 w-full bg-ink-800 border border-ink-700 rounded-full px-5 py-3 text-ink-400 mb-8 hover:border-lime-500/40 transition-colors"
        >
          <span className="text-lime-500 text-lg">⌕</span>
          <span className="text-sm">מה אתה בא לאכול?</span>
        </Link>

        {/* 1. TOP 10 dishes - hero discovery */}
        {topDishes && topDishes.length > 0 && (
          <section className="mb-10 -mx-4">
            <div className="px-4 flex items-end justify-between mb-3">
              <h2 className="display-xl text-3xl text-ink-100">
                TOP <span className="text-lime-500">10</span>
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">
                המנות הכי טובות
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-2">
              {topDishes.map((dish, i) => (
                <div key={dish.id} className="relative">
                  <span className="absolute -top-1 -right-1 z-10 w-7 h-7 rounded-full bg-lime-500 text-ink-900 font-black text-xs flex items-center justify-center tabular shadow-glow-lime">
                    {i + 1}
                  </span>
                  <DishCard dish={dish} showRestaurant variant="square" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Cuisine browse — the "categories" the user wanted */}
        <h2 className="display-xl text-2xl text-ink-100 mb-3">לפי סוג מנה</h2>
        <div className="grid grid-cols-4 gap-2 mb-10">
          {CUISINES.map((c) => (
            <Link
              key={c.key}
              to={`/search?q=${encodeURIComponent(c.keyword)}`}
              className="aspect-square rounded-2xl bg-ink-800 border border-ink-700 hover:border-lime-500/40 flex flex-col items-center justify-center transition-colors"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="mt-1 text-[10px] text-ink-200 font-bold uppercase tracking-wider">{c.label}</span>
            </Link>
          ))}
        </div>

        {/* 3. One spotlight cuisine deep-dive (variety on the homepage) */}
        <CuisineSpotlight cuisine={CUISINES[0]} />
        <CuisineSpotlight cuisine={CUISINES[2]} />

        {/* 4. Restaurants — secondary, "if you're already at the place" */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-3">
            <h2 className="display-xl text-2xl text-ink-100">או לפי מקום</h2>
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">
              {restaurants?.length ?? 0} מסעדות
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {restaurants?.slice(0, 6).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
