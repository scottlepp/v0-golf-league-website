import sql from '@/lib/db'
import Link from 'next/link'
import { updateScore, deleteScore } from './actions'

export const dynamic = 'force-dynamic'

interface Week {
  id: number
  week_number: number
}
interface ScoreRow {
  id: number
  week_id: number
  team_id: number
  player1_score: number
  player2_score: number
  total_score: number
  team_name: string
  submitted_at: string
}

export default async function ScoresAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const { week } = await searchParams

  const weeks = (await sql`SELECT id, week_number FROM weeks ORDER BY week_number ASC`) as unknown as Week[]
  const selectedWeekId = week ? Number(week) : weeks[0]?.id

  const scores = selectedWeekId
    ? ((await sql`
        SELECT s.id, s.week_id, s.team_id, s.player1_score, s.player2_score, s.total_score, s.submitted_at, t.name AS team_name
        FROM score_submissions s
        JOIN teams t ON s.team_id = t.id
        WHERE s.week_id = ${selectedWeekId}
        ORDER BY s.total_score ASC
      `) as unknown as ScoreRow[])
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scores</h1>

      <div className="flex gap-2 flex-wrap">
        {weeks.map((w) => (
          <Link
            key={w.id}
            href={`/admin/scores?week=${w.id}`}
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
        {scores.map((s) => (
          <div key={s.id} className="rounded-lg border bg-white p-3 flex flex-wrap gap-2 items-end">
            <form action={updateScore} className="flex flex-wrap gap-2 items-end flex-1">
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="week_id" value={s.week_id} />
              <div className="flex flex-col text-xs text-gray-600">
                <span>Team</span>
                <span className="border rounded px-2 py-1 w-44 text-sm bg-gray-50">{s.team_name}</span>
              </div>
              <label className="flex flex-col text-xs text-gray-600">
                Player 1
                <input
                  type="number"
                  name="player1_score"
                  defaultValue={s.player1_score}
                  className="border rounded px-2 py-1 w-24 text-sm"
                  min={0}
                  required
                />
              </label>
              <label className="flex flex-col text-xs text-gray-600">
                Player 2
                <input
                  type="number"
                  name="player2_score"
                  defaultValue={s.player2_score}
                  className="border rounded px-2 py-1 w-24 text-sm"
                  min={0}
                  required
                />
              </label>
              <div className="flex flex-col text-xs text-gray-600">
                <span>Total</span>
                <span className="border rounded px-2 py-1 w-20 text-sm bg-gray-50 font-mono">{s.total_score}</span>
              </div>
              <button type="submit" className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                Save
              </button>
            </form>
            <form action={deleteScore}>
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="week_id" value={s.week_id} />
              <button type="submit" className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100">
                Delete
              </button>
            </form>
          </div>
        ))}
        {scores.length === 0 && (
          <p className="text-gray-500 text-sm">No scores submitted for this week.</p>
        )}
      </div>
    </div>
  )
}
