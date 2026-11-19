"use client";

import Link from "next/link";
import { useCatalog } from "@/lib/catalog-context";
import { findCategory } from "@/lib/categories";
import { categoryIcons } from "./categoryIcons";
import { Sprig, YarnBall } from "./doodles";
import { HandwrittenAside } from "./PinnedNote";

const item = (active: boolean) =>
  `flex items-center gap-3 rounded-pill px-4 py-2.5 font-hand text-[17px] tracking-wide text-cream-50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-100 ${active ? "bg-white/15" : ""}`;

const subItem = (active: boolean) =>
  `block rounded-pill py-1.5 pl-12 pr-4 font-hand text-[15px] tracking-wide text-cream-100 transition-colors hover:bg-white/10 hover:text-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-100 ${active ? "bg-white/15 text-cream-50" : ""}`;

/** `active` is a section or sub-category slug ("all" for Shop all). The active section shows its sub-categories. */
export function CategoryList({
  active,
  onNavigate,
  expandAll,
}: {
  active?: string;
  onNavigate?: () => void;
  expandAll?: boolean; // mobile drawer: show every section's sub-categories
}) {
  const { categories } = useCatalog();
  const hit = findCategory(active, categories);
  return (
    <ul className="space-y-1">
      <li>
        <Link href="/shop" onClick={onNavigate} className={item(active === "all")}>
          <YarnBall size={20} strokeWidth={2} />
          Shop all
        </Link>
      </li>
      {categories.map((c) => {
        const Icon = categoryIcons[c.icon];
        const current = hit?.section.slug === c.slug;
        const open = expandAll || current;
        const isActive = current && !hit?.sub;
        return (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={item(isActive)}
            >
              <Icon size={19} strokeWidth={1.6} />
              {c.label}
            </Link>
            {open && c.children.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {c.children.map((s) => {
                  const subActive = hit?.sub?.slug === s.slug;
                  return (
                    <li key={s.slug}>
                      <Link
                        href={`/${c.slug}/${s.slug}`}
                        onClick={onNavigate}
                        aria-current={subActive ? "page" : undefined}
                        className={subItem(subActive)}
                      >
                        {s.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
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
