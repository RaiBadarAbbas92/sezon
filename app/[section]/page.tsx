// Section pages: /clothing, /accessories, /bags, /home-living, /gifts, /amigurumi.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductListing from "@/components/ProductListing";
import { brand, categories as tree } from "@/lib/brand";
import { getCatalog } from "@/lib/catalog";
import { inCategory } from "@/lib/categories";

export const dynamicParams = false; // anything outside the category tree is a 404

export function generateStaticParams() {
  return tree.map((c) => ({ section: c.slug }));
}

type Params = Promise<{ section: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section: slug } = await params;
  const section = tree.find((c) => c.slug === slug);
  return { title: `${section?.label ?? "Shop"} — ${brand.name}` };
}

export default async function SectionPage({ params }: { params: Params }) {
  const { section: slug } = await params;
  const { products, categories } = await getCatalog();
  const section = categories.find((c) => c.slug === slug);
  if (!section) notFound();

  return (
    <ProductListing
      active={section.slug}
      title={section.label}
      crumbs={[{ label: section.label }]}
      chips={
        section.children.length
          ? [
              { label: "All", href: `/${section.slug}`, active: true },
              ...section.children.map((s) => ({ label: s.label, href: `/${section.slug}/${s.slug}`, active: false })),
            ]
          : [
              { label: "All", href: "/shop", active: false },
              ...categories.map((c) => ({ label: c.label, href: `/${c.slug}`, active: c.slug === section.slug })),
            ]
      }
      products={products.filter((p) => inCategory(p.category, section.slug, categories))}
    />
  );
}
