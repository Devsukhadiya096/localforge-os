import LoginForm from './login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const initialError =
    error === 'link_invalid'
      ? 'That link is invalid or has expired. Please try again.'
      : undefined

  return <LoginForm initialError={initialError} />
}
