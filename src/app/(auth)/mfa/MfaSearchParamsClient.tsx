"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Params = {
  adminId: string;
};

function MfaSearchParamsClient({ onParams }: { onParams: (p: Params) => void }) {
  const searchParams = useSearchParams();

  // params kept for backward compatibility; this page only needs adminId from query.
  const [params] = useState<Params>({ adminId: "" });


  // Keep a local state for compatibility with the existing callback.
  // (Note: this page is only used during /mfa setup/verification.)
  useEffect(() => {
    onParams({ adminId: searchParams.get("adminId") ?? "" })
  }, [onParams, searchParams]);

  return null;
}

export function MfaSearchParamsSuspense({
  onParams,
}: {
  onParams: (p: Params) => void;
}) {
  return (
    <Suspense fallback={null}>
      <MfaSearchParamsClient onParams={onParams} />
    </Suspense>
  );
}

