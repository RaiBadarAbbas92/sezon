import { NextResponse } from "next/server";
import { getCatalogCategories } from "../../../lib/backend/categories";
import { getCatalogProducts } from "../../../lib/backend/catalog";

export async function GET() {
  const [products, categories] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);
  return NextResponse.json({ products, categories });
}
