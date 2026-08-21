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
        klump__checkout is the div Klump writes its modal into.
        It must exist in the DOM before the script runs.
        Visibility is toggled by KlumpCheckoutButton directly.
      */}
      <div id="klump__checkout" style={{ display: "none" }} />
    </>
  );
}