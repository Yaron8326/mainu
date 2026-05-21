import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import RestaurantPage from './pages/RestaurantPage'
import DishPage from './pages/DishPage'
import ProfilePage from './pages/ProfilePage'
import FeedPage from './pages/FeedPage'
import AddRestaurantPage from './pages/AddRestaurantPage'
import AddDishPage from './pages/AddDishPage'
import OnboardingPage, { hasOnboarded } from './pages/OnboardingPage'
import { useUser } from './hooks/useUser'

// Routes where the floating bottom nav must not appear (full-screen flows).
const NAV_HIDDEN_ROUTES = new Set(['/onboarding', '/auth'])

export default function App() {
  const { loading, user } = useUser()
  const loc = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-400">טוען...</p>
      </div>
    )
  }

  // Route a never-onboarded, never-signed-in visitor through onboarding first.
  if (!user && !hasOnboarded() && !NAV_HIDDEN_ROUTES.has(loc.pathname)) {
    return <Navigate to="/onboarding" replace />
  }

  const showNav = !NAV_HIDDEN_ROUTES.has(loc.pathname)

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/add/restaurant" element={<AddRestaurantPage />} />
        <Route path="/add/dish" element={<AddDishPage />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/dish/:id" element={<DishPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  )
}
