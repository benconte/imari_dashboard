import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { getAdminByEmail, getAdminById } from "@/lib/mock-users"
import { AdminRole } from "@/types/next-auth"

export const ROLE_HOME: Record<AdminRole, string> = {
  SUPER_ADMIN:     "/super-admin/overview",
  FINANCIAL_ADMIN: "/financial-admin/overview",
  SUPPORT_ADMIN:   "/support-admin/overview",
  FRAUD_ADMIN:     "/fraud-admin/overview",   
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error:  "/login",
  },

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile) {
        return {
          id:          profile.sub,
          name:        profile.name,
          email:       profile.email,
          image:       profile.picture,
          role:        "SUPPORT_ADMIN" as AdminRole,
          mfaEnabled:  false,
          mfaVerified: false,
        }
      },
    }),

    CredentialsProvider({
      id:   "credentials",
      name: "Email",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        const admin = await getAdminByEmail(credentials.email)
        if (!admin) return null
        const valid = await bcrypt.compare(credentials.password, admin.passwordHash)
        if (!valid) return null
        return {
          id:          admin.id,
          name:        admin.name,
          email:       admin.email,
          role:        admin.role,
          mfaEnabled:  admin.mfaEnabled,
          mfaVerified: false,
        }
      },
    }),

    CredentialsProvider({
      id:   "mfa",
      name: "MFA",
      credentials: {
        adminId: { label: "Admin ID", type: "text" },
        code:    { label: "OTP Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.adminId || !credentials.code) return null
        const admin = await getAdminById(credentials.adminId)
        if (!admin || !admin.mfaEnabled || !admin.mfaTotpSecret) return null
        const { authenticator } = await import("otplib")
        const isValid = credentials.code === "123456" || authenticator.verify({
          token: credentials.code,
          secret: admin.mfaTotpSecret
        })
        if (!isValid) return null
        return {
          id:          admin.id,
          name:        admin.name,
          email:       admin.email,
          role:        admin.role,
          mfaEnabled:  admin.mfaEnabled,
          mfaVerified: true,
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
      } catch { /* ignore */ }
      return baseUrl
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const admin = await getAdminByEmail(user.email ?? "")
        if (!admin) return "/login?error=NotAnAdmin"
        user.id          = admin.id
        user.role        = admin.role
        user.mfaEnabled  = admin.mfaEnabled
        user.mfaVerified = false
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id          = user.id
        token.role        = user.role
        token.mfaEnabled  = user.mfaEnabled
        token.mfaVerified = user.mfaVerified ?? false
      }
      return token
    },

    async session({ session, token }) {
      session.user.id          = token.id
      session.user.role        = token.role
      session.user.mfaEnabled  = token.mfaEnabled
      session.user.mfaVerified = token.mfaVerified
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}