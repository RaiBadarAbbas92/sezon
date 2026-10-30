// Mock catalogue. Shape matches what a Supabase `products` table would return,
// so swapping this for a fetch later only touches this file.
//
// Images: a URL or a real path ("/images/bunny-1.jpg") renders with next/image.
// "ph:<doodle>:<tone>" renders a soft placeholder block until real photos exist.

import { unsplash } from "./photos";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  colors?: ColorOption[];
  sizes?: string[];
  rating: number;
  reviews: number;
  description: string;
  materials: string;
  care: string;
  bestseller?: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "bunny-snuggle-buddy",
    name: "Bunny Snuggle Buddy",
    price: 2450,
    oldPrice: 2900,
    images: [unsplash("1753370241607-5d48d8aaa70e"), unsplash("1753370241583-82d8c84f0c6e"), unsplash("1753370241739-1d53df4fe604"), unsplash("1753370230699-8e21227afeb6")],
    category: "amigurumi",
    colors: [
      { name: "Blush", hex: "#F2D3CB" },
      { name: "Oat", hex: "#ECE1D0" },
      { name: "Sage", hex: "#A9B79A" },
    ],
    sizes: ["Mini 15cm", "Classic 25cm"],
    rating: 4.9,
    reviews: 128,
    description:
      "A floppy-eared bunny with a tiny stitched smile, made to be squeezed. Soft enough for naps, sturdy enough for adventures.",
    materials: "100% milk cotton yarn, hypoallergenic polyfill, safety eyes locked from inside.",
    care: "Hand wash in cool water with mild soap. Reshape and dry flat in the shade.",
    bestseller: true,
  },
  {
    id: "p2",
    slug: "sunflower-market-tote",
    name: "Sunflower Market Tote",
    price: 3800,
    images: [unsplash("1565592284032-d3c08f2a53e9"), unsplash("1787432131008-c754654978a4"), unsplash("1686285961015-12886f9b3bf5")],
    category: "bags",
    colors: [
      { name: "Butter", hex: "#EBD9A8" },
      { name: "Oat", hex: "#ECE1D0" },
    ],
    rating: 4.8,
    reviews: 64,
    description:
      "An airy mesh tote for fruit runs and beach days. Stretches to fit more than you'd think, folds into almost nothing.",
    materials: "Mercerised cotton, reinforced double-stitched handles.",
    care: "Hand wash, dry flat. Do not tumble dry.",
    bestseller: true,
  },
  {
    id: "p3",
    slug: "tulip-bouquet",
    name: "Forever Tulip Bouquet",
    price: 3200,
    oldPrice: 3600,
    images: [unsplash("1768029120664-119e99b02e5b"), unsplash("1789406075648-fd2688a93865"), unsplash("1753366556699-4be495e5bdd6")],
    category: "home-decor",
    colors: [
      { name: "Pink mix", hex: "#F2D3CB" },
      { name: "Cream mix", hex: "#F5EEE3" },
    ],
    sizes: ["5 stems", "9 stems"],
    rating: 5,
    reviews: 92,
    description:
      "Tulips that never wilt. Wrapped in kraft paper with a little handwritten tag — the gift that stays on the shelf for years.",
    materials: "Cotton-acrylic blend, floral wire stems, kraft wrap.",
    care: "Dust gently with a soft brush. Keep away from direct sun to protect the colour.",
    bestseller: true,
  },
  {
    id: "p4",
    slug: "cloud-scrunchie-set",
    name: "Cloud Scrunchie Set",
    price: 950,
    images: [unsplash("1606772016409-d4a55e32be6e"), unsplash("1671272980311-9055ae800653")],
    category: "accessories",
    colors: [
      { name: "Pastels", hex: "#F8E6E1" },
      { name: "Earthy", hex: "#C9A27A" },
    ],
    rating: 4.7,
    reviews: 210,
    description: "A set of three chunky scrunchies that hold without pulling. Kind to curls, kind to hair.",
    materials: "Soft cotton yarn over snag-free elastic.",
    care: "Hand wash, air dry.",
    bestseller: true,
  },
  {
    id: "p5",
    slug: "little-lamb-rattle",
    name: "Little Lamb Rattle",
    price: 1650,
    images: [unsplash("1602773974733-b56200c8653f"), unsplash("1784368611073-1f2c83e7c7a0")],
    category: "baby",
    colors: [{ name: "Cream", hex: "#F5EEE3" }],
    rating: 4.9,
    reviews: 41,
    description: "A gentle rattle with a wooden ring for tiny hands. Lightweight, soft, and safe for little mouths.",
    materials: "Organic cotton, untreated beech wood ring, enclosed rattle insert.",
    care: "Spot clean only. Wipe the wooden ring with a damp cloth.",
  },
  {
    id: "p6",
    slug: "mushroom-coasters",
    name: "Mushroom Coaster Set",
    price: 1400,
    oldPrice: 1700,
    images: [unsplash("1648217736318-fbc4abc138ec"), unsplash("1761206887052-9abec0c38f03"), unsplash("1682954013913-25fe41e180c0")],
    category: "home-decor",
    rating: 4.6,
    reviews: 37,
    description: "Four little toadstools to keep your chai rings off the table. They look cute stacked, too.",
    materials: "Thick cotton cord, heat-safe.",
    care: "Machine wash cold in a laundry bag, dry flat.",
  },
  {
    id: "p7",
    slug: "bear-in-a-sweater",
    name: "Bear in a Sweater",
    price: 2750,
    images: [unsplash("1674069698102-682409828872"), unsplash("1715259118737-670c63950059"), unsplash("1715432755528-46ddd67eab7c")],
    category: "amigurumi",
    colors: [
      { name: "Honey", hex: "#C9A27A" },
      { name: "Oat", hex: "#ECE1D0" },
    ],
    rating: 4.8,
    reviews: 55,
    description: "A round little bear in a removable striped sweater. Ask us to stitch a name on the back.",
    materials: "Milk cotton yarn, polyfill, embroidered eyes (baby safe).",
    care: "Hand wash in cool water, dry flat.",
  },
  {
    id: "p8",
    slug: "tiny-gift-box",
    name: "Tiny Joy Gift Box",
    price: 4200,
    images: [unsplash("1751450236048-aa1981f7bc2d"), unsplash("1707944145479-12755f0434d8"), unsplash("1625552186152-668cd2f0b707")],
    category: "gifts",
    rating: 5,
    reviews: 29,
    description: "A mini amigurumi, a scrunchie set and a bookmark, tucked into a ribboned box with your note.",
    materials: "Assorted cotton crochet pieces, recycled kraft box.",
    care: "See each item's card inside the box.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const bestsellers = products.filter((p) => p.bestseller);
export const byCategory = (slug?: string) =>
  slug ? products.filter((p) => p.category === slug) : products;
