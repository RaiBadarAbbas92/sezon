import { Flower2, Gift, Rabbit, Shirt, ShoppingBag, Sparkles, type LucideIcon } from "lucide-react";
import type { CategoryIcon } from "@/lib/brand";

// Kept out of CategorySidebar ("use client") so server components like CategoryCard can use it too.
export const categoryIcons: Record<CategoryIcon, LucideIcon> = {
  rabbit: Rabbit,
  bag: ShoppingBag,
  flower: Flower2,
  sparkles: Sparkles,
  gift: Gift,
  shirt: Shirt,
};
