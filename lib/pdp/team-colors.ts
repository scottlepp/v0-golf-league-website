// Deterministic palette mapping. Falls back by id modulo if a team isn't listed.
// Based on the design's twelve hand-picked colors.

const PALETTE = [
  '#1B4332', // fairway green
  '#B33636', // clay red
  '#2C5282', // ink blue
  '#C9924A', // sand
  '#7C4A88', // plum
  '#3F7D3F', // green machine
  '#5C4033', // walnut
  '#2A6F97', // birdie blue
  '#8B5A3C', // bogey brown
  '#A66B2C', // tee orange
  '#444444', // putter graphite
  '#6B3030', // mulligan oxblood
]

export function teamColor(teamId: number): string {
  return PALETTE[(teamId - 1) % PALETTE.length]
}

export function teamInitial(name: string): string {
  const cleaned = name.replace(/[^A-Za-z\s]/g, '').trim()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
