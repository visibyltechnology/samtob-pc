import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Repeat, Wrench } from "lucide-react";
import { database } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/home/Hero";
import TopBanner from "@/components/TopBanner";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import BrandMarquee from "@/components/home/BrandMarquee";
import Reveal from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import AnimatedCounter from "@/components/motion/AnimatedCounter";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await database.getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const flashSales = products.filter((p) => p.oldPrice && p.oldPrice > p.price);
  const reviews = await database.getReviews();

  return (
    <>
      <Hero />
      <TopBanner />
      <BrandMarquee />

      <FlashSaleSection products={flashSales} />

      {/* STATS STRIP */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: 3, suffix: "", label: "Physical Stores" },
            { value: products.length, suffix: "+", label: "Devices in stock" },
            { value: 1, suffix: "yr", label: "Warranty on new" },
            { value: 100, suffix: "%", label: "Tested before sale" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <p className="font-display font-bold text-3xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-steel mt-1 font-data uppercase tracking-wider">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          {[
            { label: "Laptops", href: "/products?category=laptops", desc: "New &amp; UK used, all specs" },
            { label: "Phones", href: "/products?category=phones", desc: "iPhone, Samsung &amp; more" },
            { label: "Gadgets", href: "/products?category=gadgets", desc: "Watches, speakers, accessories" },
          ].map((c) => (
            <StaggerItem key={c.href}>
              <Link
                href={c.href}
                className="group flex flex-row items-center justify-between sm:flex-col sm:items-start sm:block rounded-xl sm:rounded-2xl border border-line bg-white p-4 sm:p-7 hover:border-signal/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <span className="text-xs font-data uppercase tracking-widest text-steel hidden sm:block">Category</span>
                  <h3 className="font-display font-bold text-lg sm:text-2xl sm:mt-2 group-hover:text-signal transition-colors">
                    {c.label}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-steel mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-none" dangerouslySetInnerHTML={{ __html: c.desc }} />
                </div>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-signal/10 sm:bg-transparent text-signal sm:w-auto sm:h-auto sm:text-sm font-medium sm:mt-4 sm:rounded-none">
                  <span className="hidden sm:inline mr-1">Browse</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Reveal className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-data uppercase tracking-widest text-signal">On the shelf</span>
            <h2 className="font-display font-bold text-3xl mt-1">Featured devices</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-signal hover:underline hidden sm:inline">
            View all products →
          </Link>
        </Reveal>
        <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* TRUST STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Warranty on every device", desc: "1yr on new, 30 days warranty on UK used." },
            { icon: Truck, title: "Nationwide delivery", desc: "Free delivery on qualifying orders — shipped anywhere in Nigeria." },
            { icon: Repeat, title: "Trade-in accepted", desc: "Swap your old SAMTOB device for a new one." },
            { icon: Wrench, title: "Professional repairs", desc: "Affordable, expert repair services in-store." },
          ].map((f) => (
            <StaggerItem key={f.title}>
              <div className="w-11 h-11 rounded-full bg-signal/10 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-signal" />
              </div>
              <h3 className="font-display font-semibold text-base">{f.title}</h3>
              <p className="text-sm text-steel mt-1.5 leading-relaxed">{f.desc}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* REVIEWS */}
      <section className="bg-ink text-paper py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-data uppercase tracking-widest text-signal-bright">Customer signal</span>
              <h2 className="font-display font-bold text-3xl mt-1">What buyers are saying</h2>
            </div>
          </Reveal>
          <StaggerGrid className="grid sm:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <StaggerItem key={r.id}>
                <div className="rounded-2xl border border-paper/10 p-6 h-full hover:border-signal/40 transition-colors">
                  <div className="font-data text-signal-bright text-sm mb-3">{"★".repeat(r.rating)}</div>
                  <p className="text-sm text-paper/80 leading-relaxed">{r.text}</p>
                  <p className="text-xs text-paper/50 mt-4 font-data">— {r.name}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
          <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
            <a href="https://g.page/r/CXNGNI_XwjLiEBM/review" target="_blank" rel="noopener noreferrer" className="text-sm underline text-paper/70 hover:text-signal-bright">Leave a Google review</a>
            <span className="text-paper/30">·</span>
            <a href="https://jiji.ng/create-opinion/user437607" target="_blank" rel="noopener noreferrer" className="text-sm underline text-paper/70 hover:text-signal-bright">Leave a Jiji review</a>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl max-w-xl mx-auto">
            Have a question before you buy?
          </h2>
          <p className="text-steel mt-3">Our team replies fast on WhatsApp, or visit one of our stores.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/faq" className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors">
              Read FAQ
            </Link>
            <Link href="/stores" className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 rounded-full font-medium text-sm hover:border-signal hover:text-signal transition-colors">
              Find a store
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
