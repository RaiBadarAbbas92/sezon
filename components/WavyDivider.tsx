const fills = {
  cream: "var(--color-cream-200)",
  sage: "var(--color-sage-700)",
  blush: "var(--color-blush-100)",
  page: "var(--color-cream-50)",
};

export default function WavyDivider({
  color = "cream",
  flip = false,
  className = "",
}: {
  color?: keyof typeof fills;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={`block w-full leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="h-[36px] w-full sm:h-[56px]">
        <path
          fill={fills[color]}
          d="M0 38c80-22 160-30 240-18s160 34 240 30 160-30 240-34 160 16 240 24 160 4 240-10 160-24 240-16v56H0Z"
        />
      </svg>
    </div>
  );
}
