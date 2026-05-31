import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { JWT } from "next-auth/jwt"
import { AdminRole } from "@/types/next-auth"

// ── Paths that bypass auth entirely ──────────────────────────────────────────
const PUBLIC_PATHS = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/invite",        
]

// ── Each role's allowed path prefixes inside (admin) ─────────────────────────
const ROLE_ALLOWED_PATHS: Record<AdminRole, string[]> = {
  SUPER_ADMIN:     ["/super-admin"],
  FINANCIAL_ADMIN: ["/financial-admin"],
  SUPPORT_ADMIN:   ["/support-admin"],
  FRAUD_ADMIN:     ["/fraud-admin"],
}

// All protected prefixes combined (used to detect admin routes)
const ALL_ADMIN_PREFIXES = ["/super-admin", "/financial-admin", "/support-admin"]

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: JWT | null } }) {
    const { pathname } = req.nextUrl
    const token = req.nextauth?.token ?? (req as unknown as { nextauth: { token: JWT | null } }).nextauth?.token

    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

    
    if (!isPublic && !token) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("callbackUrl", pathname + req.nextUrl.search)
      return NextResponse.redirect(url)
    }

    // ── 1. MFA gate ────────────────────────────────────────────────────────────
    // If the admin has MFA enabled but hasn't verified it yet in this session,
    // send them to /mfa regardless of where they're going (except public paths).
    if (
      !isPublic &&
      token &&
      token.mfaEnabled &&
      !token.mfaVerified &&
      pathname !== "/mfa"
    ) {
      const url = req.nextUrl.clone()
      url.pathname = "/mfa"
      url.searchParams.set("adminId", String(token.id))
      return NextResponse.redirect(url)
    }

    // ── 2. Role-based path guard ───────────────────────────────────────────────
    // Prevent cross-role access, e.g. a Financial Admin hitting /super-admin/*.
    const isAdminRoute = ALL_ADMIN_PREFIXES.some((p) => pathname.startsWith(p))
    if (token && isAdminRoute) {
      const role = token.role as AdminRole
      const allowed = ROLE_ALLOWED_PATHS[role] ?? []
      const hasAccess = allowed.some((p) => pathname.startsWith(p))

      if (!hasAccess) {
        const url = req.nextUrl.clone()
        url.pathname = "/unauthorized"
        url.searchParams.set("from", pathname)
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl
        // Always allow public paths through — no token required
        if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true
        // /mfa page is accessible to partially-authed users (token exists, MFA not done)
        if (pathname === "/mfa") return !!token
        // Everything else requires a valid token
        return !!token
      },
    },
    pages: { signIn: "/login" },
  }
)

export const config = {
  
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$).*)"],
}