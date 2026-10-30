"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const btn =
    size === "sm"
      ? "h-8 w-8"
      : "h-11 w-11";
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-pill border-[1.5px] border-sage-300 bg-cream-50"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${btn} inline-flex items-center justify-center rounded-pill text-sage-900 transition hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 disabled:opacity-40`}
      >
        <Minus size={size === "sm" ? 14 : 16} />
      </button>
      <span
        aria-live="polite"
        className={`min-w-8 text-center font-logo font-semibold text-sage-900 ${size === "sm" ? "text-[14px]" : "text-[17px]"}`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${btn} inline-flex items-center justify-center rounded-pill text-sage-900 transition hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 disabled:opacity-40`}
      >
        <Plus size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
