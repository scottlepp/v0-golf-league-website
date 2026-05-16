import sql from '@/lib/db'
import { createTeam, updateTeam, deleteTeam } from './actions'

export const dynamic = 'force-dynamic'

interface Team {
  id: number
  name: string
  player1_name: string
  player2_name: string
}

export default async function TeamsAdminPage() {
  const teams = (await sql`SELECT * FROM teams ORDER BY name ASC`) as unknown as Team[]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Teams</h1>
        <div className="space-y-2">
          {teams.map((t) => (
            <div key={t.id} className="rounded-lg border bg-white p-3 flex flex-wrap gap-2 items-end">
              <form action={updateTeam} className="flex flex-wrap gap-2 items-end flex-1">
                <input type="hidden" name="id" value={t.id} />
                <label className="flex flex-col text-xs text-gray-600">
                  Team
                  <input
                    name="name"
                    defaultValue={t.name}
                    className="border rounded px-2 py-1 w-44 text-sm"
                    required
                  />
                </label>
                <label className="flex flex-col text-xs text-gray-600">
                  Player 1
                  <input
                    name="player1_name"
                    defaultValue={t.player1_name}
                    className="border rounded px-2 py-1 w-40 text-sm"
                    required
                  />
                </label>
                <label className="flex flex-col text-xs text-gray-600">
                  Player 2
                  <input
                    name="player2_name"
                    defaultValue={t.player2_name}
                    className="border rounded px-2 py-1 w-40 text-sm"
                    required
                  />
                </label>
                <button type="submit" className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                  Save
                </button>
              </form>
              <form action={deleteTeam}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100">
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Add team</h2>
        <form action={createTeam} className="flex flex-wrap gap-2 items-end bg-white border rounded-lg p-4">
          <label className="flex flex-col text-xs text-gray-600">
            Team name
            <input name="name" required className="border rounded px-2 py-1 w-48 text-sm" />
          </label>
          <label className="flex flex-col text-xs text-gray-600">
            Player 1
            <input name="player1_name" required className="border rounded px-2 py-1 w-40 text-sm" />
          </label>
          <label className="flex flex-col text-xs text-gray-600">
            Player 2
            <input name="player2_name" required className="border rounded px-2 py-1 w-40 text-sm" />
          </label>
          <button type="submit" className="bg-green-700 text-white text-sm px-4 py-2 rounded hover:bg-green-800">
            Add
          </button>
        </form>
      </div>
    </div>
  )
}
