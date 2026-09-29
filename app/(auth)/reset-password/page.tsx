'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Alert, Field, SubmitButton } from '@/components/auth/ui'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget)
    const password = String(form.get('password'))
    const confirm = String(form.get('confirm'))

    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-steel">Choose a new password</h1>
      <p className="mt-1 mb-6 text-sm text-foreground/60">
        You opened a reset link, so just pick a new password below.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <Field id="password" label="New password (min 8 characters)" type="password" autoComplete="new-password" required minLength={8} disabled={loading} />
        <Field id="confirm" label="Confirm new password" type="password" autoComplete="new-password" required minLength={8} disabled={loading} />
        <SubmitButton loading={loading} loadingText="Saving...">Update password</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        <Link href="/forgot-password" className="font-medium text-steel underline-offset-2 hover:underline">
          Need a new link?
        </Link>
      </p>
    </>
  )
}
