// Everything brand-specific lives here so it is easy to change in one place.

export const brand = {
  name: "Sezon",
  tagline: "tiny stitches, big happiness",
  footerLine: "handmade crochet, made slowly with love",
  whatsapp: "923001234567", // placeholder — international format, no "+"
  instagram: "sezon.handmade",
  email: "hello@sezon.pk",
  city: "Lahore, Pakistan",
  maker: {
    name: "Sana",
    note: "Every stitch is counted, every piece is checked twice — I hope it makes you smile.",
  },
};

export const currency = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;

export const whatsappLink = (text: string) =>
  `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;

export type CategoryIcon = "rabbit" | "bag" | "flower" | "sparkles" | "baby" | "gift";

export interface Category {
  slug: string;
  label: string;
  icon: CategoryIcon;
  doodle: "heart" | "star" | "sprig" | "sparkle" | "yarn";
}

export const categories: Category[] = [
  { slug: "amigurumi", label: "Amigurumi", icon: "rabbit", doodle: "heart" },
  { slug: "bags", label: "Bags & Totes", icon: "bag", doodle: "star" },
  { slug: "home-decor", label: "Home Decor", icon: "flower", doodle: "sprig" },
  { slug: "accessories", label: "Accessories", icon: "sparkles", doodle: "sparkle" },
  { slug: "baby", label: "Baby & Kids", icon: "baby", doodle: "yarn" },
  { slug: "gifts", label: "Gift Boxes", icon: "gift", doodle: "heart" },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/#custom", label: "Custom Orders" },
  { href: "/#story", label: "Our Story" },
  { href: "/#contact", label: "Contact" },
];
