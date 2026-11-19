"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Banknote, Check, Clock, Heart, ShoppingBasket, Sparkles, Truck } from "lucide-react";
import { brand, currency, whatsappLink } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog-context";
import { findCategory } from "@/lib/categories";
import type { Product } from "@/lib/products";
import ProductImage from "./ProductImage";
import ProductCard from "./ProductCard";
import QuantityStepper from "./QuantityStepper";
import Stars from "./Stars";
import { WhatsAppIcon } from "./social-icons";
import { Heart as HeartDoodle, Sparkle, Sprig, YarnBall } from "./doodles";

const tabs = ["Description", "Materials & Care", "Shipping", "Reviews"] as const;
type Tab = (typeof tabs)[number];

const sampleReviews = [
  { name: "Areeba S.", text: "So soft and the stitching is perfect. Packed with a sweet handwritten note!", rating: 5 },
  { name: "Fatima N.", text: "Gifted it to my niece — she named it straight away. Delivery was quick too.", rating: 5 },
  { name: "Usman R.", text: "Colour is slightly lighter than the photo but honestly even cuter in person.", rating: 4 },
];

export default function ProductDetail({ product, alsoLove }: { product: Product; alsoLove: Product[] }) {
  const { add } = useCart();
  const { categories } = useCatalog();
  const hit = findCategory(product.category, categories);
  const category = hit?.sub ?? hit?.section;
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("Description");
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const saving = product.oldPrice ? product.oldPrice - product.price : 0;

  const addToCart = () => {
    add(product.slug, qty, { color, size });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const onSwipe = () => {
    const el = scroller.current;
    if (el) setImg(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    setImg(i);
    scroller.current?.scrollTo({ left: i * scroller.current.clientWidth, behavior: "smooth" });
  };

  const waText = `Hi ${brand.name}! I'd like to order: ${product.name}${color ? ` (${color}` : ""}${size ? `${color ? ", " : " ("}${size}` : ""}${color || size ? ")" : ""} × ${qty}`;

  return (
    <main className="mx-auto max-w-[1280px] px-4 pb-24 sm:px-6 lg:pb-0">
      <nav aria-label="Breadcrumb" className="font-hand text-[15px] tracking-wide text-muted">
        <Link href="/" className="hover:text-sage-900">Home</Link>
        {" / "}
        {hit ? (
          <>
            <Link href={`/${hit.section.slug}`} className="hover:text-sage-900">{hit.section.label}</Link>
            {hit.sub && (
              <>
                {" / "}
                <Link href={`/${hit.section.slug}/${hit.sub.slug}`} className="hover:text-sage-900">{hit.sub.label}</Link>
              </>
            )}
          </>
        ) : (
          <Link href="/shop" className="hover:text-sage-900">Shop</Link>
        )}
        {" / "}
        <span className="text-sage-900">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[55%_1fr] lg:gap-12">
        {/* Gallery */}
        <div>
          {/* mobile swipe carousel */}
          <div className="lg:hidden">
            <div
              ref={scroller}
              onScroll={onSwipe}
              className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[22px] bg-cream-200 shadow-soft"
            >
              {product.images.map((src, i) => (
                <div key={src + i} className="relative aspect-square w-full shrink-0 snap-center">
                  <ProductImage src={src} alt={`${product.name}, photo ${i + 1}`} doodleSize={150} priority={i === 0} sizes="100vw" />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={`h-2 rounded-pill transition-all ${img === i ? "w-6 bg-sage-700" : "w-2 bg-sage-300"}`}
                />
              ))}
            </div>
          </div>

          {/* desktop main + thumbnails */}
          <div className="hidden lg:block">
            <div
              className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[22px] bg-cream-200 shadow-soft"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom(null)}
            >
              <div
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={{ transform: zoom ? "scale(1.6)" : "scale(1)", transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center" }}
              >
                <ProductImage src={product.images[img]} alt={product.name} doodleSize={200} priority sizes="55vw" />
              </div>
              <span className="absolute left-4 top-4 rounded-pill bg-cream-50/90 px-3 py-1 font-hand text-[14px] tracking-wide text-sage-900">
                handmade ♡
              </span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setImg(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-pressed={img === i}
                  className={`relative aspect-square overflow-hidden rounded-[14px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${img === i ? "ring-2 ring-sage-700 ring-offset-2 ring-offset-cream-50" : "opacity-80 hover:opacity-100"}`}
                >
                  <ProductImage src={src} alt="" doodleSize={40} sizes="10vw" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:pt-2">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-pill bg-sage-100 px-3 py-1 font-hand text-[14px] tracking-wide text-sage-900">Handmade</span>
            {category && (
              <span className="rounded-pill bg-sage-100 px-3 py-1 font-hand text-[14px] tracking-wide text-sage-900">{category.label}</span>
            )}
          </div>
          <h1 className="mt-3 font-hand text-[34px] leading-tight text-sage-900 sm:text-[40px]">{product.name}</h1>
          <Stars rating={product.rating} size={16} className="mt-1" />
          <a href="#details" onClick={() => setTab("Reviews")} className="text-[13px] text-muted underline-offset-4 hover:underline">
            {product.rating} · {product.reviews} reviews
          </a>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-logo text-[28px] font-semibold text-sage-900">{currency(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="font-logo text-[18px] text-wood line-through">{currency(product.oldPrice)}</span>
                <span className="rounded-pill bg-blush-100 px-3 py-1 font-hand text-[14px] tracking-wide text-sage-900">
                  you save {currency(saving)}
                </span>
              </>
            )}
          </div>

          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">{product.description}</p>

          {product.colors && (
            <fieldset className="mt-6">
              <legend className="mb-2 text-[14px] font-semibold text-sage-900">
                Colour: <span className="font-normal text-muted">{color}</span>
              </legend>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    style={{ backgroundColor: c.hex }}
                    className={`h-9 w-9 rounded-pill border border-sage-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${color === c.name ? "ring-2 ring-sage-700 ring-offset-2 ring-offset-cream-50" : "hover:scale-110"}`}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {product.sizes && (
            <fieldset className="mt-5">
              <legend className="mb-2 text-[14px] font-semibold text-sage-900">Size</legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`rounded-pill border-[1.5px] px-4 py-2 font-hand text-[16px] tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${size === s ? "border-sage-700 bg-sage-700 text-cream-50" : "border-sage-300 text-sage-900 hover:border-sage-600"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} />
            <span className="font-hand text-[16px] tracking-wide text-muted">
              total <b className="font-logo font-semibold text-sage-900">{currency(product.price * qty)}</b>
            </span>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={addToCart} className="btn-primary group flex-1 py-3.5 text-[19px]">
              {added ? (
                <>
                  <Check size={19} /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingBasket size={19} strokeWidth={1.6} /> Add to cart
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              aria-pressed={liked}
              className="btn-secondary px-5"
            >
              <Heart size={19} strokeWidth={1.6} className={liked ? "fill-blush-200 text-wood" : ""} />
              <span className="hidden sm:inline">Wishlist</span>
            </button>
          </div>
          {added && (
            <Link href="/cart" className="btn-ghost group mt-3">
              View cart <ArrowRight size={16} className="arrow-nudge" />
            </Link>
          )}

          <a
            href={whatsappLink(waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-fit items-center gap-2 text-[14px] font-semibold text-sage-700 underline-offset-4 hover:underline"
          >
            <WhatsAppIcon size={18} /> Order on WhatsApp
          </a>

          <ul className="mt-6 space-y-3 rounded-card bg-cream-100 p-5 text-[14px] text-ink">
            <li className="flex items-center gap-3">
              <Truck size={19} strokeWidth={1.6} className="shrink-0 text-sage-700" /> Delivery in 3–5 working days, nationwide
            </li>
            <li className="flex items-center gap-3">
              <Banknote size={19} strokeWidth={1.6} className="shrink-0 text-sage-700" /> Cash on Delivery available
            </li>
            <li className="flex items-center gap-3">
              <Sparkles size={19} strokeWidth={1.6} className="shrink-0 text-sage-700" /> Each piece is handmade — slight variations are part of the charm
            </li>
            <li className="flex items-center gap-3">
              <Clock size={19} strokeWidth={1.6} className="shrink-0 text-sage-700" /> Custom colour? Add 2–3 days to make it
            </li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <section id="details" className="mt-16 scroll-mt-6">
        <div role="tablist" aria-label="Product details" className="no-scrollbar flex gap-6 overflow-x-auto border-b border-sage-300/60">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              id={`tab-${t}`}
              aria-selected={tab === t}
              aria-controls="tab-panel"
              onClick={() => setTab(t)}
              className={`relative shrink-0 pb-3 font-hand text-[19px] tracking-wide transition-colors focus-visible:outline-none focus-visible:text-sage-600 ${tab === t ? "text-sage-900" : "text-muted hover:text-sage-900"}`}
            >
              {t}
              {t === "Reviews" && <span className="ml-1 text-[14px]">({product.reviews})</span>}
              <span className={`absolute bottom-[-1px] left-0 h-[3px] rounded-pill bg-sage-700 transition-all ${tab === t ? "w-full" : "w-0"}`} />
            </button>
          ))}
        </div>
        <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="max-w-[760px] py-6 text-[15px] leading-relaxed text-muted">
          {tab === "Description" && (
            <>
              <p>{product.description}</p>
              <p className="mt-3">
                Made to order in our little studio. Every piece is stitched by hand, stuffed, shaped and checked before
                it&apos;s wrapped in tissue with a handwritten thank-you card.
              </p>
            </>
          )}
          {tab === "Materials & Care" && (
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold text-sage-900">Materials</dt>
                <dd>{product.materials}</dd>
              </div>
              <div>
                <dt className="font-semibold text-sage-900">Care</dt>
                <dd>{product.care}</dd>
              </div>
            </dl>
          )}
          {tab === "Shipping" && (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Standard delivery: 3–5 working days — free on orders over Rs. 5,000.</li>
              <li>Express delivery: 1–2 working days in major cities.</li>
              <li>Cash on Delivery available nationwide.</li>
              <li>Easy 7-day returns on unused, ready-made pieces (custom orders are final).</li>
            </ul>
          )}
          {tab === "Reviews" && (
            <div className="grid gap-4 sm:grid-cols-3">
              {sampleReviews.map((r) => (
                <figure key={r.name} className="rounded-card bg-cream-200 p-5 shadow-soft">
                  <Stars rating={r.rating} />
                  <blockquote className="mt-2 text-[14px] text-ink">“{r.text}”</blockquote>
                  <figcaption className="mt-3 font-hand text-[17px] tracking-wide text-sage-900">{r.name}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Made by */}
      <section aria-label="Made by" className="mt-6 flex flex-col items-start gap-5 rounded-[24px] bg-blush-100 p-6 shadow-soft sm:flex-row sm:items-center sm:p-8">
        <div className="knit relative flex h-20 w-20 shrink-0 items-center justify-center rounded-pill bg-cream-50 text-sage-700 shadow-soft">
          <YarnBall size={44} />
          <HeartDoodle size={18} className="absolute -right-1 -top-1 fill-blush-200 text-wood" />
        </div>
        <div className="flex-1">
          <p className="font-hand text-[16px] tracking-wide text-wood">made by</p>
          <p className="font-hand text-[26px] leading-tight text-sage-900">{brand.maker.name}</p>
          <p className="mt-1 max-w-[560px] -rotate-1 font-hand text-[18px] leading-snug tracking-wide text-muted">
            “{brand.maker.note}”
          </p>
        </div>
        <Sprig size={48} className="hidden text-sage-600 sm:block" />
      </section>

      {/* You may also love */}
      <section aria-labelledby="also-title" className="mt-16">
        <h2 id="also-title" className="section-title mb-6 flex items-center gap-2">
          You may also love <Sparkle size={26} className="text-wood" />
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {alsoLove.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-300/60 bg-cream-50/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[640px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-hand text-[15px] tracking-wide text-muted">{product.name}</p>
            <p className="font-logo text-[19px] font-semibold text-sage-900">{currency(product.price * qty)}</p>
          </div>
          <button type="button" onClick={addToCart} className="btn-primary shrink-0 px-5">
            {added ? <Check size={18} /> : <ShoppingBasket size={18} strokeWidth={1.6} />}
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </main>
  );
}
