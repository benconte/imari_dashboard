"use client"

import { useCallback, useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

import Link from "next/link"
import AuthBrandPanel from "@/components/auth/AuthPanelBrand"
import { AdminRole } from "@/types/next-auth"
import { ROLE_HOME } from "@/lib/auth-options"
import {
  LoginSearchParamsSuspense,
} from "./LoginSearchParamsClient"

export default function LoginInner() {
  const router = useRouter()

  const [callbackUrl, setCallbackUrl] = useState<string | null>(null)
  const [errorParam, setErrorParam] = useState<string | null>(null)

  const handleParams = useCallback(
    ({ callbackUrl, errorParam }: { callbackUrl: string | null; errorParam: string | null }) => {
      setCallbackUrl(callbackUrl)
      setErrorParam(errorParam)
    },
    []
  )


  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [needsMfa, setNeedsMfa] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState<string | null>(null)





  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      if (needsMfa && totpCode.trim().length === 0) {
        setError("Please enter your MFA code.")
        return
      }

      const res = await signIn("credentials", {
        email,
        password,
        totpCode: needsMfa ? totpCode : undefined,
        redirect: false,
      })

      if (res?.error) {
        if (res.error === "MFA_REQUIRED") {
          setNeedsMfa(true)
          setError("MFA code required. Enter the code from your authenticator app.")
          return
        }

        setError("Invalid email or password.")
        return
      }

      const { getSession } = await import("next-auth/react")
      const session = await getSession()

      if (!session) {
        setError("Session could not be established. Please try again.")
        return
      }

      const destination = callbackUrl ?? ROLE_HOME[session.user.role as AdminRole]
      router.push(destination)
    })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_46%]">

      <LoginSearchParamsSuspense onParams={handleParams} />

      {/* ── Left: Form ───────────────────────────────────────────────────── */}

      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <ImariLogo />
            <span className="font-semibold text-gray-800">Imari</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin sign in</h1>
            <p className="mt-1 text-sm text-gray-500">
              Access is restricted to authorised personnel only.
            </p>
          </div>

          

          {/* Credentials form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@imari.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <EnvelopeIcon />
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOffIcon /> : <LockIcon />}
                </button>
              </div>
            </div>

            {needsMfa && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Authenticator code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Use the 6-digit code from your authenticator app.
                </p>
              </div>
            )}

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <AlertIcon />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 transition-colors"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon /> Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* No "Create account" link — admin accounts are invite-only */}
          <p className="text-center text-xs text-gray-400">
            Don&apos;t have access?{" "}
            <span className="text-gray-500">Contact your Super Admin.</span>
          </p>

        </div>
      </div>

      {/* ── Right: Brand panel ────────────────────────────────────────────── */}
      <AuthBrandPanel page="login" />

    </div>
  )
}

// ── SVG icons ──────────────────────────────────────────────────────────────────

function ImariLogo() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
      <circle cx="18" cy="18" r="16" stroke="#6366F1" strokeWidth="3.5"
        strokeDasharray="70 30" strokeLinecap="round" />
      <circle cx="18" cy="18" r="8" fill="#6366F1" opacity="0.2" />
    </svg>
  )
}


function EnvelopeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="h-4 w-4 mt-0.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}