// Hand-drawn line doodles. Stroke = currentColor so they take the text colour.
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, rest: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...rest,
});

export function Heart({ size = 24, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" {...base(size, rest)}>
      <path d="M12 20.2c-.4-.3-7.9-4.9-8.6-10.1C2.9 6.7 5.2 4.3 7.8 4.6c1.8.2 3.2 1.6 4.1 3.1.9-1.6 2.5-3.1 4.4-3.1 2.8 0 4.7 2.6 4.1 5.6-.9 4.8-7.9 9.7-8.4 10Z" />
    </svg>
  );
}

export function CurvyArrow({ size = 64, ...rest }: P) {
  return (
    <svg viewBox="0 0 64 40" {...base(size, rest)} height={(size * 40) / 64}>
      <path d="M3 30c8-14 18-20 27-14 6 4 2 12-3 9-5-3 2-14 13-15 7-.6 13 2.5 18 7" />
      <path d="M53 10.5l5.2 7-8.4 1.3" />
    </svg>
  );
}

export function YarnBall({ size = 48, ...rest }: P) {
  return (
    <svg viewBox="0 0 64 56" {...base(size, rest)} height={(size * 56) / 64}>
      <circle cx="26" cy="26" r="18" />
      <path d="M12 16c8 2 18 10 22 26" />
      <path d="M10 26c8-1 20 4 26 15" />
      <path d="M17 10c8 4 16 13 18 26" />
      <path d="M30 8.5c-3 8-3 20 2 33" />
      <path d="M40 15c-6 4-10 14-9 27" />
      <path d="M42 36c6 4 10 10 18 9" />
    </svg>
  );
}

export function Sprig({ size = 40, ...rest }: P) {
  return (
    <svg viewBox="0 0 40 40" {...base(size, rest)}>
      <path d="M8 36C14 26 20 16 32 5" />
      <path d="M14 26c-5-1-8-4-8-8 4 0 7 3 8 8Z" />
      <path d="M14 26c1-5 4-7 8-7-1 4-4 6-8 7Z" />
      <path d="M20 17c-4-2-6-5-5-9 3 1 5 4 5 9Z" />
      <path d="M20 17c2-4 5-5 9-5-1 3-4 5-9 5Z" />
    </svg>
  );
}

export function Sparkle({ size = 28, ...rest }: P) {
  return (
    <svg viewBox="0 0 28 28" {...base(size, rest)}>
      <path d="M6 13 2.5 11" />
      <path d="M10 7.5 9 3" />
      <path d="M16 8l3-4" />
    </svg>
  );
}

export function Star({ size = 24, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" {...base(size, rest)}>
      <path d="M12 3.2l2.5 5.5 5.9.6-4.5 4 1.3 5.9L12 16.2l-5.2 3 1.3-5.9-4.5-4 5.9-.6Z" />
    </svg>
  );
}

export function Squiggle({ size = 80, ...rest }: P) {
  return (
    <svg viewBox="0 0 80 12" {...base(size, rest)} height={(size * 12) / 80}>
      <path d="M2 7c5-5 9 4 14 0s9-5 14 0 9 4 14 0 9-5 14 0 9 4 14 0" />
    </svg>
  );
}

// Bigger "object" doodles used inside image placeholders.
export function Bunny({ size = 96, ...rest }: P) {
  return (
    <svg viewBox="0 0 96 96" {...base(size, rest)}>
      <path d="M36 40c-6-10-8-26-2-30s10 12 9 27" />
      <path d="M60 40c6-10 8-26 2-30s-10 12-9 27" />
      <circle cx="48" cy="54" r="18" />
      <path d="M33 70c-4 6-4 14 3 16h24c7-2 7-10 3-16" />
      <circle cx="42" cy="52" r="1.3" fill="currentColor" />
      <circle cx="54" cy="52" r="1.3" fill="currentColor" />
      <path d="M45 59c2 2 4 2 6 0" />
      <path d="M36 57h-3M63 57h-3" />
    </svg>
  );
}

export function Bag({ size = 96, ...rest }: P) {
  return (
    <svg viewBox="0 0 96 96" {...base(size, rest)}>
      <path d="M22 38h52l-5 44H27Z" />
      <path d="M36 38c0-14 4-22 12-22s12 8 12 22" />
      <path d="M30 50h36M31 60h34M32 70h32" strokeDasharray="3 5" />
    </svg>
  );
}

export function Flower({ size = 96, ...rest }: P) {
  return (
    <svg viewBox="0 0 96 96" {...base(size, rest)}>
      <path d="M48 46v40" />
      <path d="M48 70c-8-2-14-8-14-16 8 1 13 7 14 16Z" />
      <path d="M48 64c6-1 11-6 12-12-7 0-11 5-12 12Z" />
      <path d="M48 46c-9 0-14-8-12-20 4 3 7 4 12 2 5 2 8 1 12-2 2 12-3 20-12 20Z" />
      <path d="M48 28c-2-5-2-10 0-14 2 4 2 9 0 14Z" />
    </svg>
  );
}

export function GiftBox({ size = 96, ...rest }: P) {
  return (
    <svg viewBox="0 0 96 96" {...base(size, rest)}>
      <rect x="20" y="40" width="56" height="42" rx="4" />
      <path d="M16 32h64v8H16Z" />
      <path d="M48 32v50" />
      <path d="M48 32c-8-10-20-10-18-2 1 4 10 3 18 2Zm0 0c8-10 20-10 18-2-1 4-10 3-18 2Z" />
    </svg>
  );
}

export const doodleMap = {
  heart: Heart,
  star: Star,
  sprig: Sprig,
  sparkle: Sparkle,
  yarn: YarnBall,
  bunny: Bunny,
  bag: Bag,
  flower: Flower,
  gift: GiftBox,
} as const;

export type DoodleName = keyof typeof doodleMap;

export function Doodle({ name, ...rest }: P & { name: string }) {
  const C = doodleMap[name as DoodleName] ?? YarnBall;
  return <C {...rest} />;
}
