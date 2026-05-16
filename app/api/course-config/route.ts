import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
  try {
    const rows = (await sql`SELECT name, tees, holes, pars, yardages FROM course_config WHERE id = 1`) as unknown as Array<{
      name: string
      tees: string
      holes: number
      pars: number[]
      yardages: number[]
    }>
    if (rows.length === 0) {
      // graceful default if migration hasn't been run
      return NextResponse.json({
        name: 'Pine Dell Public',
        tees: 'white',
        holes: 9,
        pars: [4, 3, 5, 4, 4, 3, 4, 5, 4],
        yardages: [385, 175, 510, 410, 360, 195, 395, 525, 420],
      })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error fetching course config:', error)
    return NextResponse.json({ error: 'Failed to fetch course config' }, { status: 500 })
  }
}
