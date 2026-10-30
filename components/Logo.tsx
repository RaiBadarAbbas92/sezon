import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import logo from "@/public/brand/logo.png";

export default function Logo({ small = false, light = false }: { small?: boolean; light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${brand.name} home`}
      className={`group inline-flex shrink-0 flex-col items-start rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${light ? "bg-cream-50 px-2.5 py-1.5" : ""}`}
    >
      <Image
        src={logo}
        alt={brand.name}
        priority
        sizes="160px"
        className={`w-auto transition-transform duration-300 group-hover:-rotate-2 ${small ? "h-[46px]" : "h-[60px] sm:h-[80px]"}`}
      />
    </Link>
  );
}
