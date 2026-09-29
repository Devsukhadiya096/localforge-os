'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    await createClient().auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="rounded border border-line bg-white px-3 py-1.5 text-sm text-steel transition hover:bg-background disabled:opacity-60"
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}
