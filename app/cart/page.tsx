"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import QuantityStepper from "@/components/QuantityStepper";
import { HandwrittenAside } from "@/components/PinnedNote";
import { YarnBall } from "@/components/doodles";
import { currency } from "@/lib/brand";
import { FREE_SHIPPING_FROM, useCart } from "@/lib/cart";

export default function CartPage() {
  const { lines, subtotal, setQty, remove, ready } = useCart();
  const toFree = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <h1 className="font-hand text-[38px] leading-tight text-sage-900 sm:text-[48px]">Your basket</h1>

        {!ready ? (
          <div className="mt-8 h-40 animate-pulse rounded-card bg-cream-100" />
        ) : lines.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-[28px] bg-cream-100 px-6 py-16 text-center">
            <YarnBall size={90} className="floaty text-sage-600" />
            <p className="mt-4 font-hand text-[28px] text-sage-900">Your basket is feeling a little empty</p>
            <p className="mt-1 text-[14px] text-muted">Let&apos;s find something soft to fill it.</p>
            <Link href="/shop" className="btn-primary group mt-6">
              Start shopping <ArrowRight size={18} className="arrow-nudge" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 rounded-card bg-cream-100 p-3 sm:p-4">
                  <Link href={`/product/${l.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[14px] sm:h-28 sm:w-28">
                    <ProductImage src={l.product.images[0]} alt={l.product.name} doodleSize={52} sizes="112px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/product/${l.slug}`} className="font-hand text-[20px] leading-tight tracking-wide text-sage-900 hover:text-sage-600">
                          {l.product.name}
                        </Link>
                        <p className="text-[13px] text-muted">{[l.color, l.size].filter(Boolean).join(" · ") || "Handmade"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.key)}
                        aria-label={`Remove ${l.product.name}`}
                        className="icon-btn h-9 w-9 shrink-0 text-muted hover:text-terracotta"
                      >
                        <Trash2 size={17} strokeWidth={1.6} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <QuantityStepper size="sm" value={l.qty} onChange={(n) => setQty(l.key, n)} />
                      <span className="font-logo text-[17px] font-semibold text-sage-900">{currency(l.lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-card bg-cream-200 p-6 shadow-soft lg:sticky lg:top-6">
              <p className="font-hand text-[24px] text-sage-900">Order summary</p>
              <div className="mt-4 flex justify-between text-[15px]">
                <span className="text-muted">Subtotal</span>
                <span className="font-logo font-semibold text-sage-900">{currency(subtotal)}</span>
              </div>
              <p className="mt-2 text-[13px] text-muted">
                {toFree > 0 ? (
                  <>Add <b className="text-sage-900">{currency(toFree)}</b> more for free standard delivery ♡</>
                ) : (
                  <>Yay — free standard delivery unlocked ♡</>
                )}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-pill bg-cream-50">
                <div className="h-full rounded-pill bg-sage-600 transition-all" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }} />
              </div>
              <Link href="/checkout" className="btn-primary group mt-6 w-full">
                Checkout <ArrowRight size={18} className="arrow-nudge" />
              </Link>
              <Link href="/shop" className="btn-ghost mt-3 w-full justify-center">Keep shopping</Link>
              <HandwrittenAside className="mt-5 text-sage-700">thank you for supporting handmade</HandwrittenAside>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
