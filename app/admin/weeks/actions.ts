'use server'

import sql from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'

export async function setCurrentWeek(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) return

  await sql`UPDATE weeks SET is_current = (id = ${id})`
  revalidatePath('/admin/weeks')
  revalidatePath('/')
}

export async function toggleCompleted(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const completed = formData.get('completed') === 'true'
  if (!Number.isInteger(id)) return

  await sql`UPDATE weeks SET is_completed = ${completed} WHERE id = ${id}`
  revalidatePath('/admin/weeks')
  revalidatePath('/')
}
