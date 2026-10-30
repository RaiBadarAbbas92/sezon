import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import { Sparkle, YarnBall } from "@/components/doodles";
import { brand, categories } from "@/lib/brand";
import { byCategory } from "@/lib/products";

export const metadata: Metadata = { title: `Shop — ${brand.name}` };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const current = categories.find((c) => c.slug === category);
  const query = q?.trim().toLowerCase() ?? "";
  const list = byCategory(current?.slug).filter(
    (p) => !query || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
  );

  const chip = (active: boolean) =>
    `shrink-0 rounded-pill px-4 py-2 font-hand text-[16px] tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${active ? "bg-sage-700 text-cream-50" : "bg-cream-100 text-sage-900 hover:bg-sage-100"}`;

  return (
    <>
      <Header activeCategory={current?.slug ?? "all"} />
      <div className="mx-auto flex max-w-[1280px] gap-8 lg:pr-6">
        <CategorySidebar active={current?.slug ?? "all"} />
        <main className="min-w-0 flex-1 px-4 sm:px-6 lg:px-0">
          <nav aria-label="Breadcrumb" className="font-hand text-[15px] tracking-wide text-muted">
            <Link href="/" className="hover:text-sage-900">Home</Link> / <span className="text-sage-900">{current?.label ?? "Shop all"}</span>
          </nav>
          <h1 className="mt-2 flex items-center gap-2 font-hand text-[36px] leading-tight text-sage-900 sm:text-[48px]">
            {query ? `“${q}”` : current?.label ?? "Everything handmade"} <Sparkle size={30} className="text-wood" />
          </h1>
          <p className="mt-1 text-[14px] text-muted">{list.length} cozy {list.length === 1 ? "piece" : "pieces"}</p>

          <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
            <Link href="/shop" className={chip(!current)}>All</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`} className={chip(current?.slug === c.slug)}>
                {c.label}
              </Link>
            ))}
          </div>

          {list.length ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {list.map((p, i) => (
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
