import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSuccess from "@/components/OrderSuccess";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: `Thank you! — ${brand.name}` };

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="mx-auto mt-10 h-80 max-w-[640px] animate-pulse rounded-[28px] bg-cream-100" />}>
        <OrderSuccess />
      </Suspense>
      <Footer />
    </>
  );
}
