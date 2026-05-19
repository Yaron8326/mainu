import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { isDemo, MOCK_USER_ID } from '../lib/mockData'

const DEMO_KEY = 'mainu_demo_signed_in'

function getDemoUser(): User | null {
  if (typeof window === 'undefined') return null
  if (localStorage.getItem(DEMO_KEY) !== '1') return null
  return {
    id: MOCK_USER_ID,
    app_metadata: {},
    user_metadata: { full_name: 'ירון לוי (דמו)' },
    aud: 'authenticated',
    created_at: '2025-01-01T00:00:00Z',
  } as unknown as User
}

export function demoSignIn() {
  localStorage.setItem(DEMO_KEY, '1')
  window.dispatchEvent(new Event('mainu-demo-auth'))
}

export function demoSignOut() {
  localStorage.removeItem(DEMO_KEY)
  window.dispatchEvent(new Event('mainu-demo-auth'))
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo()) {
      setUser(getDemoUser())
      setLoading(false)
      const onChange = () => setUser(getDemoUser())
      window.addEventListener('mainu-demo-auth', onChange)
      return () => window.removeEventListener('mainu-demo-auth', onChange)
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return { user, loading }
}
