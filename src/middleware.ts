import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { JWT } from "next-auth/jwt"

// ── Public paths that require NO authentication ───────────────────────────────
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"]

// ── Role → allowed path prefixes ─────────────────────────────────────────────
const ROLE_PATHS: Record<string, string[]> = {
  SUPER_ADMIN: ["/dashboard/super_admin", "/dashboard"],
  FINANCIAL_ADMIN: ["/dashboard/financial_admin", "/dashboard"],
  SUPPORT_ADMIN: ["/dashboard/support_admin", "/dashboard"],
}

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: JWT | null } }) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // If logged in but MFA required and not yet verified, redirect to /mfa
    if (
      token &&
      token.mfaEnabled &&
      !token.mfaVerified &&
      !pathname.startsWith("/mfa") &&
      !PUBLIC_PATHS.some((p) => pathname.startsWith(p))
    ) {
      const url = req.nextUrl.clone()
      url.pathname = "/mfa"
      url.searchParams.set("userId", token.id as string)
      return NextResponse.redirect(url)
    }

    // Role-based path guard
    if (token && pathname.startsWith("/dashboard")) {
      const role = token.role as string
      const allowed = ROLE_PATHS[role] ?? []
      const hasAccess = allowed.some((p) => pathname.startsWith(p))

      if (!hasAccess) {
        const url = req.nextUrl.clone()
        // Redirect to the correct dashboard root for this role
        url.pathname =
          role === "admin"
            ? "/dashboard/admin"
            : role === "manager"
              ? "/dashboard/manager"
              : "/dashboard"
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Let withAuth decide — it redirects to /login if no token
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true
        return !!token
      },
    },
    pages: { signIn: "/login" },
  }
)

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.svg).*)",
  ],
}