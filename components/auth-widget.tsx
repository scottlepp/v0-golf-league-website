'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@neondatabase/auth-ui'

export default function AuthWidget({ adminEmails = [] }: { adminEmails?: string[] }) {
  return (
    <>
      <SignedIn>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-green-900 hover:underline">
            Admin
          </Link>
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <Link
          href="/auth/sign-in"
          className="text-sm font-medium text-green-900 hover:underline"
        >
          Sign in
        </Link>
      </SignedOut>
    </>
  )
}
