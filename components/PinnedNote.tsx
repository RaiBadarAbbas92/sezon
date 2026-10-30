import { Heart } from "./doodles";

export default function PinnedNote({
  children = "good things are handmade",
  className = "relative",
}: {
  children?: React.ReactNode;
  className?: string; // pass "absolute …" to pin it over an image
}) {
  return (
    <div
      className={`w-[170px] rotate-3 rounded-[6px] bg-cream-50 px-4 pb-4 pt-6 shadow-soft ${className}`}
    >
      {/* tape strip */}
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-[2px] bg-wood/45"
      />
      <p className="font-hand text-[19px] leading-snug text-sage-900">{children}</p>
      <Heart size={18} className="mt-1 text-wood" />
    </div>
  );
}

export function HandwrittenAside({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex -rotate-3 flex-col items-start ${className}`}>
      <span className="font-hand text-[19px] tracking-wide">{children}</span>
      <svg width="90" height="10" viewBox="0 0 90 10" fill="none" aria-hidden>
        <path
          d="M2 6c6-4 10 3 16 0s10-4 16 0 10 3 16 0 10-4 16 0 10 3 22-1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
