import { auth } from '@/lib/auth/server'
import { isAdmin } from '@/lib/auth/admin'
import { AppShell } from '@/components/pdp/app-shell'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: session } = await auth.getSession()
  const email = session?.user?.email ?? 'guest@pdpgolf'
  const admin = isAdmin(session?.user?.email)

  return <AppShell email={email} isAdmin={admin} />
}
