import Link from "next/link";
import { Baby, Flower2, Gift, Rabbit, ShoppingBag, Sparkles, type LucideIcon } from "lucide-react";
import { categories, type CategoryIcon } from "@/lib/brand";
import { Sprig, YarnBall } from "./doodles";
import { HandwrittenAside } from "./PinnedNote";

export const categoryIcons: Record<CategoryIcon, LucideIcon> = {
  rabbit: Rabbit,
  bag: ShoppingBag,
  flower: Flower2,
  sparkles: Sparkles,
  baby: Baby,
  gift: Gift,
};

export function CategoryList({ active, onNavigate }: { active?: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      <li>
        <Link
          href="/shop"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-pill px-4 py-2.5 font-hand text-[17px] tracking-wide text-cream-50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-100 ${active === "all" ? "bg-white/15" : ""}`}
        >
          <YarnBall size={20} strokeWidth={2} />
          Shop all
        </Link>
      </li>
      {categories.map((c) => {
        const Icon = categoryIcons[c.icon];
        const isActive = active === c.slug;
        return (
          <li key={c.slug}>
            <Link
              href={`/shop?category=${c.slug}`}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-pill px-4 py-2.5 font-hand text-[17px] tracking-wide text-cream-50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-100 ${isActive ? "bg-white/15" : ""}`}
            >
              <Icon size={19} strokeWidth={1.6} />
              {c.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function CategorySidebar({ active }: { active?: string }) {
  return (
    <aside className="hidden w-[250px] shrink-0 lg:block">
      <div className="sticky top-4 flex min-h-[560px] flex-col rounded-tr-[28px] rounded-br-[80px] bg-sage-700 px-5 pb-10 pt-7 text-cream-50 shadow-soft">
        <div className="mb-5 flex items-center gap-2 px-3">
          <YarnBall size={38} className="text-cream-100" />
          <span className="font-hand text-[20px] tracking-wide">Categories</span>
        </div>
        <CategoryList active={active} />
        <div className="mt-auto flex items-end justify-between px-3 pt-10 text-cream-100">
          <HandwrittenAside>handmade with love &lt;3</HandwrittenAside>
          <Sprig size={38} />
        </div>
      </div>
    </aside>
  );
}
