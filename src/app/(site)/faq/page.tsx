import type { Metadata } from "next";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about SAMTOB P&C products, warranty, delivery, repairs, trade-ins and refund policy.",
};

const FAQS = [
  {
    q: "What products does SAMTOB P&C offer?",
    a: "We sell laptops, phones and gadgets — both brand new and UK used.",
  },
  {
    q: "What time do you open your physical stores in Ibadan?",
    a: "Mon–Fri: 9am – 6pm. Saturday: 9:30am – 5pm. Sundays: Closed.",
  },
  {
    q: "How many years of guaranty do you offer on a laptop or mobile?",
    a: "Brand new devices come with a 1-year warranty. UK used devices come with a 30 days warranty (laptop/mobile only).",
  },
  {
    q: "My UK used laptop ran into a problem after 30 days of purchase — what can I do?",
    a: "Please visit our local store or schedule a pickup service. Our professional technicians will be glad to help, during or after the expiration of your warranty/guaranty. Note: user damage, physical damage and power-related damages are not covered by guaranty/warranty — however our technicians are available to fix these at a token fee.",
  },
  {
    q: "Can I swap my old device for a new one with SAMTOB P&C?",
    a: "Yes — if you purchased your device from us, we accept trade-ins. We don't accept products bought elsewhere, for genuine reasons.",
  },
  {
    q: "Do you offer delivery service?",
    a: "Yes. Free delivery on orders ₦100,000 and above within Ibadan. We also deliver nationwide.",
  },
  {
    q: "Can I repair my faulty device at SAMTOB P&C?",
    a: "Yes — we offer professional repair services at an affordable fee.",
  },
  {
    q: "Can I buy your products online?",
    a: "Yes, you can buy and pay directly from our website or from our WhatsApp catalogue.",
  },
  {
    q: "Can I get a cash refund after a purchase has been made?",
    a: "We're sorry, we have no cash refund policy. However, any reason for a refund request will be duly addressed with a win-win approach.",
  },
  {
    q: "My question isn't listed here.",
    a: "Please leave us a message — we'll attend to you shortly.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs font-data uppercase tracking-widest text-signal">Support</span>
      <h1 className="font-display font-bold text-3xl mt-1 mb-2">Frequently Asked Questions</h1>
      <p className="text-steel mb-10">Everything you need to know before you buy from SAMTOB P&amp;C.</p>

      <FAQAccordion items={FAQS} />

      <div className="mt-10 rounded-2xl bg-ink text-paper p-7 text-center">
        <h2 className="font-display font-semibold text-lg mb-2">Still have a question?</h2>
        <p className="text-paper/60 text-sm mb-5">Our team replies fast on WhatsApp.</p>
        <a href="https://wa.me/c/2348034436491" target="_blank" rel="noopener noreferrer" className="inline-flex bg-signal text-white px-6 py-3 rounded-full text-sm font-medium hover:brightness-110 transition-all">
          Chat on WhatsApp
        </a>
      </div>

      <p className="text-center text-xs text-steel mt-8">
        Enjoyed shopping with us? <Link href="/stores" className="text-signal">Visit a store</Link> or leave us a review below.
      </p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 text-xs">
        <a href="https://g.page/r/CXNGNI_XwjLiEBM/review" target="_blank" rel="noopener noreferrer" className="text-signal underline">Google Review 1</a>
        <a href="https://jiji.ng/create-opinion/user437607" target="_blank" rel="noopener noreferrer" className="text-signal underline">Jiji Review</a>
        <a href="https://g.page/r/CXhMyf1FL9CgEAg/review" target="_blank" rel="noopener noreferrer" className="text-signal underline">Google Review 2</a>
        <a href="https://g.page/r/CZPUGEG--xoHEAg/review" target="_blank" rel="noopener noreferrer" className="text-signal underline">Google Review 3</a>
      </div>
    </div>
  );
}
