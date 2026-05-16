import { redirect } from 'next/navigation'
import { auth } from './server'

function getAdminEmails(): string[] {
  const raw =
    process.env.PDP_GOLF_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export async function requireAdmin() {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    redirect('/auth/sign-in?redirect=/admin')
  }

  const email = session.user.email?.toLowerCase()
  const admins = getAdminEmails()

  if (!email || !admins.includes(email)) {
    redirect('/')
  }

  return session
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}
