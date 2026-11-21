// Sezon admin category data. Top-level sections mirror lib/brand.ts (the storefront's fixed category tree);
// sub-categories come from Supabase catalog_categories (parent_slug). Keep both in sync when adding a section.
export const STORE_CATEGORIES = [
  "Clothing",
  "Accessories",
  "Bags",
  "Home & Living",
  "Gifts",
  "Amigurumi",
];
export const categories = ["All", ...STORE_CATEGORIES];
const categoryMetaSeparator = "||";

// Sub-category slug → its section (lib/brand.ts). Storefront-created products store just the sub slug ("cardigans").
const SUBCATEGORY_PARENTS = {
  cardigans: "Clothing",
  "pullovers-sweaters": "Clothing",
  hoodies: "Clothing",
  "sweater-vests": "Clothing",
  "shrugs-boleros": "Clothing",
  "hair-accessories": "Accessories",
  keychains: "Accessories",
  bookmarks: "Accessories",
  "cushion-covers": "Home & Living",
  "tissue-box-covers": "Home & Living",
  "home-decor": "Home & Living",
  "gift-sets": "Gifts",
  "custom-gifts": "Gifts",
};

const categoryAliases = {
  clothes: "Clothing",
  sweater: "Clothing",
  sweaters: "Clothing",
  accessory: "Accessories",
  bag: "Bags",
  tote: "Bags",
  totes: "Bags",
  "home and living": "Home & Living",
  home: "Home & Living",
  gift: "Gifts",
  toy: "Amigurumi",
  toys: "Amigurumi",
  plushie: "Amigurumi",
  plushies: "Amigurumi",
};

export function normalizeCategory(value) {
  const raw = String(value || "").split(categoryMetaSeparator)[0].trim();
  if (!raw) return "Uncategorized";
  const key = raw
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");

  return categoryAliases[key] || categories.find((category) => category.toLowerCase() === raw.toLowerCase()) || raw;
}

export function slugifyCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryToSlug(value) {
  const normalized = normalizeCategory(value);
  if (normalized === "Home & Living") return "home-living";
  return slugifyCategory(normalized);
}

export function parseCategorySelection(value) {
  const [category = "", subcategory = "", collection = ""] = String(value || "")
    .split(categoryMetaSeparator)
    .map((part) => part.trim());
  const subParent = SUBCATEGORY_PARENTS[slugifyCategory(category)];
  if (subParent && !subcategory) return { category: subParent, subcategory: slugifyCategory(category), collection };

  return {
    category: normalizeCategory(category),
    subcategory,
    collection,
  };
}

export function formatCategorySelection({ category, subcategory = "", collection = "" }) {
  const normalizedCategory = normalizeCategory(category);
  const cleanSubcategory = String(subcategory || "").trim();
  const cleanCollection = String(collection || "").trim();
  if (!cleanSubcategory && !cleanCollection) return normalizedCategory;
  return [normalizedCategory, cleanSubcategory, cleanCollection].join(categoryMetaSeparator);
}

export const categoryDetails = {
  clothing: { name: "Clothing", description: "Handmade crochet cardigans, sweaters, vests and more.", image: "" },
  accessories: { name: "Accessories", description: "Crochet hair accessories, keychains and bookmarks.", image: "" },
  bags: { name: "Bags", description: "Hand-stitched crochet totes and bags.", image: "" },
  "home-living": { name: "Home & Living", description: "Cushion covers, coasters and handmade home décor.", image: "" },
  gifts: { name: "Gifts", description: "Ready-to-gift sets and custom crochet gifts.", image: "" },
  amigurumi: { name: "Amigurumi", description: "Soft crochet toys, stitched to be squeezed.", image: "" },
};

// No offline catalogue: if Supabase is unreachable the storefront shows nothing
// rather than products that checkout would reject.
export const products = [];


