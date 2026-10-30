import Image from "next/image";
import { Doodle } from "./doodles";

const tones = {
  cream: "bg-cream-200 text-sage-700/70",
  blush: "bg-blush-100 text-sage-700/70",
  sage: "bg-sage-100 text-sage-700/70",
} as const;

/**
 * Renders a real photo when `src` is a path/URL, otherwise a soft doodle
 * placeholder for "ph:<doodle>:<tone>" values from the mock catalogue.
 */
export default function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  className = "",
  doodleSize = 96,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  doodleSize?: number;
}) {
  if (src.startsWith("ph:")) {
    const [, doodle, tone] = src.split(":");
    return (
      <div
        role="img"
        aria-label={alt}
        className={`knit absolute inset-0 flex items-center justify-center ${tones[tone as keyof typeof tones] ?? tones.cream} ${className}`}
      >
        <Doodle name={doodle} size={doodleSize} />
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={src.startsWith("http")} className={`object-cover ${className}`} />;
}
