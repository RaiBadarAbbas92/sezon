"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Check,
  ChevronDown,
  CreditCard,
  Gift,
  Landmark,
  Lock,
  RotateCcw,
  Smartphone,
  Sparkles,
  Tag,
  Upload,
} from "lucide-react";
import Logo from "@/components/Logo";
import ProductImage from "@/components/ProductImage";
import RadioCard from "@/components/RadioCard";
import { HandwrittenAside } from "@/components/PinnedNote";
import { Heart, YarnBall } from "@/components/doodles";
import { brand, currency } from "@/lib/brand";
import {
  coupons,
  GIFT_WRAP_PRICE,
  shippingCost,
  shippingMethods,
  useCart,
  type ShippingId,
} from "@/lib/cart";

const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot",
  "Gujranwala", "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur", "Abbottabad", "Mardan", "Sahiwal", "Okara",
  "Rahim Yar Khan", "Gujrat", "Sheikhupura", "Jhelum", "Larkana", "Mirpur (AJK)", "Muzaffarabad", "Gilgit",
];

const payments = [
  { id: "cod", title: "Cash on Delivery", description: "Pay in cash when your parcel arrives", icon: Banknote },
  { id: "bank", title: "Bank transfer", description: "Meezan Bank · details below", icon: Landmark },
  { id: "jazzcash", title: "JazzCash", description: "Send to our JazzCash wallet", icon: Smartphone },
  { id: "easypaisa", title: "Easypaisa", description: "Send to our Easypaisa wallet", icon: Smartphone },
  { id: "card", title: "Debit / Credit card", description: "Visa, Mastercard — secure payment page", icon: CreditCard },
] as const;
type PaymentId = (typeof payments)[number]["id"];

// Placeholder receiving accounts — replace with the real ones in one place.
const accountDetails: Record<"bank" | "jazzcash" | "easypaisa", { label: string; value: string }[]> = {
  bank: [
    { label: "Bank", value: "Meezan Bank" },
    { label: "Account title", value: `${brand.name} Handmade` },
    { label: "IBAN", value: "PK00 MEZN 0000 0000 0000 0000" },
  ],
  jazzcash: [
    { label: "Account title", value: `${brand.name} Handmade` },
    { label: "Number", value: "0300 1234567" },
  ],
  easypaisa: [
    { label: "Account title", value: `${brand.name} Handmade` },
    { label: "Number", value: "0345 1234567" },
  ],
};

type Field = "name" | "phone" | "email" | "city" | "address" | "receipt";

