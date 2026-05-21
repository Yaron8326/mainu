import type { User } from '@supabase/supabase-js'

// Emails treated as super-admin. Anything in this list can approve/reject submissions.
// Moving forward we'll migrate this to a `profiles.is_admin` column.
const ADMIN_EMAILS = [
  'yaronlevy1983@gmail.com',
]

export function isAdmin(user: User | null | undefined): boolean {
  if (!user?.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}
