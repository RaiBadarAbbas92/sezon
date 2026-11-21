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
    name: "Mihab",
    note: "Every stitch is counted, every piece is checked twice — I hope it makes you smile.",
  },
};

export const currency = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;

export const whatsappLink = (text: string) =>
  `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;

export type CategoryIcon = "rabbit" | "bag" | "flower" | "sparkles" | "gift" | "shirt";

export interface SubCategory {
  slug: string;
  label: string;
}

export interface Category {
  slug: string;
  label: string;
  icon: CategoryIcon;
  doodle: "heart" | "star" | "sprig" | "sparkle" | "yarn";
  image?: string; // cover photo from Supabase `catalog_categories.image_url`
  children: SubCategory[]; // empty for standalone sections (Bags, Amigurumi)
}

// The one and only category structure: nav, sidebar, filters, routes and supabase/seed.sql all follow it.
// URLs are /<section> and /<section>/<sub> (e.g. /clothing/cardigans, /bags). Every slug is unique across the tree.
export const categories: Category[] = [
  {
    slug: "clothing",
    label: "Clothing",
    icon: "shirt",
    doodle: "heart",
    children: [
      { slug: "cardigans", label: "Cardigans" },
      { slug: "pullovers-sweaters", label: "Pullovers & Sweaters" },
      { slug: "hoodies", label: "Hoodies" },
      { slug: "sweater-vests", label: "Sweater Vests" },
      { slug: "shrugs-boleros", label: "Shrugs & Boleros" },
    ],
  },
  {
    slug: "accessories",
    label: "Accessories",
    icon: "sparkles",
    doodle: "sparkle",
    children: [
      { slug: "hair-accessories", label: "Hair Accessories" },
      { slug: "keychains", label: "Keychains" },
      { slug: "bookmarks", label: "Bookmarks" },
    ],
  },
  { slug: "bags", label: "Bags", icon: "bag", doodle: "star", children: [] },
  {
    slug: "home-living",
    label: "Home & Living",
    icon: "flower",
    doodle: "sprig",
    children: [
      { slug: "cushion-covers", label: "Cushion Covers" },
      { slug: "tissue-box-covers", label: "Tissue Box Covers" },
      { slug: "home-decor", label: "Home Décor" },
    ],
  },
  {
    slug: "gifts",
    label: "Gifts",
    icon: "gift",
    doodle: "heart",
    children: [
      { slug: "gift-sets", label: "Gift Sets" },
      { slug: "custom-gifts", label: "Custom Gifts" },
    ],
  },
  { slug: "amigurumi", label: "Amigurumi", icon: "rabbit", doodle: "yarn", children: [] },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/#custom", label: "Custom Orders" },
  { href: "/#story", label: "Our Story" },
  { href: "/#contact", label: "Contact" },
];
