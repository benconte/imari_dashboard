"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Params = {
  adminId: string;
};

function MfaSearchParamsClient({ onParams }: { onParams: (p: Params) => void }) {
  const searchParams = useSearchParams();

  const [params, setParams] = useState<Params>({ adminId: "" });

  useEffect(() => {
    setParams({ adminId: searchParams.get("adminId") ?? "" });
  }, [searchParams]);

  useEffect(() => {
    onParams(params);
  }, [onParams, params]);

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

