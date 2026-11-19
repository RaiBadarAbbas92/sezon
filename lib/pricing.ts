// Shared pricing rules so cart, checkout and the orders API always agree.
// Plain module (no "use client") so server routes can import the real values.
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
