import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/motion/Toast";
import KlumpScriptLoader from "../components/KlumpScriptLoader";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.samtobpc.com"),
  title: {
    default: "SAMTOB P&C | Laptops, Phones & Gadgets — Nationwide Delivery",
    template: "%s | SAMTOB P&C",
  },
  description:
    "SAMTOB P&C sells new & UK used laptops, phones and gadgets, delivered nationwide across Nigeria. Shop online with trade-in, repairs, and warranty on every device.",
  keywords: [
    "SAMTOB P&C",
    "buy laptops Nigeria",
    "UK used laptops Nigeria",
    "buy phones online Nigeria",
    "buy laptop online Nigeria",
    "gadgets Nigeria",
  ],
  openGraph: {
    title: "SAMTOB P&C | Laptops, Phones & Gadgets — Nationwide Delivery",
    description:
      "New & UK used laptops, phones and gadgets. Shop online, pay on delivery options, nationwide shipping.",
    url: "https://www.samtobpc.com",
    siteName: "SAMTOB P&C",
    locale: "en_NG",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </AuthProvider>

        {/*
          Loaded ONCE here, globally, for the whole app — not inside the
          checkout page or the button component. next/script dedupes by
          id/src internally, so this is only ever inserted/executed once
          no matter how many times you navigate to /checkout or how many
          times React re-renders in dev.
        */}
        <KlumpScriptLoader />
      </body>
    </html>
  );
}