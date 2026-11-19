import type { Metadata } from "next";
import { Fredoka, Gochi_Hand, Nunito } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { CatalogProvider } from "@/lib/catalog-context";
import { getCatalog } from "@/lib/catalog";
import { brand } from "@/lib/brand";
import "./globals.css";

const gochi = Gochi_Hand({ variable: "--font-gochi", weight: "400", subsets: ["latin"] });
const fredoka = Fredoka({ variable: "--font-fredoka", weight: ["500", "600", "700"], subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", weight: ["400", "500", "600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description:
    "Handmade crochet clothing, accessories, bags, home pieces, gifts and amigurumi — stitched with love and delivered across Pakistan.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const catalog = await getCatalog();
  return (
    <html lang="en" className={`${gochi.variable} ${fredoka.variable} ${nunito.variable}`}>
      <body className="antialiased">
        <CatalogProvider catalog={catalog}>
          <CartProvider>{children}</CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
