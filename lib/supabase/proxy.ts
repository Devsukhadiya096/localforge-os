import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Pages anyone can visit without being logged in.
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/auth/callback']
// Pages a logged-in user has no reason to see again.
const GUEST_ONLY_PATHS = ['/login', '/signup', '/forgot-password']

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() asks Supabase to verify the session, so it can't be faked.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '/'))
  const isGuestOnly = GUEST_ONLY_PATHS.includes(path)

  const redirectTo = (target: string) => {
    const url = request.nextUrl.clone()
    url.pathname = target
    url.search = ''
    const redirect = NextResponse.redirect(url)
    // Carry over any refreshed session cookies.
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c))
    return redirect
  }

  if (!user && !isPublic) return redirectTo('/login')
  if (user && isGuestOnly) return redirectTo('/dashboard')

  return response
}