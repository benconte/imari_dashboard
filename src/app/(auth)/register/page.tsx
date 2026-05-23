"use client"

import { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthBrandPanel from "@/components/auth/AuthPanelBrand"
import { AdminRole } from "@/types/next-auth"

const ROLES: { value: AdminRole; label: string }[] = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "FINANCIAL_ADMIN", label: "Financial Admin" },
  { value: "SUPPORT_ADMIN", label: "Support Admin" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [role, setRole] = useState<AdminRole>("SUPPORT_ADMIN")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    startTransition(async () => {
      // ─────────────────────────────────────────────────────────────
      // TODO: Call your registration API endpoint here, e.g.:
      //   const res = await fetch("/api/auth/register", {
      //     method: "POST",
      //     body: JSON.stringify({ name, email, password, role }),
      //   })
      //   if (!res.ok) { setError(await res.text()); return }
      // ─────────────────────────────────────────────────────────────

      // After registration, auto sign-in
      const res = await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
      })

      if (res?.error) {
        setError("Registration succeeded but sign-in failed. Please log in.")
        router.push("/login")
        return
      }

      router.push(
        role === "SUPER_ADMIN"
          ? "/dashboard/super_admin"
          : role === "FINANCIAL_ADMIN"
            ? "/dashboard/financial_admin"
            : "/dashboard/support_admin"
      )
    })
  }

  const strength = getPasswordStrength(password)

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_46%]">
      {/* ── Left ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-7">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
              <circle cx="18" cy="18" r="16" stroke="#6366F1" strokeWidth="3.5" strokeDasharray="70 30" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-gray-800">Imari</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="mt-1 text-sm text-gray-500">
              Already have one?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>

          {/* Role selector */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 tracking-wide uppercase">
              Register as
            </p>
            <div className="flex rounded-xl border border-gray-200 p-1 bg-gray-50 gap-1">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    role === r.value
                      ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
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
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          s <= strength.score
                            ? strength.score <= 1
                              ? "bg-red-400"
                              : strength.score <= 2
                                ? "bg-amber-400"
                                : strength.score <= 3
                                  ? "bg-blue-400"
                                  : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
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
                    ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                    : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                }`}
              />
              {confirm && confirm !== password && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
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
              {isPending ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      {/* ── Right ────────────────────────────────────────────── */}
      <AuthBrandPanel page="register" />
    </div>
  )
}

// ── Password strength ─────────────────────────────────────────────────────────

function getPasswordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ["", "Weak", "Fair", "Good", "Strong"]
  const colors = ["", "text-red-500", "text-amber-500", "text-blue-500", "text-green-600"]
  return { score, label: labels[score] ?? "", color: colors[score] ?? "" }
}

function EyeIcon({ open }: { open: boolean }) {
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