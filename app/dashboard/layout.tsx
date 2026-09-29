import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Second lock behind proxy.ts, in case the proxy is ever misconfigured.
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b-4 border-rust bg-steel px-6 py-4 text-white">
        <span className="text-lg font-semibold tracking-tight">LocalForge OS</span>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-white/70 sm:inline">{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  )
}
