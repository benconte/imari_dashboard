import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions, ROLE_HOME } from "@/lib/auth-options"
import { AdminRole } from "@/types/next-auth"

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: { from?: string }
}) {
  const session = await getServerSession(authOptions)
  const role    = session?.user?.role as AdminRole | undefined
  const home    = role ? ROLE_HOME[role] : "/login"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md text-center space-y-6">

        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 border border-red-100 mx-auto">
          <ShieldOffIcon />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            {searchParams.from ? (
              <>
                You don&apos;t have permission to access{" "}
                <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                  {searchParams.from}
                </span>.
              </>
            ) : (
              "You don't have permission to access this page."
            )}
          </p>
          {role && (
            <p className="text-xs text-gray-400">
              Signed in as{" "}
              <span className="font-medium text-gray-600">
                {role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={home}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Go to my dashboard
          </Link>
          {!session && (
            <Link
              href="/login"
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

function ShieldOffIcon() {
  return (
    <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}