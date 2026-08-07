"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImage({
  images,
  alt,
  badge,
  discount,
}: {
  images: string[];
  alt: string;
  badge?: string;
  discount?: number | null;
}) {
  const gallery = images.length > 0 ? images : ["/placeholder.png"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-line bg-cloud">
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-6"
          priority
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-ink text-paper text-xs font-medium px-3 py-1.5 rounded-full">
            {badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-4 right-4 bg-signal text-white text-xs font-bold px-3 py-1.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-5 gap-3 mt-4">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border bg-cloud transition-colors ${
                active === i ? "border-signal" : "border-line hover:border-steel"
              }`}
              aria-label={`View image ${i + 1} of ${gallery.length}`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="20vw"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}