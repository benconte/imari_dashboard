"use client"

import { useEffect, useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import AuthBrandPanel from "@/components/auth/AuthPanelBrand"
import { AdminRole } from "@/types/next-auth"
import { ROLE_HOME } from "@/lib/auth-options"

// ── What the /api/auth/invite/[token] endpoint returns ───────────────────────
interface InviteInfo {
  email: string
  role:  AdminRole
  valid: boolean
  error?: string
}

const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN:     "Super Administrator",
  FINANCIAL_ADMIN: "Financial Administrator",
  SUPPORT_ADMIN:   "Support Administrator",
}

export default function AcceptInvitePage() {
  const router = useRouter()
  const { token } = useParams<{ token: string }>()

  const [isPending, startTransition] = useTransition()
  const [invite, setInvite]         = useState<InviteInfo | null>(null)
  const [loading, setLoading]       = useState(true)
  const [password, setPassword]     = useState("")
  const [confirm, setConfirm]       = useState("")
  const [showPw, setShowPw]         = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)
  const [done, setDone]             = useState(false)

  // ── Validate the token on mount ────────────────────────────────────────────
  useEffect(() => {
    async function validate() {
      try {
        // TODO: replace with real endpoint when backend is ready
        // const res = await fetch(`/api/auth/invite/${token}`)
        // const data = await res.json()
        // setInvite(data)

        // Mock validation against MOCK_INVITE_TOKENS
        const { getInviteByToken, isInviteValid } = await import("@/lib/invite-token")
        const inv = await getInviteByToken(token)
        if (!inv) {
          setInvite({ email: "", role: "SUPPORT_ADMIN", valid: false, error: "Invite link not found." })
        } else {
          const { valid, reason } = isInviteValid(inv)
          setInvite({ email: inv.email, role: inv.role, valid, error: reason })
        }
      } catch {
        setInvite({ email: "", role: "SUPPORT_ADMIN", valid: false, error: "Could not validate invite." })
      } finally {
        setLoading(false)
      }
    }
    validate()
  }, [token])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (password !== confirm) { setFormError("Passwords do not match."); return }
    if (password.length < 8)  { setFormError("Password must be at least 8 characters."); return }
    if (!invite?.valid)       { setFormError("This invite is no longer valid."); return }

    startTransition(async () => {
      // ── TODO: call real endpoint to create the account ─────────────────────
      // const res = await fetch("/api/auth/invite/accept", {
      //   method:  "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body:    JSON.stringify({ token, password }),
      // })
      // if (!res.ok) { setFormError(await res.text()); return }
      // ── After account is created, sign in automatically ────────────────────

      // Demo: sign in with the pre-existing mock user for this role
      const res = await signIn("credentials", {
        email:    invite!.email,
        password,             // in real flow this is the newly set password
        redirect: false,
      })

      if (res?.error) {
        // In a real flow the account was just created, this shouldn't fail
        setFormError("Account created — please sign in manually.")
        router.push("/login")
        return
      }

      setDone(true)
      await new Promise((r) => setTimeout(r, 1200))
      router.push(ROLE_HOME[invite!.role])
    })
  }

  const strength = getPasswordStrength(password)

  // ── States ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <svg className="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!invite?.valid) {
    return (
      <div className="min-h-screen grid lg:grid-cols-[1fr_46%]">
        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-100 mx-auto">
              <XCircleIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invite invalid</h1>
              <p className="mt-2 text-sm text-gray-500">{invite?.error ?? "This invite link is not valid."}</p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
        <AuthBrandPanel page="register" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100 mx-auto">
            <CheckIcon />
          </div>
          <p className="text-sm font-medium text-gray-700">Account created! Redirecting…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_46%]">

      {/* ── Left ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-7">

          {/* Header */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 mb-5">
              <InviteIcon />
              You&apos;ve been invited
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Set your password</h1>
            <p className="mt-1 text-sm text-gray-500">
              You&apos;re joining as{" "}
              <span className="font-medium text-gray-700">{ROLE_LABELS[invite.role]}</span>
              {" "}with{" "}
              <span className="font-medium text-gray-700">{invite.email}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email — read only, set by invite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={invite.email}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeToggleIcon open={showPw} />
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((s) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-all ${
                        s <= strength.score
                          ? strength.score <= 1 ? "bg-red-400"
                            : strength.score <= 2 ? "bg-amber-400"
                            : strength.score <= 3 ? "bg-blue-400"
                            : "bg-green-500"
                          : "bg-gray-200"
                      }`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strength.color}`}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 transition-all ${
                  confirm && confirm !== password
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                }`}
              />
              {confirm && confirm !== password && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {formError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? "Creating account…" : "Create Account & Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>

        </div>
      </div>

      {/* ── Right ────────────────────────────────────────────────────────── */}
      <AuthBrandPanel page="register" />

    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPasswordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return {
    score,
    label:  ["", "Weak", "Fair", "Good", "Strong"][score] ?? "",
    color:  ["", "text-red-500", "text-amber-500", "text-blue-500", "text-green-600"][score] ?? "",
  }
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function InviteIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function EyeToggleIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}