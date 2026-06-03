"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSession } from "next-auth/react"

import AuthBrandPanel from "@/components/auth/AuthPanelBrand"
import { AdminRole } from "@/types/next-auth"
import { ROLE_HOME } from "@/lib/auth-options"

const BACKEND_MFA_ENABLE_URL =
  `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"}/api/v1/api/v1/admin/mfa/enable`
const BACKEND_MFA_CONFIRM_URL =
  `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"}/api/v1/api/v1/admin/mfa/confirm`

export default function MfaSetupPage() {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [formattedKey, setFormattedKey] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)

  const [totpCode, setTotpCode] = useState("")

  useEffect(() => {
    let cancelled = false

    async function init() {
      setError(null)
      try {
        const session = await getSession()
        const accessToken = session?.user.accessToken
        if (!accessToken) throw new Error("Missing access token")

        const res = await fetch(BACKEND_MFA_ENABLE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.message ?? body?.error ?? "Failed to initialize MFA")
        }

        // Backend shape (from controller): { statusCode, data: { qrDataUrl, formattedKey, setupUrl, secret } }
        const json = await res.json()
        const data = json?.data ?? json

        if (!cancelled) {
          setQrDataUrl(data?.qrDataUrl ?? null)
          setFormattedKey(data?.formattedKey ?? null)
          setSecret(data?.secret ?? null)
        }
      } catch (e) {
        if (cancelled) return
        const message = String(e instanceof Error ? e.message : e)
        setError(message)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  function normalizeCode(v: string) {
    return v.replace(/\D/g, "").slice(0, 6)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (totpCode.trim().length !== 6) {
      setError("Enter the 6-digit code from your authenticator app.")
      return
    }

    startTransition(async () => {
      try {
        const session = await getSession()
        const accessToken = session?.user.accessToken
        if (!accessToken) throw new Error("Missing access token")

        const res = await fetch(BACKEND_MFA_CONFIRM_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ totpCode: totpCode.trim() }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.message ?? body?.error ?? "Failed to confirm MFA")
        }

        // Backend activates MFA. Refresh session so middleware can continue.
        // NextAuth session is JWT-based; re-sign in is the safe way here.
        // Easiest: hard reload.
        router.refresh()

        const { getSession: getSession2 } = await import("next-auth/react")
        const session2 = await getSession2()
        const role = session2?.user.role as AdminRole | undefined
        router.push(role ? ROLE_HOME[role] : "/login")
      } catch (e) {
        const message = String(e instanceof Error ? e.message : e)
        setError(message)
      }
    })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_46%]">
      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
              <ShieldIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enable two-factor authentication</h1>
              <p className="mt-1.5 text-sm text-gray-500">
                Scan the QR code with your authenticator app, then confirm using the 6-digit code.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="MFA QR Code"
                className="mx-auto h-auto w-52"
              />
            ) : (
              <div className="text-center text-sm text-gray-500">Loading QR code…</div>
            )}

            {formattedKey && (
              <div className="text-xs text-gray-500 text-center">
                Setup key: <span className="font-mono text-gray-700">{formattedKey}</span>
              </div>
            )}

            {/* secret is kept in case we want future display; not shown by default */}
            {secret && null}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Authenticator code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(normalizeCode(e.target.value))}
                placeholder="123456"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                autoComplete="one-time-code"
              />
              <p className="mt-2 text-xs text-gray-500">Enter the 6-digit code currently shown in your authenticator app.</p>
            </div>

            <button
              type="submit"
              disabled={isPending || totpCode.trim().length !== 6}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Confirming…" : "Confirm & Continue"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>

      <AuthBrandPanel page="mfa" />
    </div>
  )
}

function ShieldIcon() {
  return (
    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  )
}

