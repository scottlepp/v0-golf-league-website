'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface Week {
  id: number
  week_number: number
  start_date: string
  is_current: boolean
  is_completed: boolean
}

interface WeekSelectorClientProps {
  weeks: Week[]
  selectedWeek: number
  onWeekChange: (weekNumber: number) => void
}

export default function WeekSelectorClient({
  weeks,
  selectedWeek,
  onWeekChange,
}: WeekSelectorClientProps) {
  const currentWeek = weeks.find((w) => w.week_number === selectedWeek)
  const trueCurrent = weeks.find((w) => w.is_current)

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedWeek.toString()}
        onValueChange={(value) => onWeekChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a week" />
        </SelectTrigger>
        <SelectContent>
          {weeks.map((week) => (
            <SelectItem key={week.id} value={week.week_number.toString()}>
              <div className="flex items-center gap-2">
                Week {week.week_number}
                {week.is_current && (
                  <Badge variant="default" className="ml-2">
                    Current
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {trueCurrent && currentWeek?.is_current && (
        <Badge variant="outline" className="text-green-600 border-green-600">
          Current: Week {trueCurrent.week_number}
        </Badge>
      )}
    </div>
  )
}
