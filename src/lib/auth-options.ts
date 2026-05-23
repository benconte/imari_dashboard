import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { getAdminByEmail } from "./mock-users"
import { AdminRole } from "@/types/next-auth"

// Role → dashboard home path
export const ROLE_HOME: Record<AdminRole, string> = {
  SUPER_ADMIN:     "/super-admin/overview",
  FINANCIAL_ADMIN: "/financial-admin/overview",
  SUPPORT_ADMIN:   "/support-admin/overview",
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    // ── Google OAuth ──────────────P─────────────────────────────────
    // Only allow Google sign-in for pre-existing admin accounts.
    // After OAuth we look up the user in the DB to get their role.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile) {
        // Profile is augmented in the jwt callback below after DB lookup
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "SUPPORT_ADMIN" as AdminRole, // temporary — overridden in jwt
          mfaEnabled: false,
          mfaVerified: false,
        }
      },
    }),

    // ── Email + Password ───────────────────────────────────────────
    CredentialsProvider({
      id: "credentials",
      name: "Email",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const admin = await getAdminByEmail(credentials.email)
        if (!admin) return null

        const valid = await bcrypt.compare(credentials.password, admin.passwordHash)
        if (!valid) return null

        return {
          id:         admin.id,
          name:       admin.name,
          email:      admin.email,
          role:       admin.role,
          mfaEnabled: admin.mfaEnabled,
          mfaVerified: false, // MFA not yet verified at this step
        }
      },
    }),

    // ── MFA second-factor step ─────────────────────────────────────
    CredentialsProvider({
      id: "mfa",
      name: "MFA",
      credentials: {
        adminId: { label: "Admin ID", type: "text" },
        code:    { label: "OTP Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.adminId || !credentials.code) return null

        const { getAdminById } = await import("@/lib/mock-users")
        const admin = await getAdminById(credentials.adminId)
        if (!admin || !admin.mfaTotpSecret) return null

        // ── Swap this block for real TOTP verification ─────────────
        // import { authenticator } from "otplib"
        // const valid = authenticator.verify({
        //   token: credentials.code,
        //   secret: admin.mfaTotpSecret,
        // })
        // if (!valid) return null
        // ───────────────────────────────────────────────────────────
        // DEMO: any code "123456" is accepted
        if (credentials.code !== "123456") return null

        return {
          id:         admin.id,
          name:       admin.name,
          email:      admin.email,
          role:       admin.role,
          mfaEnabled: admin.mfaEnabled,
          mfaVerified: true,
        }
      },
    }),
  ],

  callbacks: {
    // For Google OAuth: look up the admin by email to get their real role
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const admin = await getAdminByEmail(user.email ?? "")
        // Reject Google sign-in if email is not a registered admin
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