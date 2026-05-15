'use client'

import { useState } from 'react'
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
  defaultWeek: number
}

export default function WeekSelectorClient({
  weeks,
  defaultWeek,
}: WeekSelectorClientProps) {
  const [selectedWeek, setSelectedWeek] = useState(defaultWeek.toString())

  const handleWeekChange = (value: string) => {
    setSelectedWeek(value)
    // Trigger page reload or state update - for now just update local state
    // The parent component will need to handle the actual navigation/update
  }

  const currentWeek = weeks.find((w) => w.week_number === defaultWeek)

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedWeek} onValueChange={handleWeekChange}>
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
      {currentWeek?.is_current && (
        <Badge variant="outline" className="text-green-600 border-green-600">
          Current: Week {currentWeek.week_number}
        </Badge>
      )}
    </div>
  )
}
