import { NextResponse } from 'next/server'
import { getMyProfile } from '@/lib/auth/profile'

export const dynamic = 'force-dynamic'

export async function GET() {
  const profile = await getMyProfile()
  if (!profile) return NextResponse.json({ profile: null }, { status: 200 })
  return NextResponse.json({ profile })
}
