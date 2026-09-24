"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/actions/result";

/**
 * Runs a Server Action inside a transition: exposes `pending`, shows an
 * error toast on failure, and an optional success toast.
 */
export function useAction() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run<T>(
    action: () => Promise<ActionResult<T>>,
    { onSuccess, onError, success }: { onSuccess?: (data: T) => void; onError?: () => void; success?: string } = {},
  ) {
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.ok) {
          toast.error(result.error);
          onError?.();
          // Session expired: go to the login page.
          if (result.code === "unauthenticated") router.replace("/admin/login");
          return;
        }
        onSuccess?.(result.data);
        if (success) toast.success(success);
      } catch {
        toast.error("Could not reach the server. Check your connection and try again.");
        onError?.();
      }
    });
  }

  return { pending, run };
}
