"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/logo.png";
import { Mail } from "lucide-react";
import { brand, whatsappLink } from "@/lib/brand";
import { useCatalog } from "@/lib/catalog-context";
import WavyDivider from "./WavyDivider";
import { InstagramIcon, WhatsAppIcon } from "./social-icons";
import { Heart } from "./doodles";

export default function Footer() {
  const { categories } = useCatalog();
  return (
    <footer id="contact" className="mt-16">
      <WavyDivider color="sage" />
      <div className="bg-sage-700 text-cream-100">
        <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-6 sm:px-6">
          <p className="text-center font-hand text-[20px] tracking-wide text-cream-50 sm:text-[24px]">
            ♡ {brand.name} ♡ {brand.footerLine} ♡
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="inline-block rounded-[16px] bg-cream-50 px-3 py-2 shadow-soft">
                <Image src={logo} alt={brand.name} sizes="140px" className="h-[54px] w-auto" />
              </span>
              <p className="mt-2 max-w-[240px] text-[14px] leading-relaxed">
                Crochet clothing, amigurumi and handmade joys, stitched with care in {brand.city}.
              </p>
            </div>
            <div>
              <p className="mb-3 font-hand text-[19px] tracking-wide text-cream-50">Shop</p>
              <ul className="space-y-1.5 text-[14px]">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/${c.slug}`} className="hover:text-cream-50 hover:underline underline-offset-4">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 font-hand text-[19px] tracking-wide text-cream-50">Help</p>
              <ul className="space-y-1.5 text-[14px]">
                <li><Link href="/#custom" className="hover:text-cream-50 hover:underline underline-offset-4">Custom orders</Link></li>
                <li><Link href="/cart" className="hover:text-cream-50 hover:underline underline-offset-4">Your cart</Link></li>
                <li><span>Delivery: 3–5 working days</span></li>
                <li><span>Easy 7-day returns</span></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-hand text-[19px] tracking-wide text-cream-50">Say hello</p>
              <div className="flex flex-col gap-2 text-[14px]">
                <a href={whatsappLink(`Hi ${brand.name}!`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cream-50">
                  <WhatsAppIcon size={18} /> WhatsApp us
                </a>
                <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cream-50">
                  <InstagramIcon size={18} /> @{brand.instagram}
                </a>
                <a href={`mailto:${brand.email}`} className="inline-flex items-center gap-2 hover:text-cream-50">
                  <Mail size={18} strokeWidth={1.6} /> {brand.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
            <div className="flex flex-wrap justify-center gap-2">
              {["Cash on Delivery", "JazzCash", "Easypaisa", "Bank transfer", "Card"].map((p) => (
                <span key={p} className="rounded-pill border border-cream-100/40 px-3 py-1 font-hand text-[14px] tracking-wide text-cream-50">
                  {p}
                </span>
              ))}
            </div>
            <p className="inline-flex items-center gap-1.5 text-[13px]">
              © {new Date().getFullYear()} {brand.name} · made with <Heart size={14} className="text-blush-200" />
              <span className="ml-2 opacity-70">· photos via Unsplash</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
