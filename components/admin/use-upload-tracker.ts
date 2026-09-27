"use client";

import { useCallback, useState } from "react";

/**
 * Tracks uploads running inside a form (a form can have several upload
 * fields). Pass `track` as the fields' `onUploadingChange`; while `uploading`
 * is true, the form's Save button should stay disabled.
 */
export function useUploadTracker() {
  const [count, setCount] = useState(0);
  const track = useCallback((uploading: boolean) => setCount((c) => Math.max(0, c + (uploading ? 1 : -1))), []);
  return { uploading: count > 0, track };
}
