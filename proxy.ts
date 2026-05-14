import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PREFIX = '/admin'
const LOGIN_PATH = '/login'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next()
  }

  const response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    const redirect = request.nextUrl.clone()
    redirect.pathname = LOGIN_PATH
    return NextResponse.redirect(redirect)
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          response.cookies.set({ name, value, ...options })
        })
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const redirect = request.nextUrl.clone()
    redirect.pathname = LOGIN_PATH
    redirect.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirect)
  }

  const { data: adminRow, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (adminError || !adminRow) {
    const redirect = request.nextUrl.clone()
    redirect.pathname = LOGIN_PATH
    redirect.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(redirect)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
