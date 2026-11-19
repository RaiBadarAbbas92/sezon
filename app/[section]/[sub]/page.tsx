// Sub-category pages, e.g. /clothing/cardigans, /home-living/cushion-covers.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductListing from "@/components/ProductListing";
import { brand, categories as tree } from "@/lib/brand";
import { getCatalog } from "@/lib/catalog";

export const dynamicParams = false; // only sub-categories that exist under their own section

export function generateStaticParams() {
  return tree.flatMap((c) => c.children.map((s) => ({ section: c.slug, sub: s.slug })));
}

type Params = Promise<{ section: string; sub: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section, sub } = await params;
  const label = tree.find((c) => c.slug === section)?.children.find((s) => s.slug === sub)?.label;
  return { title: `${label ?? "Shop"} — ${brand.name}` };
}

export default async function SubCategoryPage({ params }: { params: Params }) {
  const { section: sectionSlug, sub: subSlug } = await params;
  const { products, categories } = await getCatalog();
  const section = categories.find((c) => c.slug === sectionSlug);
  const sub = section?.children.find((s) => s.slug === subSlug);
  if (!section || !sub) notFound();

  return (
    <ProductListing
      active={sub.slug}
      title={sub.label}
      crumbs={[{ label: section.label, href: `/${section.slug}` }, { label: sub.label }]}
      chips={[
        { label: "All", href: `/${section.slug}`, active: false },
        ...section.children.map((s) => ({ label: s.label, href: `/${section.slug}/${s.slug}`, active: s.slug === sub.slug })),
      ]}
      products={products.filter((p) => p.category === sub.slug)}
    />
  );
}
