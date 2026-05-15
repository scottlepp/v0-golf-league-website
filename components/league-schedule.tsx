'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface Schedule {
  id: number
  week_id: number
  team1_id: number
  team2_id: number
  team1_name: string
  team2_name: string
  tee_time: string
}

interface Props {
  schedule: Schedule[]
  weekNumber: number
  isLoading: boolean
}

export default function LeagueSchedule({ schedule, weekNumber, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>League Schedule</CardTitle>
        <CardDescription>Week {weekNumber} matchups and tee times</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : schedule.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No schedule available for this week</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Tee Time</TableHead>
                  <TableHead className="font-semibold">Team 1</TableHead>
                  <TableHead className="text-center font-semibold">vs</TableHead>
                  <TableHead className="font-semibold">Team 2</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((match, idx) => (
                  <TableRow key={match.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell className="font-mono text-sm font-semibold text-blue-600">
                      {match.tee_time}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{match.team1_name}</TableCell>
                    <TableCell className="text-center text-gray-400">vs</TableCell>
                    <TableCell className="font-medium text-gray-900">{match.team2_name}</TableCell>
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
