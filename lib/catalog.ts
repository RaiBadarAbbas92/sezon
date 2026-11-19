// Server-side catalogue: reads products + categories from Supabase (Bustaniya schema) when it is configured,
// otherwise falls back to the local mock data in lib/products.ts and lib/brand.ts.
import { cache } from "react";
import { categories as localCategories, type Category } from "./brand";
import { matchCategorySlug, slugify } from "./categories";
import { products as localProducts, type ColorOption, type Product } from "./products";
import { supabaseConfigured, supabaseRequest } from "./supabase";

export interface Catalog {
  products: Product[];
  categories: Category[];
  source: "supabase" | "local";
}

export { slugify };

// Bustaniya stores img/size/color as JSON-string arrays; be forgiving about plain strings too.
function list(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
}

const fallbackHex = ["#ECE1D0", "#F2D3CB", "#A9B79A", "#C9A27A", "#EBD9A8"];

function toColor(value: unknown, i: number): ColorOption | null {
  if (value && typeof value === "object") {
    const o = value as { name?: string; label?: string; hex?: string; color?: string };
    const name = o.name ?? o.label;
    return name ? { name, hex: o.hex ?? o.color ?? fallbackHex[i % fallbackHex.length] } : null;
  }
  if (typeof value !== "string" || !value.trim()) return null;
  const [name, hex] = value.split("|").map((s) => s.trim()); // "Rose|#E9B7B4" or just "Rose"
  return { name, hex: hex || fallbackHex[i % fallbackHex.length] };
}

type Row = Record<string, unknown>;

// The category structure is fixed in lib/brand.ts; `catalog_categories` rows only contribute a cover image.
function withImages(rows: Row[]): Category[] {
  const image = (slug: string) => {
    const row = rows.find((r) => r.slug === slug && r.is_active !== false);
    return (row?.image_url ?? row?.image ?? undefined) as string | undefined;
  };
  return localCategories.map((c) => ({ ...c, image: image(c.slug) ?? c.image }));
}

function mapProduct(row: Row, cats: Category[]): Product | null {
  const meta = ((row.cost_breakdown as Row | null)?.metadata ?? {}) as Row;
  const status = String(meta.status ?? "Active").toLowerCase();
  if (row.instock === false || status === "draft" || status === "archived") return null;

  const inv = row.inventory as Row | Row[] | null | undefined;
  const stock = Array.isArray(inv) ? inv[0]?.stock_quantity : inv?.stock_quantity;
  if (typeof stock === "number" && stock <= 0) return null;

  const name = String(row.name ?? "");
  const price = Number(row.price ?? 0);
  const compareAt = Number(row.compare_at_price ?? meta.compareAtPrice ?? 0);
  const images = list(row.img).filter((s): s is string => typeof s === "string" && !!s);
  const sizes = list(row.size).map(String).filter(Boolean);
  const colors = list(row.color)
    .map(toColor)
    .filter((c): c is ColorOption => c !== null);

  return {
    id: String(row.id),
    slug: String(meta.slug ?? `${slugify(name)}-${row.id}`),
    name,
    price,
    oldPrice: compareAt > price ? compareAt : undefined,
    images: images.length ? images : ["ph:yarn:cream"],
    category: matchCategorySlug(row.subcategory || row.category, cats),
    colors: colors.length ? colors : undefined,
    sizes: sizes.length ? sizes : undefined,
    rating: Number(meta.rating ?? 5),
    reviews: Number(meta.reviews ?? 0),
    description: String(row.description ?? ""),
    materials: String(meta.materials ?? ""),
    care: String(meta.care ?? ""),
    bestseller: Boolean(row.bestsellere ?? row.bestseller),
  };
}

async function loadFromSupabase(): Promise<Catalog> {
  const opts = { tags: ["catalog"] };
  const [catRows, productRows] = await Promise.all([
    supabaseRequest<Row[]>("catalog_categories?select=*&order=sort_order.asc.nullslast,name.asc", opts).catch(
      () => [] as Row[], // table missing → keep the local category list
    ),
    supabaseRequest<Row[]>(
      "products?select=*,inventory(stock_quantity)&order=created_at.desc",
      opts,
    ).catch(() =>
      // anon may not be allowed to embed inventory / read every column after security hardening
      supabaseRequest<Row[]>("products?select=*&order=created_at.desc", opts),
    ),
  ]);

  const categories = withImages(catRows);
  const products = productRows.map((r) => mapProduct(r, categories)).filter((p): p is Product => p !== null);
  return { products, categories, source: "supabase" };
}

export const getCatalog = cache(async (): Promise<Catalog> => {
  if (supabaseConfigured) {
    try {
      return await loadFromSupabase();
    } catch (err) {
      console.error("[catalog] Supabase read failed, using local catalogue:", err);
    }
  }
  return { products: localProducts, categories: localCategories, source: "local" };
});

export async function getProduct(slug: string) {
  return (await getCatalog()).products.find((p) => p.slug === slug);
}
