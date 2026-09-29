import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // This read goes through Row Level Security, so it doubles as a test that the
  // signup trigger created your profile and organization.
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, role, organizations(name)')
    .eq('id', user!.id)
    .single()

  const org = Array.isArray(profile?.organizations)
    ? profile?.organizations[0]
    : profile?.organizations

  return (
    <div>
      <h1 className="text-2xl font-semibold text-steel">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
      </h1>
      <p className="mt-2 text-foreground/70">Authentication is working. The CRM dashboard comes next.</p>

      <div className="mt-8 rounded border border-line bg-white p-5 text-sm">
        <h2 className="mb-3 font-semibold text-steel">Account check</h2>
        <dl className="grid grid-cols-[8rem_1fr] gap-y-2">
          <dt className="text-foreground/60">Email</dt>
          <dd>{user!.email}</dd>
          <dt className="text-foreground/60">Organization</dt>
          <dd>{org?.name ?? 'Not found'}</dd>
          <dt className="text-foreground/60">Role</dt>
          <dd>{profile?.role ?? 'Not found'}</dd>
        </dl>
        {!profile && (
          <p className="mt-4 rounded border border-yellow-300 bg-yellow-50 px-3 py-2 text-yellow-900">
            No profile row found. Run the 0002 migration (signup trigger) in the Supabase SQL
            Editor, then create a fresh account.
          </p>
        )}
      </div>
    </div>
  )
}
