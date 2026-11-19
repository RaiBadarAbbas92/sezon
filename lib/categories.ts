// Helpers around the category tree in lib/brand.ts. Pure functions — safe in server and client components.
import { categories as tree, type Category, type SubCategory } from "./brand";

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // "Décor" → "Decor"
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export interface CategoryMatch {
  section: Category;
  sub?: SubCategory;
}

/** Find a section or sub-category by its slug (slugs are unique across the whole tree). */
export function findCategory(slug: string | undefined, cats: Category[] = tree): CategoryMatch | undefined {
  if (!slug) return undefined;
  for (const section of cats) {
    if (section.slug === slug) return { section };
    const sub = section.children.find((c) => c.slug === slug);
    if (sub) return { section, sub };
  }
  return undefined;
}

/** Clean URL for a section or sub-category: /bags, /clothing/cardigans. */
export function categoryHref(slug: string, cats: Category[] = tree): string {
  const hit = findCategory(slug, cats);
  if (!hit) return "/shop";
  return hit.sub ? `/${hit.section.slug}/${hit.sub.slug}` : `/${hit.section.slug}`;
}

/** Does a product with category `productSlug` belong on the page for `slug`? (sections include their subs) */
export function inCategory(productSlug: string, slug: string, cats: Category[] = tree): boolean {
  if (productSlug === slug) return true;
  const hit = findCategory(productSlug, cats);
  return !!hit?.sub && hit.section.slug === slug;
}

/** Map whatever the admin stored ("Clothing > Cardigans", "clothing/cardigans", "Home Décor", "cardigans") to a slug. */
export function matchCategorySlug(raw: unknown, cats: Category[] = tree): string {
  const parts = String(raw ?? "")
    .split(/[>/|]/)
    .map((p) => slugify(p))
    .filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    for (const section of cats) {
      if (slugify(section.label) === parts[i] || section.slug === parts[i]) return section.slug;
      const sub = section.children.find((c) => c.slug === parts[i] || slugify(c.label) === parts[i]);
      if (sub) return sub.slug;
    }
  }
  return parts.at(-1) ?? "";
}

/** Flat list of every valid category option, in menu order — e.g. for a product form's category dropdown. */
export function categoryOptions(cats: Category[] = tree) {
  return cats.flatMap((s) => [
    { slug: s.slug, label: s.label, parent: null as string | null },
    ...s.children.map((c) => ({ slug: c.slug, label: c.label, parent: s.slug })),
  ]);
}
