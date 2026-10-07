import { database, formatNaira } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SignalBars from "@/components/SignalBars";
import AddToCartForm from "@/components/AddToCartForm";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import StickyAddToCart from "@/components/StickyAddToCart";
import Reveal from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ShieldCheck, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await database.getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await database.getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await database.getProducts();
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs text-steel font-data mb-8 flex gap-2">
        <Link href="/products" className="hover:text-signal">Shop</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-signal capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        <ProductImage
          images={product.images}
          alt={product.name}
          badge={product.condition === "new" ? "Brand New" : "UK Used"}
          discount={discount}
        />

        <Reveal delay={0.1}>
          <span className="text-xs uppercase tracking-widest text-steel font-data">{product.brand}</span>
          <h1 className="font-display font-bold text-3xl mt-1">{product.name}</h1>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-data font-bold text-2xl">{formatNaira(product.price)}</span>
            {product.oldPrice && (
              <span className="font-data text-steel line-through text-base">{formatNaira(product.oldPrice)}</span>
            )}
          </div>

          <div className="mt-3">
            <SignalBars stock={product.stock} />
          </div>

          <p className="text-steel mt-5 leading-relaxed">{product.description}</p>

          {Object.keys(product.specs).length > 0 && (
            <div className="mt-6 border border-line rounded-xl divide-y divide-line overflow-hidden">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="capitalize text-steel">{key}</span>
                  <span className="font-data font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-7">
            <AddToCartForm
              productId={product.id}
              name={product.name}
              price={product.price}
              image={product.images[0]}
              stock={product.stock}
            />
          </div>

          <div className="mt-8 space-y-3 border-t border-line pt-6">
            <div className="flex items-start gap-3 text-sm">
              <ShieldCheck size={18} className="text-signal shrink-0 mt-0.5" />
              <span className="text-steel">
                {product.warrantyDays >= 365
                  ? "1 year full warranty on this brand new device."
                  : `${product.warrantyDays} days warranty on this UK used device (excludes user/physical/power damage).`}
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Truck size={18} className="text-signal shrink-0 mt-0.5" />
              <span className="text-steel">Free delivery within Ibadan on orders ₦100,000+. Nationwide shipping available.</span>
            </div>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <h2 className="font-display font-bold text-2xl mb-6">You may also like</h2>
          </Reveal>
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}

      <StickyAddToCart
        productId={product.id}
        name={product.name}
        price={product.price}
        image={product.images[0]}
        stock={product.stock}
      />
    </div>
  );
}