"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "./products";

export interface CartLine {
  key: string; // slug + options, so the same toy in two colours is two lines
  slug: string;
  qty: number;
  color?: string;
  size?: string;
}

export interface CartLineDetail extends CartLine {
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLineDetail[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (slug: string, qty?: number, opts?: { color?: string; size?: string }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "sezon-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => getProduct(l.slug)) : [];
  } catch {
    return [];
  }
}

function writeStorage(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // private mode / storage blocked — cart still works for this visit
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRaw(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStorage(raw);
  }, [raw, ready]);

  const add = useCallback<CartContextValue["add"]>((slug, qty = 1, opts = {}) => {
    const key = [slug, opts.color, opts.size].filter(Boolean).join("|");
    setRaw((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 20) } : l));
      return [...prev, { key, slug, qty, ...opts }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 20) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setRaw((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = raw
      .map((l) => {
        const product = getProduct(l.slug);
        return product ? { ...l, product, lineTotal: product.price * l.qty } : null;
      })
      .filter((l): l is CartLineDetail => l !== null);
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
    };
  }, [raw, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

// Shared pricing rules so cart and checkout always agree.
export const FREE_SHIPPING_FROM = 5000;
export const shippingMethods = [
  { id: "standard", label: "Standard delivery", eta: "3–5 working days", price: 250 },
  { id: "express", label: "Express delivery", eta: "1–2 working days", price: 450 },
] as const;
export type ShippingId = (typeof shippingMethods)[number]["id"];
export const GIFT_WRAP_PRICE = 150;
export const coupons: Record<string, number> = { SEZON10: 0.1, HANDMADE15: 0.15 };

export function shippingCost(method: ShippingId, subtotal: number) {
  const m = shippingMethods.find((s) => s.id === method)!;
  if (method === "standard" && subtotal >= FREE_SHIPPING_FROM) return 0;
  return m.price;
}
