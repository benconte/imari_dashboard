"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import AuthBrandPanel from "@/components/auth/AuthPanelBrand"

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      // ─────────────────────────────────────────────────────────────
      // TODO: Call your password reset API endpoint here, e.g.:
      //   const res = await fetch("/api/auth/forgot-password", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email }),
      //   })
      //   if (!res.ok) { setError("Something went wrong. Try again."); return }
      // ─────────────────────────────────────────────────────────────

      // Simulate success
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
    })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_46%]">
      {/* ── Left ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
              <circle cx="18" cy="18" r="16" stroke="#6366F1" strokeWidth="3.5" strokeDasharray="70 30" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-gray-800">Imari</span>
          </div>

          {!submitted ? (
            <>
              {/* Header */}
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 mb-5">
                  <KeyIcon />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
                <p className="mt-1.5 text-sm text-gray-500">
                  No worries — enter your email and we&apos;ll send you reset instructions.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 transition-colors"
                >
                  {isPending ? "Sending…" : "Send Reset Instructions"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500">
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  ← Back to sign in
                </Link>
              </p>
            </>
          ) : (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-5 text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100">
                <CheckCircleIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
                  We&apos;ve sent reset instructions to{" "}
                  <span className="font-medium text-gray-700">{email}</span>.
                  The link expires in 30 minutes.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Didn&apos;t receive it?{" "}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Try again
                </button>
              </p>
              <Link
                href="/login"
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                ← Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Right ────────────────────────────────────────────── */}
      <AuthBrandPanel page="forgot" />
    </div>
  )
}

function KeyIcon() {
  return (
    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}