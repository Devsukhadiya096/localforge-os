'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Alert, Field, SubmitButton } from '@/components/auth/ui'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const email = String(new FormData(e.currentTarget).get('email')).trim()
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // Same message whether or not the email exists, so nobody can probe for accounts.
    setSent(true)
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-steel">Reset your password</h1>
      <p className="mt-1 mb-6 text-sm text-foreground/60">
        Enter your email and we will send you a reset link.
      </p>

      {sent ? (
        <Alert kind="success">
          If an account exists for that email, a reset link is on its way.
        </Alert>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <Alert kind="error">{error}</Alert>}
          <Field id="email" label="Email" type="email" autoComplete="email" required disabled={loading} />
          <SubmitButton loading={loading} loadingText="Sending...">Send reset link</SubmitButton>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-foreground/60">
        <Link href="/login" className="font-medium text-steel underline-offset-2 hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  )
}
