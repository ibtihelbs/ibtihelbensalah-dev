"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the first client render,
 * then true after hydration. Safe replacement for the
 * `useState(false) + useEffect(() => setMounted(true))` pattern.
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
