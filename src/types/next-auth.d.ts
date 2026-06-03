import "next-auth"
import "next-auth/jwt"

export type AdminRole = "SUPER_ADMIN" | "FINANCIAL_ADMIN" | "SUPPORT_ADMIN" | "FRAUD_ADMIN"

declare module "next-auth" {
  interface User {
    id: string
    role: AdminRole
    mfaEnabled: boolean
    mfaVerified?: boolean
    accessToken?: string
    refreshToken?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: AdminRole
      mfaEnabled: boolean
      mfaVerified: boolean
      accessToken?: string
      refreshToken?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: AdminRole
    mfaEnabled: boolean
    mfaVerified: boolean
    accessToken?: string
    refreshToken?: string
  }
}