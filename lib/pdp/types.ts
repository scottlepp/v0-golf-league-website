export interface Week {
  id: number
  week_number: number
  start_date: string
  is_current: boolean
  is_completed: boolean
}

export interface Team {
  id: number
  name: string
  player1_name: string
  player2_name: string
}

export interface Match {
  id: number
  week_id: number
  team1_id: number
  team2_id: number
  team1_name: string
  team2_name: string
  tee_time: string
}

export interface Standing {
  id: number
  week_id: number
  team_id: number
  team_name: string
  total_score: number | null
  rank: number | null
  points_earned: number
}

export interface SeasonStanding {
  team_id: number
  team_name: string
  points: number
  avg_score: number
  weeks_played: number
}

export interface CourseConfig {
  name: string
  tees: string
  holes: number
  pars: number[]
  yardages: number[]
}

export interface HoleScore {
  hole_number: number
  player_index: 1 | 2
  strokes: number
}
