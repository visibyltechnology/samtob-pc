import { database } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Laptops, Phones & Gadgets",
  description: "Browse new & UK used laptops, phones and gadgets at SAMTOB P&C. Filter by category, brand, condition and price.",
};

type SearchParams = {
  category?: string;
  condition?: string;
  brand?: string;
  q?: string;
  sort?: string;
};

const CATEGORIES = ["laptops", "phones", "gadgets"];
const CONDITIONS = [
  { value: "new", label: "Brand New" },
  { value: "uk-used", label: "UK Used" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  let products = await database.getProducts();

  if (sp.category) products = products.filter((p) => p.category === sp.category);
  if (sp.condition) products = products.filter((p) => p.condition === sp.condition);
  if (sp.brand) products = products.filter((p) => p.brand.toLowerCase() === sp.brand!.toLowerCase());
  if (sp.q) {
    const q = sp.q.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }
  if (sp.sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sp.sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);

  const allProducts = await database.getProducts();
  const brands = Array.from(new Set(allProducts.map((p) => p.brand))).sort();

  function buildHref(overrides: Partial<SearchParams>) {
    const params = new URLSearchParams({ ...sp, ...overrides } as Record<string, string>);
    Object.keys(overrides).forEach((k) => {
      if (!overrides[k as keyof SearchParams]) params.delete(k);
    });
    const s = params.toString();
    return s ? `/products?${s}` : "/products";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-data uppercase tracking-widest text-signal">Catalogue</span>
        <h1 className="font-display font-bold text-3xl mt-1">Shop all products</h1>
        <form action="/products" method="GET" className="mt-5 max-w-md flex gap-2">
          {sp.category && <input type="hidden" name="category" value={sp.category} />}
          <input
            type="text"
            name="q"
            defaultValue={sp.q}
            placeholder="Search laptops, phones, brands..."
            className="flex-1 border border-line rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-signal"
          />
          <button className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm font-medium hover:bg-signal transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        {/* FILTERS */}
        <aside className="space-y-8">
          <div>
            <h3 className="font-display font-semibold text-sm mb-3">Category</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={buildHref({ category: undefined })} className={!sp.category ? "text-signal font-medium" : "text-steel hover:text-ink"}>
                  All categories
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link href={buildHref({ category: c })} className={sp.category === c ? "text-signal font-medium capitalize" : "text-steel hover:text-ink capitalize"}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-3">Condition</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={buildHref({ condition: undefined })} className={!sp.condition ? "text-signal font-medium" : "text-steel hover:text-ink"}>
                  All conditions
                </Link>
              </li>
              {CONDITIONS.map((c) => (
                <li key={c.value}>
                  <Link href={buildHref({ condition: c.value })} className={sp.condition === c.value ? "text-signal font-medium" : "text-steel hover:text-ink"}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-3">Brand</h3>
            <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
              <li>
                <Link href={buildHref({ brand: undefined })} className={!sp.brand ? "text-signal font-medium" : "text-steel hover:text-ink"}>
                  All brands
                </Link>
              </li>
              {brands.map((b) => (
                <li key={b}>
                  <Link href={buildHref({ brand: b })} className={sp.brand === b ? "text-signal font-medium" : "text-steel hover:text-ink"}>
                    {b}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-3">Sort by price</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={buildHref({ sort: "price-asc" })} className={sp.sort === "price-asc" ? "text-signal font-medium" : "text-steel hover:text-ink"}>
                  Low to High
                </Link>
              </li>
              <li>
                <Link href={buildHref({ sort: "price-desc" })} className={sp.sort === "price-desc" ? "text-signal font-medium" : "text-steel hover:text-ink"}>
                  High to Low
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* GRID */}
        <div>
          <p className="text-sm text-steel mb-5 font-data">{products.length} product{products.length !== 1 ? "s" : ""} found</p>
          {products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-line rounded-2xl">
              <p className="text-steel">No products match those filters yet.</p>
              <Link href="/products" className="text-signal text-sm font-medium mt-2 inline-block">Clear filters</Link>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </div>
    </div>
  );
}
