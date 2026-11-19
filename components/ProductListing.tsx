// Product grid page shared by /shop, /<section> and /<section>/<sub>.
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import CategorySidebar from "./CategorySidebar";
import ProductCard from "./ProductCard";
import { Sparkle, YarnBall } from "./doodles";
import type { Product } from "@/lib/products";

interface Crumb {
  label: string;
  href?: string;
}

interface Chip {
  label: string;
  href: string;
  active: boolean;
}

export default function ProductListing({
  active,
  title,
  crumbs,
  chips,
  products,
}: {
  active: string; // "all" or the current section / sub-category slug
  title: string;
  crumbs: Crumb[];
  chips: Chip[];
  products: Product[];
}) {
  const chip = (on: boolean) =>
    `shrink-0 rounded-pill px-4 py-2 font-hand text-[16px] tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${on ? "bg-sage-700 text-cream-50" : "bg-cream-100 text-sage-900 hover:bg-sage-100"}`;

  return (
    <>
      <Header activeCategory={active} />
      <div className="mx-auto flex max-w-[1280px] gap-8 lg:pr-6">
        <CategorySidebar active={active} />
        <main className="min-w-0 flex-1 px-4 sm:px-6 lg:px-0">
          <nav aria-label="Breadcrumb" className="font-hand text-[15px] tracking-wide text-muted">
            <Link href="/" className="hover:text-sage-900">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                {" / "}
                {c.href ? (
                  <Link href={c.href} className="hover:text-sage-900">{c.label}</Link>
                ) : (
                  <span className="text-sage-900">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-2 flex items-center gap-2 font-hand text-[36px] leading-tight text-sage-900 sm:text-[48px]">
            {title} <Sparkle size={30} className="text-wood" />
          </h1>
          <p className="mt-1 text-[14px] text-muted">{products.length} cozy {products.length === 1 ? "piece" : "pieces"}</p>

          {chips.length > 0 && (
            <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
              {chips.map((c) => (
                <Link key={c.href} href={c.href} className={chip(c.active)}>
                  {c.label}
                </Link>
              ))}
            </div>
          )}

          {products.length ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center rounded-[28px] bg-cream-100 px-6 py-14 text-center">
              <YarnBall size={80} className="text-sage-600" />
              <p className="mt-4 font-hand text-[26px] text-sage-900">Nothing here yet…</p>
              <p className="mt-1 text-[14px] text-muted">but we can always make it for you.</p>
              <Link href="/#custom" className="btn-primary mt-6">Ask for a custom piece</Link>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
