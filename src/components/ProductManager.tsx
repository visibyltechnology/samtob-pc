"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/db";
import { formatNaira } from "@/lib/format";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useToast } from "@/components/motion/Toast";
import ImageUploader from "@/components/ImageUploader";

const EMPTY: Partial<Product> = {
  name: "",
  category: "laptops",
  condition: "new",
  brand: "",
  price: 0,
  oldPrice: null,
  stock: 0,
  warrantyDays: 365,
  description: "",
  images: [],
  featured: false,
  specs: {},
};

export default function ProductManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.images || editing.images.length === 0) {
      showToast("Please upload at least one product image", "error");
      return;
    }
    setSaving(true);
    const isNew = !editing.id;
    try {
      const res = await fetch(isNew ? "/api/products" : `/api/products/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Save failed");
      setEditing(null);
      showToast(isNew ? "Product added" : "Product updated", "success");
      router.refresh();
    } catch {
      showToast("Could not save product. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    showToast("Product deleted", "info");
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display font-bold text-3xl">Products</h1>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center gap-2 bg-signal text-white px-5 py-2.5 rounded-full text-sm font-medium hover:brightness-110"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="border border-line rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium"></th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F5F4F0] border border-line">
                    <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-contain p-1" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium max-w-[240px] truncate">{p.name}</td>
                <td className="px-4 py-3 capitalize text-steel">{p.category}</td>
                <td className="px-4 py-3 font-data">{formatNaira(p.price)}</td>
                <td className="px-4 py-3 font-data">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(p)} aria-label="Edit" className="p-1.5 hover:text-signal">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} aria-label="Delete" className="p-1.5 hover:text-signal">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display font-semibold text-lg">{editing.id ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setEditing(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <ImageUploader
                images={editing.images || []}
                onChange={(images) => setEditing({ ...editing, images })}
              />
              <input required placeholder="Product name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as Product["category"] })} className="border border-line rounded-lg px-3 py-2 text-sm">
                  <option value="laptops">Laptops</option>
                  <option value="phones">Phones</option>
                  <option value="gadgets">Gadgets</option>
                </select>
                <select value={editing.condition} onChange={(e) => setEditing({ ...editing, condition: e.target.value as Product["condition"] })} className="border border-line rounded-lg px-3 py-2 text-sm">
                  <option value="new">Brand New</option>
                  <option value="uk-used">UK Used</option>
                </select>
              </div>
              <input required placeholder="Brand" value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Price (₦)" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="border border-line rounded-lg px-3 py-2 text-sm" />
                <input type="number" placeholder="Old price (optional)" value={editing.oldPrice || ""} onChange={(e) => setEditing({ ...editing, oldPrice: e.target.value ? Number(e.target.value) : null })} className="border border-line rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Stock quantity" value={editing.stock ?? ""} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="border border-line rounded-lg px-3 py-2 text-sm" />
                <input type="number" placeholder="Warranty (days)" value={editing.warrantyDays ?? ""} onChange={(e) => setEditing({ ...editing, warrantyDays: Number(e.target.value) })} className="border border-line rounded-lg px-3 py-2 text-sm" />
              </div>
              <textarea placeholder="Description" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Feature on homepage
              </label>
              <button disabled={saving} className="w-full bg-ink text-paper py-2.5 rounded-full text-sm font-medium hover:bg-signal transition-colors disabled:opacity-60">
                {saving ? "Saving..." : "Save Product"}
              </button>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
