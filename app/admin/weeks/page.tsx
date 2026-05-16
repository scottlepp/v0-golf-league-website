import sql from '@/lib/db'
import { setCurrentWeek, toggleCompleted } from './actions'

export const dynamic = 'force-dynamic'

interface Week {
  id: number
  week_number: number
  start_date: string
  is_current: boolean
  is_completed: boolean
}

export default async function WeeksAdminPage() {
  const weeks = (await sql`SELECT * FROM weeks ORDER BY week_number ASC`) as unknown as Week[]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Weeks</h1>
      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-semibold">#</th>
              <th className="px-4 py-2 font-semibold">Start date</th>
              <th className="px-4 py-2 font-semibold">Current</th>
              <th className="px-4 py-2 font-semibold">Completed</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.id} className="border-t">
                <td className="px-4 py-2 font-mono">{w.week_number}</td>
                <td className="px-4 py-2">{new Date(w.start_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {w.is_current ? (
                    <span className="inline-block rounded bg-green-100 text-green-800 px-2 py-0.5 text-xs font-semibold">
                      Current
                    </span>
                  ) : (
                    <form action={setCurrentWeek}>
                      <input type="hidden" name="id" value={w.id} />
                      <button className="text-xs text-blue-600 hover:underline" type="submit">
                        Set current
                      </button>
                    </form>
                  )}
                </td>
                <td className="px-4 py-2">
                  <form action={toggleCompleted}>
                    <input type="hidden" name="id" value={w.id} />
                    <input type="hidden" name="completed" value={String(!w.is_completed)} />
                    <button
                      type="submit"
                      className={`text-xs px-2 py-0.5 rounded ${
                        w.is_completed
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {w.is_completed ? 'Completed' : 'Mark complete'}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
