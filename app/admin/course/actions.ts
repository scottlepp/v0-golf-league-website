'use server'

import sql from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'

function str(v: FormDataEntryValue | null) {
  return typeof v === 'string' ? v.trim() : ''
}

export async function updateCourse(formData: FormData) {
  await requireAdmin()
  const name = str(formData.get('name')) || 'Pine Dell Public'
  const tees = str(formData.get('tees')) || 'white'

  // Read pars[0..n] and yardages[0..n]; bail out if mismatched
  const pars: number[] = []
  const yardages: number[] = []
  let i = 0
  while (true) {
    const par = formData.get(`par_${i}`)
    const yd = formData.get(`yard_${i}`)
    if (par === null && yd === null) break
    const parNum = Number(par)
    const ydNum = Number(yd)
    if (!Number.isFinite(parNum) || parNum < 3 || parNum > 6) return
    if (!Number.isFinite(ydNum) || ydNum < 50 || ydNum > 700) return
    pars.push(parNum)
    yardages.push(ydNum)
    i++
  }
  if (pars.length === 0) return

  await sql`
    INSERT INTO course_config (id, name, tees, holes, pars, yardages, updated_at)
    VALUES (1, ${name}, ${tees}, ${pars.length}, ${pars}, ${yardages}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      tees = EXCLUDED.tees,
      holes = EXCLUDED.holes,
      pars = EXCLUDED.pars,
      yardages = EXCLUDED.yardages,
      updated_at = NOW()
  `
  revalidatePath('/admin/course')
  revalidatePath('/')
}