const normalisePhone = (v: string) => v.replace(/[\s-]/g, "");
const isPkMobile = (v: string) => /^03\d{9}$/.test(normalisePhone(v)) || /^3\d{9}$/.test(normalisePhone(v));

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear, ready } = useCart();

  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", address: "", landmark: "", notes: "" });
  const [shipping, setShipping] = useState<ShippingId>("standard");
  const [payment, setPayment] = useState<PaymentId>("cod");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const touch = (k: Field) => () => setTouched((t) => ({ ...t, [k]: true }));

  const needsReceipt = payment === "bank" || payment === "jazzcash" || payment === "easypaisa";

  const errors = useMemo(() => {
    const e: Partial<Record<Field, string>> = {};
    if (form.name.trim().length < 2) e.name = "Please tell us your full name.";
    if (!form.phone.trim()) e.phone = "We need a number for the rider to call.";
    else if (!isPkMobile(form.phone)) e.phone = "Use a Pakistani mobile number, e.g. 0300 1234567.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "That email doesn't look right.";
    if (!cities.includes(form.city)) e.city = "Please pick your city from the list.";
    if (form.address.trim().length < 10) e.address = "Please add house no., street and area.";
    if (needsReceipt && !receipt) e.receipt = "Please upload a screenshot of your payment.";
    return e;
  }, [form, needsReceipt, receipt]);

  const show = (k: Field) => (submitted || touched[k]) && errors[k];

  const discount = coupon ? Math.round(subtotal * coupons[coupon]) : 0;
  const ship = shippingCost(shipping, subtotal);
  const wrap = giftWrap ? GIFT_WRAP_PRICE : 0;
  const total = subtotal - discount + ship + wrap;
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);

  const contactDone = !errors.name && !errors.phone && !errors.email;
  const deliveryDone = contactDone && !errors.city && !errors.address;
  const step = !contactDone ? 0 : !deliveryDone ? 1 : 2;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (coupons[code]) {
      setCoupon(code);
      setCouponMsg({ ok: true, text: `${code} applied — ${coupons[code] * 100}% off ♡` });
    } else {
      setCoupon(null);
      setCouponMsg({ ok: false, text: "That code didn't work. Try SEZON10?" });
    }
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const first = (Object.keys(errors) as Field[])[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    // Replace with a real API call (e.g. Supabase insert) — mock delay for now.
    await new Promise((r) => setTimeout(r, 1200));
    const orderNo = `SZ-${Date.now().toString().slice(-6)}`;
    try {
      sessionStorage.setItem(
        "sezon-last-order",
        JSON.stringify({ orderNo, name: form.name.trim(), total, city: form.city, payment, items: itemCount }),
      );
    } catch {
      // storage blocked — success page falls back to the order number in the URL
    }
    clear();
    router.push(`/order-success?order=${orderNo}`);
  };

  if (ready && lines.length === 0 && !submitting) {
    return (
      <>
        <CheckoutHeader />
        <main className="mx-auto flex max-w-[640px] flex-col items-center px-4 py-16 text-center">
          <YarnBall size={90} className="floaty text-sage-600" />
          <h1 className="mt-4 font-hand text-[32px] text-sage-900">Nothing to check out yet</h1>
          <p className="mt-1 text-[14px] text-muted">Your basket is empty — let&apos;s fix that.</p>
          <Link href="/shop" className="btn-primary mt-6">Browse the shop</Link>
        </main>
      </>
    );
  }

  const summary = (
    <div className="rounded-card bg-cream-200 p-5 shadow-soft sm:p-6">
      <p className="hidden font-hand text-[24px] text-sage-900 lg:block">Order summary</p>
      <ul className="space-y-3 lg:mt-4">
        {lines.map((l) => (
          <li key={l.key} className="flex items-center gap-3">
            <span className="relative h-16 w-16 shrink-0">
              <span className="absolute inset-0 overflow-hidden rounded-[12px]">
                <ProductImage src={l.product.images[0]} alt={l.product.name} doodleSize={34} sizes="64px" />
              </span>
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-pill bg-sage-700 px-1 font-logo text-[12px] font-semibold text-cream-50">
                {l.qty}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-hand text-[17px] tracking-wide text-sage-900">{l.product.name}</span>
              <span className="block text-[12px] text-muted">{[l.color, l.size].filter(Boolean).join(" · ")}</span>
            </span>
            <span className="font-logo text-[15px] font-semibold text-sage-900">{currency(l.lineTotal)}</span>
          </li>
        ))}
      </ul>

      {/* Gift wrap */}
      <div className="mt-5 rounded-[14px] bg-cream-50 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <Gift size={20} strokeWidth={1.6} className="text-sage-700" />
          <span className="flex-1 text-[14px] font-semibold text-sage-900">
            Gift wrap it <span className="font-normal text-muted">(+{currency(GIFT_WRAP_PRICE)})</span>
          </span>
          <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="peer sr-only" />
          <span
            aria-hidden
            className="relative h-6 w-11 rounded-pill bg-sage-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-pill after:bg-cream-50 after:shadow-soft after:transition-transform peer-checked:bg-sage-700 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-sage-600 peer-focus-visible:ring-offset-2"
          />
        </label>
        {giftWrap && (
          <textarea
            value={giftNote}
            onChange={(e) => setGiftNote(e.target.value.slice(0, 160))}
            placeholder="Write a little note — we'll handwrite it on a card ♡"
            rows={2}
            aria-label="Gift note"
            className="field mt-3 resize-none font-hand text-[16px] tracking-wide"
          />
        )}
      </div>

      {/* Coupon */}
      <div className="mt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag size={16} strokeWidth={1.6} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
              placeholder="Coupon code"
              aria-label="Coupon code"
              className="field rounded-pill py-2.5 pl-10 uppercase placeholder:normal-case"
            />
          </div>
          <button type="button" onClick={applyCoupon} className="btn-secondary px-5 py-2.5 text-[16px]">
            Apply
          </button>
        </div>
        {couponMsg && (
          <p className={`mt-1.5 pl-3 text-[13px] ${couponMsg.ok ? "text-sage-700" : "text-terracotta"}`}>{couponMsg.text}</p>
        )}
      </div>

      <dl className="mt-5 space-y-2 border-t border-sage-300/60 pt-4 text-[14px]">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}</dt>
          <dd className="font-logo font-semibold text-sage-900">{currency(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted">Discount ({coupon})</dt>
            <dd className="font-logo font-semibold text-sage-700">− {currency(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="font-logo font-semibold text-sage-900">{ship === 0 ? "Free" : currency(ship)}</dd>
        </div>
        {giftWrap && (
          <div className="flex justify-between">
            <dt className="text-muted">Gift wrap</dt>
            <dd className="font-logo font-semibold text-sage-900">{currency(wrap)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-sage-300/60 pt-3">
          <dt className="font-hand text-[20px] text-sage-900">Total</dt>
          <dd className="font-logo text-[24px] font-bold text-sage-900">{currency(total)}</dd>
        </div>
      </dl>

      <button type="submit" form="checkout-form" disabled={submitting} className="btn-primary mt-5 hidden w-full py-3.5 text-[20px] lg:inline-flex">
        {submitting ? "Placing your order…" : "Place order ♡"}
      </button>

      <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-[12px] text-muted">
        <li className="flex flex-col items-center gap-1"><Sparkles size={18} strokeWidth={1.6} className="text-sage-700" />Handmade</li>
        <li className="flex flex-col items-center gap-1"><Banknote size={18} strokeWidth={1.6} className="text-sage-700" />COD available</li>
        <li className="flex flex-col items-center gap-1"><RotateCcw size={18} strokeWidth={1.6} className="text-sage-700" />Easy returns</li>
      </ul>
      <div className="mt-5 flex justify-center text-sage-700">
        <HandwrittenAside>thank you for supporting handmade</HandwrittenAside>
      </div>
    </div>
  );

  return (
    <>
      <CheckoutHeader />
      <main className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
        <Steps step={step} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[60%_1fr] lg:gap-8">
          {/* Summary: first + collapsible on mobile, sticky right column on desktop */}
          <aside className="lg:order-last">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              aria-expanded={summaryOpen}
              className="mb-3 flex w-full items-center justify-between rounded-card bg-cream-200 px-5 py-4 shadow-soft lg:hidden"
            >
              <span className="inline-flex items-center gap-2 font-hand text-[18px] tracking-wide text-sage-900">
                {summaryOpen ? "Hide" : "Show"} order summary
                <ChevronDown size={18} className={`transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
              </span>
              <span className="font-logo text-[18px] font-bold text-sage-900">{currency(total)}</span>
            </button>
            <div className={`${summaryOpen ? "block" : "hidden"} lg:sticky lg:top-6 lg:block`}>{summary}</div>
          </aside>

          <form id="checkout-form" onSubmit={placeOrder} noValidate className="space-y-5">
            <Section n={1} title="Contact">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="f-name" className="label">Full name</label>
                  <input id="f-name" autoComplete="name" value={form.name} onChange={set("name")} onBlur={touch("name")}
                    aria-invalid={!!show("name")} aria-describedby="e-name"
                    className={`field ${show("name") ? "field-error" : ""}`} placeholder="Ayesha Khan" />
                  <ErrorText id="e-name" msg={show("name")} />
                </div>
                <div>
                  <label htmlFor="f-phone" className="label">Phone</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 rounded-[8px] bg-cream-100 px-2.5 py-1.5 font-logo text-[14px] font-semibold text-sage-900">
                      +92
                    </span>
                    <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel-national" value={form.phone}
                      onChange={set("phone")} onBlur={touch("phone")} aria-invalid={!!show("phone")} aria-describedby="e-phone"
                      className={`field pl-16 ${show("phone") ? "field-error" : ""}`} placeholder="0300 1234567" />
                  </div>
                  {show("phone") ? <ErrorText id="e-phone" msg={show("phone")} /> : <Helper id="e-phone">Our rider will call this number.</Helper>}
                </div>
                <div>
                  <label htmlFor="f-email" className="label">Email <span className="font-normal text-muted">(optional)</span></label>
                  <input id="f-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} onBlur={touch("email")}
                    aria-invalid={!!show("email")} aria-describedby="e-email"
                    className={`field ${show("email") ? "field-error" : ""}`} placeholder="for your order receipt" />
                  <ErrorText id="e-email" msg={show("email")} />
                </div>
              </div>
            </Section>

            <Section n={2} title="Delivery">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <CitySelect value={form.city} onChange={(c) => setForm((f) => ({ ...f, city: c }))} onBlur={touch("city")} error={show("city")} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="f-address" className="label">Full address</label>
                  <textarea id="f-address" rows={2} autoComplete="street-address" value={form.address} onChange={set("address")} onBlur={touch("address")}
                    aria-invalid={!!show("address")} aria-describedby="e-address"
                    className={`field resize-none ${show("address") ? "field-error" : ""}`} placeholder="House 12, Street 4, Block B, Model Town" />
                  <ErrorText id="e-address" msg={show("address")} />
                </div>
                <div>
                  <label htmlFor="f-landmark" className="label">Nearest landmark <span className="font-normal text-muted">(optional)</span></label>
                  <input id="f-landmark" value={form.landmark} onChange={set("landmark")} className="field" placeholder="Near the green mosque" />
                </div>
                <div>
                  <label htmlFor="f-notes" className="label">Notes <span className="font-normal text-muted">(optional)</span></label>
                  <input id="f-notes" value={form.notes} onChange={set("notes")} className="field" placeholder="Call before coming" />
                </div>
              </div>

              <p className="mb-2 mt-6 text-[14px] font-semibold text-sage-900">Shipping method</p>
              <div className="space-y-3">
                {shippingMethods.map((m) => {
                  const cost = shippingCost(m.id, subtotal);
                  return (
                    <RadioCard key={m.id} name="shipping" value={m.id} checked={shipping === m.id} onChange={(v) => setShipping(v as ShippingId)}
                      title={m.label} description={m.eta} aside={cost === 0 ? "Free" : currency(cost)} />
                  );
                })}
              </div>
            </Section>

            <Section n={3} title="Payment">
              <div className="space-y-3">
                {payments.map((p) => (
                  <RadioCard key={p.id} name="payment" value={p.id} checked={payment === p.id}
                    onChange={(v) => { setPayment(v as PaymentId); setReceipt(null); }}
                    title={p.title} description={p.description} icon={<p.icon size={20} strokeWidth={1.6} />}>
                    {p.id === "bank" || p.id === "jazzcash" || p.id === "easypaisa" ? (
                      <div className="space-y-3">
                        <dl className="grid gap-1 rounded-[12px] bg-cream-50 p-4 text-[14px]">
                          {accountDetails[p.id].map((d) => (
                            <div key={d.label} className="flex justify-between gap-3">
                              <dt className="text-muted">{d.label}</dt>
                              <dd className="text-right font-semibold text-sage-900">{d.value}</dd>
                            </div>
                          ))}
                        </dl>
                        <p className="text-[13px] text-muted">
                          Send <b className="text-sage-900">{currency(total)}</b> and upload the screenshot — we&apos;ll confirm on WhatsApp.
                        </p>
                        <label
                          htmlFor="f-receipt"
                          className={`flex cursor-pointer items-center gap-3 rounded-[12px] border-[1.5px] border-dashed bg-cream-50 px-4 py-3.5 transition hover:border-sage-600 ${show("receipt") ? "border-terracotta" : "border-sage-300"}`}
                        >
                          <Upload size={19} strokeWidth={1.6} className="text-sage-700" />
                          <span className="min-w-0 flex-1 truncate text-[14px] text-sage-900">
                            {receipt ? receipt.name : "Upload payment screenshot"}
                          </span>
                          {receipt && <Check size={18} className="text-sage-700" />}
                          <input id="f-receipt" type="file" accept="image/*,.pdf" className="sr-only"
                            aria-describedby="e-receipt"
                            onChange={(e) => { setReceipt(e.target.files?.[0] ?? null); setTouched((t) => ({ ...t, receipt: true })); }} />
                        </label>
                        <ErrorText id="e-receipt" msg={show("receipt")} />
                      </div>
                    ) : p.id === "card" ? (
                      <p className="rounded-[12px] bg-cream-50 p-4 text-[13px] text-muted">
                        <Lock size={14} className="mr-1 inline text-sage-700" />
                        After placing the order you&apos;ll be taken to our payment partner&apos;s secure page. We never see or store your card details.
                      </p>
                    ) : (
                      <p className="rounded-[12px] bg-cream-50 p-4 text-[13px] text-muted">
                        Please keep {currency(total)} ready. Our rider may call before arriving.
                      </p>
                    )}
                  </RadioCard>
                ))}
              </div>
            </Section>

            {submitted && Object.keys(errors).length > 0 && (
              <p role="alert" className="rounded-[12px] bg-blush-100 px-4 py-3 text-[14px] text-terracotta">
                A few details need a second look before we can place your order.
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 text-[20px] lg:hidden">
              {submitting ? "Placing your order…" : `Place order ♡ · ${currency(total)}`}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

function CheckoutHeader() {
  return (
    <header className="border-b border-sage-300/50 bg-cream-50">
      <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between gap-3 px-4 sm:px-6">
        <Logo small />
        <span className="hidden items-center gap-2 font-hand text-[17px] tracking-wide text-sage-900 sm:inline-flex">
          <Lock size={17} strokeWidth={1.6} /> Secure checkout
        </span>
        <Link href="/cart" className="btn-ghost group text-[16px]">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to cart
        </Link>
      </div>
    </header>
  );
}

function Steps({ step }: { step: number }) {
  const labels = ["Contact", "Delivery", "Payment"];
  return (
    <ol className="mt-8 flex items-center justify-center" aria-label="Checkout steps">
      {labels.map((l, i) => (
        <li key={l} className="flex items-center" aria-current={i === step ? "step" : undefined}>
          {i > 0 && <span aria-hidden className={`mx-2 w-8 border-t-2 border-dashed sm:mx-3 sm:w-16 ${i <= step ? "border-sage-700" : "border-sage-300"}`} />}
          <span
            className={`inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 font-hand text-[16px] tracking-wide sm:px-4 sm:text-[17px] ${
              i < step ? "bg-sage-700 text-cream-50" : i === step ? "border-[1.5px] border-sage-700 bg-sage-100 text-sage-900" : "border-[1.5px] border-sage-300 text-muted"
            }`}
          >
            {i < step ? <Check size={15} strokeWidth={2.5} /> : <span className="font-logo text-[13px] font-semibold">{i + 1}</span>}
            {l}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card bg-cream-100 p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2.5 font-hand text-[24px] text-sage-900">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-pill bg-sage-700 font-logo text-[15px] font-semibold text-cream-50">{n}</span>
        {title}
        {n === 3 && <Heart size={20} className="text-wood" />}
      </h2>
      {children}
    </section>
  );
}

function ErrorText({ id, msg }: { id: string; msg?: string | false }) {
  return msg ? (
    <p id={id} className="mt-1.5 text-[13px] text-terracotta">{msg}</p>
  ) : null;
}

function Helper({ id, children }: { id: string; children: React.ReactNode }) {
  return <p id={id} className="mt-1.5 text-[13px] text-muted">{children}</p>;
}

function CitySelect({
  value,
  onChange,
  onBlur,
  error,
}: {
  value: string;
  onChange: (c: string) => void;
  onBlur: () => void;
  error?: string | false;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const matches = cities.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8);

  const pick = (c: string) => {
    onChange(c);
    setQuery(c);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor="f-city" className="label">City</label>
      <input
        id="f-city"
        role="combobox"
        aria-expanded={open}
        aria-controls="city-list"
        aria-autocomplete="list"
        aria-invalid={!!error}
        aria-describedby="e-city"
        aria-activedescendant={open && matches[active] ? `city-${active}` : undefined}
        autoComplete="off"
        value={query}
        placeholder="Start typing… e.g. Lahore"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
          const exact = cities.find((c) => c.toLowerCase() === e.target.value.trim().toLowerCase());
          onChange(exact ?? "");
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120);
          onBlur();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          if (e.key === "Enter" && open && matches[active]) { e.preventDefault(); pick(matches[active]); }
          if (e.key === "Escape") setOpen(false);
        }}
        className={`field pr-10 ${error ? "field-error" : ""}`}
      />
      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-[42px] text-muted" />
      {open && matches.length > 0 && (
        <ul
          id="city-list"
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-[12px] border border-sage-300 bg-cream-50 p-1 shadow-lift"
        >
          {matches.map((c, i) => (
            <li
              key={c}
              id={`city-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); pick(c); }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between rounded-[8px] px-3 py-2 text-[14px] ${i === active ? "bg-sage-100 text-sage-900" : "text-ink"}`}
            >
              {c}
              {value === c && <Check size={15} className="text-sage-700" />}
            </li>
          ))}
        </ul>
      )}
      {open && matches.length === 0 && (
        <p className="absolute z-20 mt-1 w-full rounded-[12px] border border-sage-300 bg-cream-50 px-4 py-3 text-[13px] text-muted shadow-lift">
          We don&apos;t deliver there yet — WhatsApp us and we&apos;ll try!
        </p>
      )}
      <ErrorText id="e-city" msg={error} />
    </div>
  );
}
