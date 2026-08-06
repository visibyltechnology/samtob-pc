"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Klump: any;
  }
}

export type KlumpReadyState = "checking" | "ready" | "error";

const DEBUG_PREFIX = "[Klump]";

/**
 * Watches for window.Klump becoming available (set by the <Script> tag in
 * app/layout.tsx). Does NOT inject any script itself — script loading is
 * entirely owned by next/script now, deduped by Next.js.
 *
 * Every log line is prefixed "[Klump]" so you can filter the console by that
 * string and see the full timeline: script load event -> polling ticks ->
 * ready/error.
 */
export function useKlumpReady(): KlumpReadyState {
  const [state, setState] = useState<KlumpReadyState>(() => {
    if (typeof window !== "undefined" && window.Klump) return "ready";
    return "checking";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Klump) {
      console.debug(DEBUG_PREFIX, "window.Klump already present on mount");
      setState("ready");
      return;
    }

    console.debug(DEBUG_PREFIX, "waiting for window.Klump...");

    let cancelled = false;
    let pollCount = 0;
    const startedAt = Date.now();

    const checkNow = () => {
      pollCount++;
      const hasKlump = typeof window !== "undefined" && !!window.Klump;
      console.debug(
        DEBUG_PREFIX,
        `poll #${pollCount} @ +${Date.now() - startedAt}ms — window.Klump ${
          hasKlump ? "FOUND" : "not yet present"
        }`
      );
      if (hasKlump && !cancelled) {
        console.debug(DEBUG_PREFIX, "ready ✅", window.Klump);
        setState("ready");
        return true;
      }
      return false;
    };

    // In case the script already loaded before this component mounted
    if (checkNow()) return;

    const onScriptLoaded = () => {
      console.debug(DEBUG_PREFIX, "received klump:script-onload event, checking...");
      checkNow();
    };
    const onScriptError = () => {
      console.error(DEBUG_PREFIX, "received klump:script-error event");
      if (!cancelled) setState("error");
    };

    window.addEventListener("klump:script-onload", onScriptLoaded);
    window.addEventListener("klump:script-error", onScriptError);

    // Also poll as a fallback, in case the onload event fired before this
    // component mounted (event listener added too late to catch it) or the
    // vendor script sets window.Klump asynchronously after its own onload.
    const interval = setInterval(() => {
      if (checkNow() || cancelled) {
        clearInterval(interval);
        return;
      }
      if (Date.now() - startedAt > 10000) {
        console.error(DEBUG_PREFIX, "timed out after 10s waiting for window.Klump");
        clearInterval(interval);
        if (!cancelled) setState("error");
      }
    }, 200);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("klump:script-onload", onScriptLoaded);
      window.removeEventListener("klump:script-error", onScriptError);
    };
  }, []);

  return state;
}