import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/brand";
import { Doodle } from "./doodles";
import { categoryIcons } from "./categoryIcons";

export default function CategoryCard({ category, index }: { category: Category; index: number }) {
  const pink = index % 2 === 1;
  const Icon = categoryIcons[category.icon];
  const cover = category.image ?? photos.categories[category.slug];
  return (
    <Link
      href={`/${category.slug}`}
      className={`group relative flex w-[180px] shrink-0 snap-start flex-col rounded-card p-3 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 sm:w-auto ${pink ? "bg-blush-100 hover:bg-blush-200" : "bg-cream-200"}`}
    >
      <div className={`relative aspect-[4/3] overflow-hidden rounded-[14px] ${pink ? "bg-cream-50/70" : "bg-cream-100"}`}>
        {cover ? (
          <Image
            src={cover}
            alt={category.label}
            fill
            unoptimized
            sizes="(min-width: 1024px) 20vw, 180px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Icon size={46} strokeWidth={1.3} className="absolute inset-0 m-auto text-sage-700" />
        )}
        <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-pill bg-cream-50/90 text-wood shadow-soft">
          <Doodle name={category.doodle} size={18} />
        </span>
      </div>
      <div className="flex items-center justify-between px-1.5 pb-1 pt-3">
        <span className="font-hand text-[18px] tracking-wide text-sage-900">{category.label}</span>
        <ArrowRight size={17} strokeWidth={1.6} className="arrow-nudge text-sage-900" />
      </div>
    </Link>
  );
}
