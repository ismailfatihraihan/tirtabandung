import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes yang memerlukan authentication
const protectedRoutes = [
  '/dashboard',
  '/water-points',
  '/inspections',
  '/issues',
  '/actions',
  '/users'
]

// Routes yang hanya untuk Admin
const adminOnlyRoutes = [
  '/users',
  '/actions'
]

// Routes yang hanya untuk public (jika sudah login, redirect ke dashboard)
const publicOnlyRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if user is authenticated and get role
  const authToken = request.cookies.get('auth_token')?.value
  
  // For demo, we'll check localStorage via header (in production use proper JWT)
  const userRole = request.cookies.get('user_role')?.value
  
  const isAuthenticated = authToken || request.headers.get('x-user-authenticated') === 'true'
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname.startsWith(route))
  const isPublicOnlyRoute = publicOnlyRoutes.some(route => pathname.startsWith(route))
  
  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Redirect officer to dashboard if trying to access admin-only routes
  if (isAdminOnlyRoute && userRole === 'officer') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Redirect to dashboard if accessing login/register while authenticated
  if (isPublicOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
