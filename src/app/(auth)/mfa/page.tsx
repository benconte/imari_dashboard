"use client"

import { Suspense, useCallback, useRef, useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthBrandPanel from "@/components/auth/AuthPanelBrand"
import { AdminRole } from "@/types/next-auth"
import { ROLE_HOME } from "@/lib/auth-options"
import { MfaSearchParamsSuspense } from "./MfaSearchParamsClient"

const DIGITS = 6

export default function MfaPage() {
  const router = useRouter()

  const [adminId, setAdminId] = useState<string>("")

  const handleParams = useCallback(
    ({ adminId }: { adminId: string }) => {
      setAdminId(adminId)
    },
    []
  )


  const [isPending, startTransition] = useTransition()

  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""))
  const [error, setError] = useState<string | null>(null)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const code = digits.join("")


  function handleChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 1)
    const next = [...digits]
    next[index] = cleaned
    setDigits(next)
    if (cleaned && index < DIGITS - 1) refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS)
    const next = Array(DIGITS).fill("")
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setDigits(next)
    refs.current[Math.min(pasted.length, DIGITS - 1)]?.focus()
  }

  function handleSubmit(e: React.FormEvent) {

    e.preventDefault()
    if (code.length < DIGITS) { setError("Please enter all 6 digits."); return }
    setError(null)

    startTransition(async () => {
      const res = await signIn("mfa", {
        adminId,   
        code,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid code. Please try again.")
        setDigits(Array(DIGITS).fill(""))
        refs.current[0]?.focus()
        return
      }

      const { getSession } = await import("next-auth/react")
      const session = await getSession()
      const role = session?.user.role as AdminRole | undefined
      router.push(role ? ROLE_HOME[role] : "/login")
    })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_46%]">
      <MfaSearchParamsSuspense onParams={handleParams} />


      {/* ── Left ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-8">

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
              <ShieldIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Two-factor verification</h1>
              <p className="mt-1.5 text-sm text-gray-500">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { refs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-14 w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-semibold text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || code.length < DIGITS}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Verifying…" : "Verify Code"}
            </button>
          </form>

         

          <p className="text-center text-sm text-gray-500">
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
              ← Back to sign in
            </Link>
          </p>

        </div>
      </div>

      {/* ── Right ─────────────────────────────────────────────────────── */}
      <AuthBrandPanel page="mfa" />

    </div>
  )
}

function ShieldIcon() {
  return (
    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}