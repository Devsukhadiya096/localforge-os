'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Alert, Field, SubmitButton } from '@/components/auth/ui'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget)
    const fullName = String(form.get('full_name')).trim()
    const email = String(form.get('email')).trim()
    const password = String(form.get('password'))
    const confirm = String(form.get('confirm'))

    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')

    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // With email confirmation on, an existing email comes back with no identities.
    if (data.user && data.user.identities?.length === 0) {
      setError('An account with this email already exists. Try signing in.')
      setLoading(false)
      return
    }

    // Session present = email confirmation is off, so they're already logged in.
    if (data.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    setCheckEmail(true)
    setLoading(false)
  }

  if (checkEmail) {
    return (
      <>
        <h1 className="text-2xl font-semibold text-steel">Check your email</h1>
        <div className="mt-4">
          <Alert kind="success">
            We sent a confirmation link to your email. Click it to finish creating your account.
          </Alert>
        </div>
        <p className="mt-6 text-center text-sm text-foreground/60">
          <Link href="/login" className="font-medium text-steel underline-offset-2 hover:underline">
            Back to sign in
          </Link>
        </p>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-steel">Create your account</h1>
      <p className="mt-1 mb-6 text-sm text-foreground/60">Set up LocalForge OS for your agency.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <Field id="full_name" label="Full name" type="text" autoComplete="name" required disabled={loading} />
        <Field id="email" label="Email" type="email" autoComplete="email" required disabled={loading} />
        <Field id="password" label="Password (min 8 characters)" type="password" autoComplete="new-password" required minLength={8} disabled={loading} />
        <Field id="confirm" label="Confirm password" type="password" autoComplete="new-password" required minLength={8} disabled={loading} />
        <SubmitButton loading={loading} loadingText="Creating account...">Create account</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-steel underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
