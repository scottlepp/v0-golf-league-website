import { AuthView } from '@neondatabase/auth-ui'

export const dynamic = 'force-dynamic'

export default async function AuthPage({
  params,
}: {
  params: Promise<{ auth?: string[] }>
}) {
  const { auth: segments = ['sign-in'] } = await params
  const path = segments.join('/')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="w-full max-w-md">
        <AuthView path={path} />
      </div>
    </div>
  )
}
