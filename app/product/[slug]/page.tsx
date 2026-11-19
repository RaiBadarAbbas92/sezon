import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { brand } from "@/lib/brand";
import { getCatalog, getProduct } from "@/lib/catalog";

export async function generateStaticParams() {
  return (await getCatalog()).products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product ? `${product.name} — ${brand.name}` : brand.name, description: product?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const { products } = await getCatalog();

  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category);
  const fill = products.filter((p) => p.slug !== product.slug && p.category !== product.category);
  const alsoLove = [...related, ...fill].slice(0, 4);

  return (
    <>
      <Header activeCategory={product.category} />
      <ProductDetail product={product} alsoLove={alsoLove} />
      {/* leave room for the sticky mobile add-to-cart bar */}
      <div className="pb-[76px] lg:pb-0">
        <Footer />
      </div>
    </>
  );
}
