import { AdminRole } from "@/types/next-auth"

// ─────────────────────────────────────────────────────────
// Replace with real DB queries (Prisma, Drizzle…)
// ─────────────────────────────────────────────────────────

export interface DBAdmin {
  id: string
  name: string
  email: string
  /** bcrypt hash — all demo passwords are "password123" */
  passwordHash: string
  role: AdminRole
  mfaEnabled: boolean
  /** base32 TOTP secret — null when MFA not configured */
  mfaTotpSecret: string | null
}

export const MOCK_ADMINS: DBAdmin[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "superadmin@imari.com",
    passwordHash:
      "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    role: "SUPER_ADMIN",
    mfaEnabled: true,
    mfaTotpSecret: "JBSWY3DPEHPK3PXP",
  },
  {
    id: "2",
    name: "James Okafor",
    email: "financial@imari.com",
    passwordHash:
      "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    role: "FINANCIAL_ADMIN",
    mfaEnabled: true,
    mfaTotpSecret: "JBSWY3DPEHPK3PXP",
  },
  {
    id: "3",
    name: "Amara Diallo",
    email: "support@imari.com",
    passwordHash:
      "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    role: "SUPPORT_ADMIN",
    mfaEnabled: false,
    mfaTotpSecret: null,
  },
]

export async function getAdminByEmail(email: string): Promise<DBAdmin | null> {
  return MOCK_ADMINS.find((u) => u.email === email) ?? null
}

export async function getAdminById(id: string): Promise<DBAdmin | null> {
  return MOCK_ADMINS.find((u) => u.id === id) ?? null
}