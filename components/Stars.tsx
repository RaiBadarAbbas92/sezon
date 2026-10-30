import { Star } from "lucide-react";

export default function Stars({
  rating,
  count,
  size = 13,
  className = "",
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="flex" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            strokeWidth={1.6}
            className={i <= Math.round(rating) ? "fill-wood text-wood" : "text-sage-300"}
          />
        ))}
      </span>
      {count !== undefined && <span className="text-[12px] text-muted">({count})</span>}
    </div>
  );
}
