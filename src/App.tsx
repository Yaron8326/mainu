import { Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import RestaurantPage from './pages/RestaurantPage'
import DishPage from './pages/DishPage'
import ProfilePage from './pages/ProfilePage'
import { useUser } from './hooks/useUser'

export default function App() {
  const { loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">טוען...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/dish/:id" element={<DishPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
