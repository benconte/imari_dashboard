"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Params = {
  callbackUrl: string | null;
  errorParam: string | null;
};

function LoginSearchParamsClient({ onParams }: { onParams: (p: Params) => void }) {
  const searchParams = useSearchParams();

  // Read search params (requires Suspense boundary).
  const callbackUrl = searchParams.get("callbackUrl");
  const errorParam = searchParams.get("error");

  // IMPORTANT: never call parent state setters during render.
  // Use an effect so React doesn't enter a re-render loop in dev.
  useEffect(() => {
    onParams({ callbackUrl, errorParam });
  }, [callbackUrl, errorParam, onParams]);

  return null;
}


export function LoginSearchParamsSuspense({
  onParams,
}: {
  onParams: (p: Params) => void;
}) {
  return (
    <Suspense fallback={null}>
      <LoginSearchParamsClient onParams={onParams} />
    </Suspense>
  );
}


