import { AdminRole } from "@/types/next-auth"

// ─────────────────────────────────────────────────────────────────────────────
// Replace this entire file with real DB queries when backend is ready.
// A real invite_tokens table would look like:
//
//   id          uuid primary key
//   email       text not null
//   role        admin_role not null
//   token       text not null unique   ← secure random token (crypto.randomBytes)
//   invited_by  uuid references admins(id)
//   expires_at  timestamptz not null   ← e.g. now() + interval '48 hours'
//   used_at     timestamptz            ← null = not yet used
//   created_at  timestamptz default now()
// ─────────────────────────────────────────────────────────────────────────────

export interface InviteToken {
  token: string
  email: string
  role: AdminRole
  invitedBy: string   // admin id who sent the invite
  expiresAt: Date
  usedAt: Date | null
}

// Seeded demo tokens — Super Admin creates these through the admin panel
export const MOCK_INVITE_TOKENS: InviteToken[] = [
  {
    token: "demo-invite-financial-abc123",
    email: "newfinancial@imari.com",
    role: "FINANCIAL_ADMIN",
    invitedBy: "1",                            // Sarah Chen (Super Admin)
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    usedAt: null,
  },
  {
    token: "demo-invite-support-xyz789",
    email: "newsupport@imari.com",
    role: "SUPPORT_ADMIN",
    invitedBy: "1",
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    usedAt: null,
  },
]

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getInviteByToken(
  token: string
): Promise<InviteToken | null> {
  return MOCK_INVITE_TOKENS.find((t) => t.token === token) ?? null
}

export function isInviteValid(invite: InviteToken): {
  valid: boolean
  reason?: string
} {
  if (invite.usedAt) return { valid: false, reason: "This invite link has already been used." }
  if (new Date() > invite.expiresAt) return { valid: false, reason: "This invite link has expired." }
  return { valid: true }
}

// ── In real implementation ─────────────────────────────────────────────────────
// export async function createInvite(
//   email: string, role: AdminRole, invitedBy: string
// ): Promise<string> {
//   const token = crypto.randomBytes(32).toString("hex")
//   await db.inviteTokens.create({ email, role, invitedBy, token,
//     expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) })
//   return token
// }
//
// export async function markInviteUsed(token: string): Promise<void> {
//   await db.inviteTokens.update({ where: { token }, data: { usedAt: new Date() } })
// }