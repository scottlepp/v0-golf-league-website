import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold text-green-900">
              PDP Admin
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin/weeks" className="text-gray-700 hover:text-green-900">Weeks</Link>
              <Link href="/admin/teams" className="text-gray-700 hover:text-green-900">Teams</Link>
              <Link href="/admin/schedule" className="text-gray-700 hover:text-green-900">Schedule</Link>
              <Link href="/admin/scores" className="text-gray-700 hover:text-green-900">Scores</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">{session.user.email}</span>
            <Link href="/" className="text-green-900 hover:underline">Site</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
