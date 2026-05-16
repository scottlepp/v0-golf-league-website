import Link from 'next/link'

export default function AdminHome() {
  const sections = [
    { href: '/admin/weeks', title: 'Weeks', desc: 'Mark current and completed weeks.' },
    { href: '/admin/teams', title: 'Teams', desc: 'Create, edit, and delete teams.' },
    { href: '/admin/schedule', title: 'Schedule', desc: 'Edit matchups and tee times.' },
    { href: '/admin/scores', title: 'Scores', desc: 'Edit or delete submitted scores.' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block rounded-lg border bg-white p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-green-900">{s.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
