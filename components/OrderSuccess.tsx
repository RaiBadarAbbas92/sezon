"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Package } from "lucide-react";
import { brand, currency, whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "./social-icons";
import { CurvyArrow, Heart, Sparkle, Star, YarnBall } from "./doodles";
import { HandwrittenAside } from "./PinnedNote";

interface LastOrder {
  orderNo: string;
  name: string;
  total: number;
  city: string;
  payment: string;
  items: number;
}

export default function OrderSuccess() {
  const params = useSearchParams();
  const orderNo = params.get("order") ?? "SZ-000000";
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sezon-last-order");
      const parsed = raw ? (JSON.parse(raw) as LastOrder) : null;
      if (parsed?.orderNo === orderNo) setOrder(parsed);
    } catch {
      // storage blocked — show the generic thank-you
    }
  }, [orderNo]);

  const firstName = order?.name.split(" ")[0];
  const transfer = order && ["bank", "jazzcash", "easypaisa"].includes(order.payment);

  return (
    <main className="mx-auto max-w-[680px] px-4 pt-4 sm:px-6">
      <div className="relative overflow-hidden rounded-[28px] bg-cream-200 px-6 pb-10 pt-12 text-center shadow-soft sm:px-12">
        <Sparkle size={30} className="absolute left-8 top-8 text-wood" />
        <Star size={22} className="absolute right-10 top-12 text-wood" />
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-pill bg-cream-50 text-sage-700 shadow-soft">
          <YarnBall size={78} className="floaty" />
          <Heart size={30} className="absolute -right-1 top-1 rotate-12 fill-blush-200 text-wood" />
        </div>

        <h1 className="mt-6 -rotate-1 font-hand text-[38px] leading-tight text-sage-900 sm:text-[48px]">
          Thank you{firstName ? `, ${firstName}` : ""}! ♡
        </h1>
        <p className="mx-auto mt-2 max-w-[440px] text-[15px] leading-relaxed text-muted">
          Your order is in and our hooks are already warming up. We&apos;ll message you on WhatsApp to confirm everything.
        </p>

        <div className="mx-auto mt-7 inline-flex flex-col items-center rounded-card bg-cream-50 px-8 py-4">
          <span className="font-hand text-[15px] tracking-wide text-muted">order number</span>
          <span className="font-logo text-[26px] font-bold tracking-wide text-sage-900">{orderNo}</span>
          {order && (
            <span className="mt-1 text-[13px] text-muted">
              {order.items} {order.items === 1 ? "item" : "items"} · {currency(order.total)} · {order.city}
            </span>
          )}
        </div>

        <ul className="mx-auto mt-7 max-w-[420px] space-y-3 text-left text-[14px] text-ink">
          <li className="flex gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-sage-700 font-logo text-[13px] font-semibold text-cream-50">1</span>
            {transfer ? "We check your payment screenshot and confirm on WhatsApp." : "We confirm your order on WhatsApp within a few hours."}
          </li>
          <li className="flex gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-sage-700 font-logo text-[13px] font-semibold text-cream-50">2</span>
            Your piece is stitched, checked twice and wrapped with a handwritten card.
          </li>
          <li className="flex gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-sage-700 font-logo text-[13px] font-semibold text-cream-50">3</span>
            <span className="inline-flex items-center gap-1.5">
              <Package size={16} strokeWidth={1.6} className="text-sage-700" /> It arrives at your door in 3–5 working days.
            </span>
          </li>
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink(`Hi ${brand.name}! I just placed order ${orderNo} ♡`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group"
          >
            <WhatsAppIcon size={18} /> Message us on WhatsApp
          </a>
          <Link href="/shop" className="btn-secondary group">
            Keep shopping <ArrowRight size={18} className="arrow-nudge" />
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sage-700">
          <CurvyArrow size={50} className="rotate-12" />
          <HandwrittenAside>thank you for supporting handmade</HandwrittenAside>
        </div>
      </div>
    </main>
  );
}
