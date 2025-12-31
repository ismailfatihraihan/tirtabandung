import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes yang memerlukan authentication
const protectedRoutes = [
  '/dashboard',
  '/water-points',
  '/inspections',
  '/issues',
  '/actions',
  '/users',
  '/my-tasks'
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
  
  // Get JWT token from cookie
  const authToken = request.cookies.get('auth-token')?.value
  
  // Simple check: if token exists, user is authenticated
  // Token validation will be done in API routes
  const isAuthenticated = !!authToken
  
  // Get user role from separate cookie (set during login)
  const userRole = request.cookies.get('user-role')?.value
  
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
    if (userRole === 'officer') {
      return NextResponse.redirect(new URL('/my-tasks', request.url))
    }
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
