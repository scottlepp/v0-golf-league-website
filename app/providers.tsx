'use client'

import { NeonAuthUIProvider } from '@neondatabase/auth-ui'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth/client'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={(href) => router.push(href)}
      replace={(href) => router.replace(href)}
      onSessionChange={() => router.refresh()}
      Link={({ href, ...props }) => <Link href={href} {...props} />}
    >
      {children}
    </NeonAuthUIProvider>
  )
}
