'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface Week {
  id: number
  week_number: number
  start_date: string
  is_current: boolean
  is_completed: boolean
}

interface Props {
  weeks: Week[]
  selectedWeek: number
  onWeekChange: (week: number) => void
  currentWeek?: number
}

export default function WeekSelector({ weeks, selectedWeek, onWeekChange, currentWeek }: Props) {
  return (
    <div className="flex items-center gap-4">
      <label className="font-semibold text-gray-700">Select Week:</label>
      <Select value={selectedWeek.toString()} onValueChange={(val) => onWeekChange(parseInt(val))}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {weeks.map((week) => (
            <SelectItem key={week.id} value={week.week_number.toString()}>
              Week {week.week_number}
              {week.is_current && ' (Current)'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentWeek && (
        <Badge variant="default" className="bg-green-600">
          Current: Week {currentWeek}
        </Badge>
      )}
    </div>
  )
}
