'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Alert, Field, SubmitButton } from '@/components/auth/ui'

function friendlyError(message: string) {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'Incorrect email or password.'
  }
  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Please confirm your email first. Check your inbox for the link.'
  }
  return message
}

export default function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError ?? null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('email')).trim(),
      password: String(form.get('password')),
    })

    if (error) {
      setError(friendlyError(error.message))
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-steel">Sign in</h1>
      <p className="mt-1 mb-6 text-sm text-foreground/60">Welcome back to LocalForge OS.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <Field id="email" label="Email" type="email" autoComplete="email" required disabled={loading} />
        <Field id="password" label="Password" type="password" autoComplete="current-password" required disabled={loading} />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-steel underline-offset-2 hover:underline">
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={loading} loadingText="Signing in...">Sign in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        No account yet?{' '}
        <Link href="/signup" className="font-medium text-steel underline-offset-2 hover:underline">
          Create one
        </Link>
      </p>
    </>
  )
}
