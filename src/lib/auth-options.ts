import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { AdminRole } from "@/types/next-auth"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"
const ADMIN_LOGIN_URL = `${BACKEND_URL}/api/v1/admin/login`

export const ROLE_HOME: Record<AdminRole, string> = {
  SUPER_ADMIN:     "/super-admin/overview",
  FINANCIAL_ADMIN: "/financial-admin/overview",
  SUPPORT_ADMIN:   "/support-admin/overview",
  FRAUD_ADMIN:     "/fraud-admin/overview",
}

function mapBackendAdminRole(role: string): AdminRole {
  switch (role) {
    case "SUPER_ADMIN":
      return "SUPER_ADMIN"
    case "OPS_ADMIN":
      return "FINANCIAL_ADMIN"
    case "FRAUD_OFFICER":
      return "FRAUD_ADMIN"
    case "SUPPORT":
    case "READ_ONLY":
    default:
      return "SUPPORT_ADMIN"
  }
}

async function fetchAdminLogin(email: string, password: string, totpCode?: string) {
  const response = await fetch(ADMIN_LOGIN_URL, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      ...(totpCode && totpCode !== "undefined" && totpCode.trim()
        ? { totpCode: totpCode.trim() }
        : {}),
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      typeof body?.message === "string"
        ? body.message
        : typeof body?.error === "string"
        ? body.error
        : "Authentication failed"

    console.error("[fetchAdminLogin] Error - Status:", response.status, "Body:", body, "Message:", message)
    throw new Error(message)
  }

  const body = await response.json()

  return body.data as {
    accessToken: string
    refreshToken: string
    admin: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "MFA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        try {
          const data = await fetchAdminLogin(
            credentials.email,
            credentials.password,
            credentials.totpCode?.trim(),
          )

          return {
            id: `${data.admin.id}`,
            name: `${data.admin.firstName ?? ""} ${data.admin.lastName ?? ""}`.trim() || data.admin.email,
            email: data.admin.email,
            role: mapBackendAdminRole(data.admin.role),
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            // Backend currently doesn’t expose MFA state in this frontend’s typing.
            // First-time users will be sent to /mfa/setup by middleware until MFA is confirmed.
            mfaEnabled: false,
            mfaVerified: true,
          }
        } catch (error) {
          const message = String(error instanceof Error ? error.message : error)
          if (message.includes("MFA code required")) {
            throw new Error("MFA_REQUIRED")
          }
          throw new Error("Invalid credentials")
        }
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      try {
        const parsedUrl = new URL(url)
        const parsedBase = new URL(baseUrl)
        if (parsedUrl.hostname === "localhost" && parsedBase.hostname === "localhost") return url
        if (parsedUrl.origin === parsedBase.origin) return url
      } catch {
        /* ignore */
      }
      return baseUrl
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.mfaEnabled = user.mfaEnabled
        token.mfaVerified = user.mfaVerified ?? true
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as AdminRole
      session.user.mfaEnabled = token.mfaEnabled ?? false
      session.user.mfaVerified = token.mfaVerified ?? true
      session.user.accessToken = token.accessToken as string | undefined
      session.user.refreshToken = token.refreshToken as string | undefined
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
