import Link from "next/link";
import { Phone } from "lucide-react";
import Reveal from "./motion/Reveal";

function InstagramMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="font-display font-bold text-lg mb-3">
            <span className="text-signal-bright">SAM</span>TOB <span className="text-xs font-data font-normal text-paper/50 tracking-widest align-middle">P&amp;C</span>
          </div>
          <p className="text-sm text-paper/60 leading-relaxed">
            Trusted signal for new &amp; UK used laptops, phones and gadgets — shipped nationwide across Nigeria.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="https://www.instagram.com/samtobpc" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-paper/20 hover:border-signal hover:text-signal-bright transition-colors">
              <InstagramMark />
            </a>
            <a href="https://www.facebook.com/samtobpc" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-paper/20 hover:border-signal hover:text-signal-bright transition-colors">
              <FacebookMark />
            </a>
            <a href="https://wa.me/c/2348034436491" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-paper/20 hover:border-signal hover:text-signal-bright transition-colors">
              <Phone size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm tracking-wide mb-4 text-paper/90">Shop</h4>
          <ul className="space-y-2.5 text-sm text-paper/60">
            <li><Link href="/products?category=laptops" className="hover:text-signal-bright">Laptops</Link></li>
            <li><Link href="/products?category=phones" className="hover:text-signal-bright">Phones</Link></li>
            <li><Link href="/products?category=gadgets" className="hover:text-signal-bright">Gadgets</Link></li>
            <li><Link href="/products" className="hover:text-signal-bright">All Products</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm tracking-wide mb-4 text-paper/90">Support</h4>
          <ul className="space-y-2.5 text-sm text-paper/60">
            <li><Link href="/faq" className="hover:text-signal-bright">FAQ</Link></li>
            <li><Link href="/delivery" className="hover:text-signal-bright">Delivery &amp; Shipping</Link></li>
            <li><Link href="/stores" className="hover:text-signal-bright">Store Locations</Link></li>
            <li><Link href="/account/orders" className="hover:text-signal-bright">Track My Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm tracking-wide mb-4 text-paper/90">Contact</h4>
          <ul className="space-y-2.5 text-sm text-paper/60 font-data">
            <li>Mokola: 08154900493</li>
            <li>Iwo Road: 07060704481</li>
            <li>Challenge: 08088924598</li>
            <li className="pt-1">Mon–Fri 9am–6pm</li>
            <li>Sat 9:30am–5pm · Sun Closed</li>
          </ul>
        </div>
      </Reveal>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} SAMTOB P&amp;C. All rights reserved.
      </div>
    </footer>
  );
}
