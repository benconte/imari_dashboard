"use client"

import { Suspense, useCallback, useEffect, useState, useTransition } from "react"
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
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Derive initial error message from URL params.
  // This avoids setState synchronously inside an effect.
  const initialError =
    errorParam === "NotAnAdmin"
      ? "This Google account is not associated with an admin account."
      : errorParam
        ? "Authentication failed. Please try again."
        : null





  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        // Use a generic message — never reveal whether the email exists
        setError("Invalid email or password.")
        return
      }

      // Read the session to get role (set by DB in authorize()) and MFA status
      const { getSession } = await import("next-auth/react")
      const session = await getSession()

      if (!session) {
        setError("Session could not be established. Please try again.")
        return
      }

      // If MFA is enabled and not yet verified, go to the MFA step.
      // IMPORTANT: mfaEnabled/verified come from the JWT session.
      // If timing causes them to be stale, middleware will still enforce the MFA gate.
      if (session.user.mfaEnabled && !session.user.mfaVerified) {
        router.push(`/mfa?adminId=${session.user.id}`)
        return
      }

      // Otherwise go to role's home, or to the page they originally tried to visit
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

          {/* Google sign-in */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: callbackUrl ?? "/" })}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <GoogleIcon />
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">Or sign in with email</span>
            </div>
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

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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