"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Star } from "lucide-react";
import { useToast } from "@/components/motion/Toast";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
      showToast(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`, "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function makePrimary(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [chosen] = next.splice(index, 1);
    next.unshift(chosen);
    onChange(next);
  }

  return (
    <div>
      <label className="block text-xs font-medium text-steel mb-2">Product Images</label>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <AnimatePresence initial={false}>
          {images.map((src, i) => (
            <motion.div
              key={src + i}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-[#F5F4F0] border border-line group"
            >
              <Image src={src} alt={`Image ${i + 1}`} fill className="object-contain p-1.5" />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-ink text-white text-[9px] px-1.5 py-0.5 rounded-full font-data">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(i)}
                    aria-label="Make primary image"
                    className="p-1.5 bg-white rounded-full hover:text-signal"
                  >
                    <Star size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                  className="p-1.5 bg-white rounded-full hover:text-signal"
                >
                  <X size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-lg border-2 border-dashed border-line hover:border-signal flex flex-col items-center justify-center gap-1 text-steel hover:text-signal transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-[10px]">{uploading ? "Uploading..." : "Add"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <p className="text-[11px] text-steel">JPG, PNG, WEBP or GIF, up to 5MB each. First image is used as the primary photo.</p>
    </div>
  );
}
