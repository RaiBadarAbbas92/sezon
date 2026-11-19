"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, Menu, Search, ShoppingBasket, User, X } from "lucide-react";
import { categories, navLinks } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import Logo from "./Logo";
import { CategoryList } from "./CategorySidebar";
import { HandwrittenAside } from "./PinnedNote";
import { Sprig } from "./doodles";

export default function Header({ activeCategory }: { activeCategory?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
    setOpen(false);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <header className="bg-cream-50">
      <div className="mx-auto flex h-[84px] max-w-[1280px] items-center gap-4 px-4 sm:h-[96px] sm:px-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="icon-btn -ml-2 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} strokeWidth={1.6} />
        </button>

        <Logo />

        <nav aria-label="Main" className="mx-auto hidden items-center gap-5 lg:flex xl:gap-7">
          {categories.map((c) => {
            const href = `/${c.slug}`;
            return (
              <div key={c.slug} className="group/menu relative">
                <Link
                  href={href}
                  aria-haspopup={c.children.length ? "true" : undefined}
                  className="group relative inline-flex items-center gap-1 py-1 font-hand text-[16px] tracking-wide text-sage-900 transition-colors hover:text-sage-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 rounded-[6px]"
                >
                  {c.label}
                  {c.children.length > 0 && (
                    <ChevronDown size={15} strokeWidth={1.8} className="transition-transform group-hover/menu:rotate-180" />
                  )}
                  <span
                    className={`absolute -bottom-1 left-1/2 h-[3px] -translate-x-1/2 rounded-pill bg-sage-700 transition-all ${isActive(href) ? "w-6" : "w-0 group-hover:w-4"}`}
                  />
                </Link>
                {c.children.length > 0 && (
                  <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100">
                    <ul className="min-w-[210px] rounded-[20px] bg-cream-50 p-2 shadow-lift ring-1 ring-sage-900/5">
                      {c.children.map((s) => {
                        const subHref = `${href}/${s.slug}`;
                        return (
                          <li key={s.slug}>
                            <Link
                              href={subHref}
                              aria-current={pathname === subHref ? "page" : undefined}
                              className={`block rounded-pill px-4 py-2 font-hand text-[15px] tracking-wide text-sage-900 transition-colors hover:bg-sage-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${pathname === subHref ? "bg-sage-100" : ""}`}
                            >
                              {s.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <form onSubmit={submit} role="search" className="relative mr-2 hidden xl:block">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search something cozy…"
              aria-label="Search products"
              className="w-[230px] rounded-pill bg-cream-100 py-2.5 pl-5 pr-11 font-hand text-[15px] tracking-wide text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage-600/40"
            />
            <button type="submit" aria-label="Search" className="absolute right-1.5 top-1/2 -translate-y-1/2 icon-btn h-8 w-8">
              <Search size={18} strokeWidth={1.6} />
            </button>
          </form>
          <Link href="/shop" className="icon-btn xl:hidden" aria-label="Search">
            <Search size={21} strokeWidth={1.6} />
          </Link>
          <Link href="/shop" className="icon-btn hidden sm:inline-flex" aria-label="Wishlist">
            <Heart size={21} strokeWidth={1.6} />
          </Link>
          <Link href="/checkout" className="icon-btn hidden sm:inline-flex" aria-label="Account">
            <User size={21} strokeWidth={1.6} />
          </Link>
          <Link href="/cart" className="icon-btn" aria-label={`Cart, ${count} items`}>
            <ShoppingBasket size={22} strokeWidth={1.6} />
            {ready && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-pill bg-sage-700 px-1 font-logo text-[11px] font-semibold text-cream-50">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-sage-900/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute left-0 top-0 flex h-full w-[86%] max-w-[330px] flex-col overflow-y-auto rounded-br-[80px] bg-sage-700 px-5 pb-10 pt-5 text-cream-50 shadow-lift transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <Logo small light />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-pill hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-100"
            >
              <X size={22} strokeWidth={1.6} />
            </button>
          </div>
          <form onSubmit={submit} role="search" className="relative mb-5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search something cozy…"
              aria-label="Search products"
              tabIndex={open ? 0 : -1}
              className="w-full rounded-pill bg-cream-50 py-2.5 pl-5 pr-11 font-hand text-[15px] text-ink placeholder:text-muted focus:outline-none"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-900" />
          </form>
          <nav aria-label="Mobile" className="mb-5 grid grid-cols-2 gap-1 border-b border-white/15 pb-5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="rounded-pill px-4 py-2 font-hand text-[17px] tracking-wide hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <CategoryList active={activeCategory} onNavigate={() => setOpen(false)} expandAll />
          <div className="mt-auto flex items-end justify-between px-3 pt-8 text-cream-100">
            <HandwrittenAside>handmade with love &lt;3</HandwrittenAside>
            <Sprig size={34} />
          </div>
        </div>
      </div>
    </header>
  );
}
