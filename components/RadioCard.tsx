"use client";

import { Check } from "lucide-react";

export default function RadioCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  aside,
  icon,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  title: string;
  description?: string;
  aside?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[14px] border-[1.5px] transition-colors ${checked ? "border-sage-700 bg-sage-100" : "border-sage-300 bg-cream-50 hover:border-sage-600"}`}
    >
      <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="peer sr-only"
        />
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-sage-600 peer-focus-visible:ring-offset-2 ${checked ? "border-sage-700 bg-sage-700 text-cream-50" : "border-sage-300 bg-cream-50"}`}
        >
          {checked && <Check size={13} strokeWidth={2.5} />}
        </span>
        {icon && <span className="text-sage-700">{icon}</span>}
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-sage-900">{title}</span>
          {description && <span className="block text-[13px] text-muted">{description}</span>}
        </span>
        {aside && <span className="shrink-0 font-logo text-[15px] font-semibold text-sage-900">{aside}</span>}
      </label>
      {checked && children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
