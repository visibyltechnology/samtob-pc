import Link from "next/link";
import { Zap } from "lucide-react";
import type { Product } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/motion/Reveal";
import FlashSaleCountdown from "./FlashSaleCountdown";

export default function FlashSaleSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mb-8">
      <Reveal className="bg-white border border-line rounded-t-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b-0">
        <div className="flex items-center gap-3">
          <div className="font-display font-bold text-xl sm:text-2xl text-signal flex items-center gap-2">
            <Zap className="fill-signal animate-pulse" size={24} /> Flash Sale
          </div>
        </div>
        
        <FlashSaleCountdown />
        
        <Link href="/products" className="text-sm font-medium text-signal hover:underline">
          See All &rsaquo;
        </Link>
      </Reveal>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border border-line rounded-b-2xl p-4 sm:p-6 bg-white/50">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
