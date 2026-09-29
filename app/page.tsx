import { redirect } from 'next/navigation'

// The proxy sends logged-out visitors to /login, so this is all we need.
export default function Home() {
  redirect('/dashboard')
}
