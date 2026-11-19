// Checkout → Supabase `orders` + `order_items` (Bustaniya schema), so orders show up in the admin panel.
// Prices are re-read from the catalogue here; the browser's numbers are never trusted.
import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { coupons, GIFT_WRAP_PRICE, shippingCost, shippingMethods, type ShippingId } from "@/lib/pricing";
import { supabaseAdminConfigured, supabaseRequest } from "@/lib/supabase";

interface OrderBody {
  customer?: { name?: string; phone?: string; email?: string; city?: string; address?: string; landmark?: string; notes?: string };
  items?: { slug?: string; qty?: number; color?: string; size?: string }[];
  shipping?: string;
  payment?: string;
  coupon?: string | null;
  giftWrap?: boolean;
  giftNote?: string;
}

const payments = ["cod", "bank", "jazzcash", "easypaisa", "card"];
const clean = (v: unknown, max = 300) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  if (!supabaseAdminConfigured) {
    return NextResponse.json({ error: "Orders are not connected yet (Supabase service key missing)." }, { status: 503 });
  }

  let body: OrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const c = body.customer ?? {};
  const phone = clean(c.phone, 20).replace(/[\s-]/g, "").replace(/^3/, "03");
  const customer = {
    name: clean(c.name, 120),
    phone,
    email: clean(c.email, 160),
    city: clean(c.city, 80),
    address: clean(c.address, 400),
    landmark: clean(c.landmark, 200),
    notes: clean(c.notes, 600),
  };
  if (customer.name.length < 2 || !/^03\d{9}$/.test(phone) || !customer.city || customer.address.length < 10) {
    return NextResponse.json({ error: "Please check your name, phone, city and address." }, { status: 400 });
  }

  const shipping = (shippingMethods.some((s) => s.id === body.shipping) ? body.shipping : "standard") as ShippingId;
  const payment = payments.includes(String(body.payment)) ? String(body.payment) : "cod";

  const { products } = await getCatalog();
  const lines = (body.items ?? []).slice(0, 30).map((item) => {
    const product = products.find((p) => p.slug === item.slug);
    const qty = Math.min(Math.max(Math.floor(Number(item.qty) || 0), 1), 20);
    return product ? { product, qty, color: clean(item.color, 60), size: clean(item.size, 60) } : null;
  });
  if (!lines.length || lines.some((l) => l === null)) {
    return NextResponse.json({ error: "Some items in your cart are no longer available." }, { status: 409 });
  }
  const items = lines.filter((l) => l !== null);

  const subtotal = items.reduce((n, l) => n + l.product.price * l.qty, 0);
  const code = body.coupon ? String(body.coupon).toUpperCase() : null;
  const discount = code && coupons[code] ? Math.round(subtotal * coupons[code]) : 0;
  const delivery = shippingCost(shipping, subtotal) + (body.giftWrap ? GIFT_WRAP_PRICE : 0);
  const total = subtotal - discount + delivery;
  const orderNumber = `SZ-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

  const noteParts = [
    customer.notes,
    customer.landmark && `Landmark: ${customer.landmark}`,
    code && discount && `Coupon ${code}: -${discount}`,
    body.giftWrap && `Gift wrap${body.giftNote ? ` — note: ${clean(body.giftNote, 300)}` : ""}`,
    payment !== "cod" && `Paid via ${payment} — receipt to be confirmed on WhatsApp`,
  ].filter(Boolean);

  try {
    const [order] = await supabaseRequest<{ id: string }[]>("orders", {
      method: "POST",
      admin: true,
      prefer: "return=representation",
      body: {
        order_number: orderNumber,
        status: "pending",
        payment_method: payment === "cod" ? "cod" : "full_advance",
        subtotal,
        subtotal_pkr: subtotal,
        shipping_fee_pkr: delivery,
        delivery_pkr: delivery,
        total,
        total_pkr: total,
        shipping_full_name: customer.name,
        shipping_phone: customer.phone,
        shipping_line1: customer.address,
        shipping_address: customer.address,
        shipping_city: customer.city,
        shipping_country: "Pakistan",
        guest_name: customer.name,
        guest_phone: customer.phone,
        guest_email: customer.email || null,
        customer_email: customer.email || null,
        notes: noteParts.join(" · ") || null,
        tags: ["sezon-web"],
        items: items.map((l) => ({
          slug: l.product.slug,
          name: l.product.name,
          price: l.product.price,
          quantity: l.qty,
          size: l.size || null,
          color: l.color || null,
        })),
      },
    });

    await supabaseRequest("order_items", {
      method: "POST",
      admin: true,
      body: items.map((l) => ({
        order_id: order.id,
        product_id: /^\d+$/.test(l.product.id) ? Number(l.product.id) : null,
        title: l.product.name,
        price_pkr: l.product.price,
        unit_price_pkr: l.product.price,
        quantity: l.qty,
        line_total_pkr: l.product.price * l.qty,
        size: l.size || null,
        color: l.color || null,
        image_url: l.product.images[0]?.startsWith("ph:") ? null : l.product.images[0],
      })),
    });

    return NextResponse.json({ ok: true, orderNo: orderNumber, total });
  } catch (err) {
    console.error("[orders] insert failed:", err);
    return NextResponse.json({ error: "We couldn't place your order. Please try again or WhatsApp us." }, { status: 500 });
  }
}
