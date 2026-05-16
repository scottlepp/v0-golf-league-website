import sql from '@/lib/db'
import Link from 'next/link'
import { updateMatch, deleteMatch, createMatch } from './actions'

export const dynamic = 'force-dynamic'

interface Week {
  id: number
  week_number: number
}
interface Team {
  id: number
  name: string
}
interface Match {
  id: number
  week_id: number
  team1_id: number
  team2_id: number
  tee_time: string
}

export default async function ScheduleAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const { week } = await searchParams

  const weeks = (await sql`SELECT id, week_number FROM weeks ORDER BY week_number ASC`) as unknown as Week[]
  const teams = (await sql`SELECT id, name FROM teams ORDER BY name ASC`) as unknown as Team[]

  const selectedWeekId = week ? Number(week) : weeks[0]?.id
  const matches = selectedWeekId
    ? ((await sql`SELECT * FROM schedule WHERE week_id = ${selectedWeekId} ORDER BY tee_time ASC`) as unknown as Match[])
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Schedule</h1>

      <div className="flex gap-2 flex-wrap">
        {weeks.map((w) => (
          <Link
            key={w.id}
            href={`/admin/schedule?week=${w.id}`}
            className={`px-3 py-1 rounded text-sm ${
              w.id === selectedWeekId
                ? 'bg-green-700 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week {w.week_number}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {matches.map((m) => (
          <div key={m.id} className="rounded-lg border bg-white p-3 flex flex-wrap gap-2 items-end">
            <form action={updateMatch} className="flex flex-wrap gap-2 items-end flex-1">
              <input type="hidden" name="id" value={m.id} />
              <label className="flex flex-col text-xs text-gray-600">
                Tee time
                <input
                  name="tee_time"
                  defaultValue={m.tee_time}
                  className="border rounded px-2 py-1 w-28 text-sm"
                  required
                />
              </label>
              <label className="flex flex-col text-xs text-gray-600">
                Team 1
                <select name="team1_id" defaultValue={m.team1_id} className="border rounded px-2 py-1 text-sm">
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-xs text-gray-600">
                Team 2
                <select name="team2_id" defaultValue={m.team2_id} className="border rounded px-2 py-1 text-sm">
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </label>
              <button type="submit" className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                Save
              </button>
            </form>
            <form action={deleteMatch}>
              <input type="hidden" name="id" value={m.id} />
              <button type="submit" className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100">
                Delete
              </button>
            </form>
          </div>
        ))}
        {matches.length === 0 && (
          <p className="text-gray-500 text-sm">No matches in this week.</p>
        )}
      </div>

      {selectedWeekId && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Add match</h2>
          <form action={createMatch} className="flex flex-wrap gap-2 items-end bg-white border rounded-lg p-4">
            <input type="hidden" name="week_id" value={selectedWeekId} />
            <label className="flex flex-col text-xs text-gray-600">
              Tee time
              <input name="tee_time" required className="border rounded px-2 py-1 w-28 text-sm" placeholder="4:00 PM" />
            </label>
            <label className="flex flex-col text-xs text-gray-600">
              Team 1
              <select name="team1_id" className="border rounded px-2 py-1 text-sm" required>
                <option value="">Select…</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-xs text-gray-600">
              Team 2
              <select name="team2_id" className="border rounded px-2 py-1 text-sm" required>
                <option value="">Select…</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="bg-green-700 text-white text-sm px-4 py-2 rounded hover:bg-green-800">
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
