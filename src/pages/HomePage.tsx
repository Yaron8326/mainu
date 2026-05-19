import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import RestaurantCard from '../components/RestaurantCard'
import DishCard from '../components/DishCard'
import { listRestaurants, listTopDishes } from '../lib/queries'

export default function HomePage() {
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: listRestaurants,
  })

  const { data: topDishes } = useQuery({
    queryKey: ['top-dishes'],
    queryFn: () => listTopDishes(10),
  })

  return (
    <div className="pb-32">
      <Header />

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* HERO - centered */}
        <div className="mb-7 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lime-500 font-bold">לא מסעדות · מנות</p>
          <h1 className="display-xl text-5xl text-ink-100 mt-3">
            מה כדאי
            <br /> <span className="text-lime-500">להזמין</span> הערב?
          </h1>
          <p className="text-ink-400 text-sm mt-4 max-w-xs mx-auto">
            דירוג ברמת המנה. רק האוכל קובע.
          </p>
        </div>

        {/* SEARCH CTA */}
        <Link
          to="/search"
          className="flex items-center justify-center gap-3 w-full bg-ink-800 border border-ink-700 rounded-full px-5 py-3 text-ink-400 mb-8 hover:border-lime-500/40 transition-colors"
        >
          <span className="text-lime-500 text-lg">⌕</span>
          <span className="text-sm">חפש מנה ספציפית...</span>
        </Link>

        {/* TOP 10 DISHES - Horizontal scroll */}
        {topDishes && topDishes.length > 0 && (
          <section className="mb-8 -mx-4">
            <div className="px-4 flex items-end justify-between mb-3">
              <h2 className="display-xl text-2xl text-ink-100">
                TOP <span className="text-lime-500">10</span>
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">המנות הכי טובות</span>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-2">
              {topDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} showRestaurant variant="square" />
              ))}
            </div>
          </section>
        )}

        {/* RESTAURANTS - grid */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="display-xl text-2xl text-ink-100">מסעדות</h2>
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">לפי דירוג ממוצע</span>
          </div>

          {isLoading && (
            <p className="text-sm text-ink-400 text-center py-8">טוען...</p>
          )}

          {restaurants?.length === 0 && (
            <div className="text-center py-12 bg-ink-800 rounded-2xl border border-ink-700">
              <p className="text-ink-400">אין עדיין מסעדות</p>
            </div>
          )}

          <div className="grid gap-4">
            {restaurants?.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} rank={i + 1} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
