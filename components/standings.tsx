'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface Standing {
  id: number
  week_id: number
  team_id: number
  team_name: string
  total_score: number | null
  rank: number | null
  points_earned: number
}

interface Props {
  standings: Standing[]
  weekNumber: number
  isLoading: boolean
}

export default function Standings({ standings, weekNumber, isLoading }: Props) {
  const getRankColor = (rank: number | null) => {
    if (!rank) return 'bg-gray-100'
    if (rank === 1) return 'bg-yellow-100'
    if (rank === 2) return 'bg-gray-100'
    if (rank === 3) return 'bg-orange-100'
    return 'bg-white'
  }

  const getRankBadgeColor = (rank: number | null) => {
    if (!rank) return 'outline'
    if (rank === 1) return 'default'
    if (rank === 2) return 'secondary'
    if (rank === 3) return 'outline'
    return 'outline'
  }

  const sortedStandings = [...standings].sort((a, b) => (a.rank || 999) - (b.rank || 999))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Standings</CardTitle>
        <CardDescription>Week {weekNumber} team rankings and scores</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : sortedStandings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No scores submitted yet for this week</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Rank</TableHead>
                  <TableHead className="font-semibold">Team</TableHead>
                  <TableHead className="text-right font-semibold">Score</TableHead>
                  <TableHead className="text-right font-semibold">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStandings.map((standing, idx) => (
                  <TableRow
                    key={standing.id}
                    className={`${getRankColor(standing.rank)} border-l-4 ${
                      standing.rank === 1
                        ? 'border-l-yellow-500'
                        : standing.rank === 2
                          ? 'border-l-gray-400'
                          : standing.rank === 3
                            ? 'border-l-orange-400'
                            : 'border-l-transparent'
                    }`}
                  >
                    <TableCell className="font-bold text-lg">
                      <Badge variant={getRankBadgeColor(standing.rank)}>#{standing.rank || '-'}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{standing.team_name}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-lg text-blue-600">
                      {standing.total_score !== null ? standing.total_score : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {standing.points_earned}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
