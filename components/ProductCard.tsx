"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Heart, Plus } from "lucide-react";
import { currency } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import ProductImage from "./ProductImage";
import Stars from "./Stars";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const pink = index % 2 === 1;

  const quickAdd = () => {
    add(product.slug, 1, { color: product.colors?.[0]?.name, size: product.sizes?.[0] });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article
      className={`group relative flex flex-col rounded-card p-2.5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-3 ${pink ? "bg-blush-100 hover:bg-blush-200" : "bg-cream-200"}`}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          doodleSize={84}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {product.oldPrice && (
          <span className="absolute left-2.5 top-2.5 rounded-pill bg-cream-50 px-2.5 py-0.5 font-hand text-[13px] tracking-wide text-sage-900">
            sale
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => setLiked((v) => !v)}
        aria-pressed={liked}
        aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-pill bg-cream-50/90 text-sage-900 shadow-soft transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
      >
        <Heart size={18} strokeWidth={1.6} className={liked ? "fill-blush-200 text-wood" : ""} />
      </button>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        <Link href={`/product/${product.slug}`} className="focus-visible:outline-none focus-visible:underline">
          <h3 className="font-hand text-[18px] leading-tight tracking-wide text-sage-900 sm:text-[20px]">{product.name}</h3>
        </Link>
        <Stars rating={product.rating} count={product.reviews} className="mt-1" />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-logo text-[17px] font-semibold text-sage-900 sm:text-[19px]">{currency(product.price)}</span>
            {product.oldPrice && (
              <span className="font-logo text-[13px] text-wood line-through">{currency(product.oldPrice)}</span>
            )}
          </p>
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-sage-700 text-cream-50 shadow-soft transition-all hover:bg-sage-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </article>
  );
}
