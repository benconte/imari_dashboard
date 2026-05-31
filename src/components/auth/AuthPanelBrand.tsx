"use client"

import { AdminRole } from "@/types/next-auth"

type Copy = { headline: string; sub: string; desc: string }

const ROLE_COPY: Record<AdminRole, Copy> = {
  SUPER_ADMIN: {
    headline: "Welcome Back!",
    sub: "Super Administrator Portal",
    desc: "Sign in to manage users, roles, and system-wide settings with full administrative access.",
  },
  FINANCIAL_ADMIN: {
    headline: "Welcome Back!",
    sub: "Financial Administrator Portal",
    desc: "Sign in to manage financial records, generate reports, and oversee budgeting processes.",
  },
  SUPPORT_ADMIN: {
    headline: "Welcome Back!",
    sub: "Support Administrator Portal",
    desc: "Sign in to manage support tickets, user inquiries, and provide technical assistance.",
  },
  FRAUD_ADMIN: {
    headline: "Welcome Back!",
    sub: "Fraud Officer Portal",
    desc: "Sign in to monitor and investigate fraudulent activities, manage alerts, and enforce security measures.",
  },
}


interface AuthBrandPanelProps {
  role?: AdminRole
  page?: "login" | "register" | "forgot" | "mfa"
}

export default function AuthBrandPanel({
  role = "SUPPORT_ADMIN",
  page = "login",
}: AuthBrandPanelProps) {
  const fallbackCopy = ROLE_COPY.SUPPORT_ADMIN

  const copy =
    page === "register"
      ? {
          headline: "Join Us Today",
          sub: "Create your account",
          desc: "Fill in the details below to create your account and get started.",
        }
      : page === "forgot"
        ? {
            headline: "Reset Password",
            sub: "Forgot your password?",
            desc: "Enter your email address and we'll send you a link to reset your password.",
          }
        : page === "mfa"
          ? {
              headline: "Two-Factor Auth",
              sub: "Verify your identity",
              desc: "Enter the 6-digit code from your authenticator app to complete sign-in.",
            }
          : ROLE_COPY[role] ?? fallbackCopy


  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full bg-[#EEEEFF] overflow-hidden p-10 xl:p-14">
      {/* Decorative grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#C7C5F0"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Bottom-right decorative squares */}
      <div className="absolute bottom-0 right-0 grid grid-cols-3 gap-4 p-8 opacity-30">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-xl border-2 border-indigo-300"
          />
        ))}
      </div>

      {/* Logo */}
      <div className="relative flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16" stroke="#6366F1" strokeWidth="3.5" strokeDasharray="70 30" strokeLinecap="round"/>
            <circle cx="18" cy="18" r="8" fill="#6366F1" opacity="0.2"/>
          </svg>
        </div>
        <span className="text-lg font-semibold text-gray-800 tracking-tight">
          Imari
        </span>
      </div>

      {/* Main copy */}
      <div className="relative">
        <p className="text-sm font-medium text-indigo-500 mb-3 tracking-wide uppercase">
          {copy.sub}
        </p>
        <h2 className="text-4xl xl:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          {copy.headline}
        </h2>
        <p className="text-gray-500 text-base leading-relaxed max-w-xs">
          {copy.desc}
        </p>
      </div>

      {/* Footer */}
      <p className="relative text-xs text-gray-400">
        © {new Date().getFullYear()} Imari. All rights reserved.
      </p>
    </div>
  )
}