import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProductListing from "@/components/ProductListing";
import { brand } from "@/lib/brand";
import { getCatalog } from "@/lib/catalog";
import { categoryHref, findCategory } from "@/lib/categories";

export const metadata: Metadata = { title: `Shop — ${brand.name}` };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const { products, categories } = await getCatalog();

  // Old links like /shop?category=bags now live at clean URLs (/bags, /clothing/cardigans).
  if (category && findCategory(category, categories)) redirect(categoryHref(category, categories));

  const query = q?.trim().toLowerCase() ?? "";
  const list = products.filter(
    (p) => !query || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
  );

  return (
    <ProductListing
      active="all"
      title={query ? `“${q}”` : "Everything handmade"}
      crumbs={[{ label: "Shop all" }]}
      chips={[
        { label: "All", href: "/shop", active: true },
        ...categories.map((c) => ({ label: c.label, href: `/${c.slug}`, active: false })),
      ]}
      products={list}
    />
  );
}
