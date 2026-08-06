"use client";

import Script from "next/script";

/**
 * Loads the Klump checkout SDK exactly once for the whole app.
 *
 * IMPORTANT DISCOVERY: klump.js declares `class Klump { ... }` as a plain
 * top-level script binding. In browsers, top-level class/let/const
 * declarations do NOT become `window` properties (only `var` and function
 * declarations do). So `window.Klump` never appears on its own — this is
 * true regardless of how the script is loaded, blockers, timing, etc.
 * We have to bridge it onto `window` ourselves after the script executes.
 *
 * We do this via `new Function(...)`, which evaluates in the global scope
 * (like indirect eval) rather than our bundle's local module scope — that's
 * required to actually see the `Klump` identifier the classic <script>
 * declared, since a normal reference to a bare `Klump` name from inside our
 * webpack-bundled code would just throw "Klump is not defined".
 */
function bridgeGlobalKlump(): boolean {
  try {
    // eslint-disable-next-line no-new-func
    const globalKlump = new Function(
      "return typeof Klump !== 'undefined' ? Klump : undefined;"
    )();
    if (globalKlump) {
      (window as any).Klump = globalKlump;
      console.debug("[Klump] bridged global `class Klump` -> window.Klump", globalKlump);
      return true;
    }
    console.error("[Klump] script executed but no global `Klump` class was found");
    return false;
  } catch (err) {
    console.error("[Klump] error while bridging global Klump", err);
    return false;
  }
}

export default function KlumpScriptLoader() {
  return (
    <>
      {/*
        Klump's SDK reads this div ONCE, synchronously, when the script first
        executes (looking for id="klump__checkout" or "klump__cms__checkout"),
        and stores a reference to it internally as `klumpCheckout`. If this
        div doesn't exist yet at that moment, their internal reference stays
        undefined forever — even if you add the div to the DOM later — which
        is exactly what caused "Cannot read properties of undefined (reading
        'appendChild')" when calling new Klump(...). It must be present
        BEFORE the script runs, so it lives here, permanently, hidden, next
        to the script tag itself (rather than inside the checkout page,
        which may mount/unmount conditionally).
      */}
      <div id="klump__checkout" style={{ display: "none" }} />
      <Script
        id="klump-checkout-script"
        src="https://js.useklump.com/klump.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.debug("[Klump] script onLoad fired, attempting bridge...");
          const ok = bridgeGlobalKlump();
          window.dispatchEvent(new Event(ok ? "klump:script-onload" : "klump:script-error"));
        }}
        onError={(e) => {
          console.error("[Klump] script failed to load", e);
          window.dispatchEvent(new Event("klump:script-error"));
        }}
      />
    </>
  );
}