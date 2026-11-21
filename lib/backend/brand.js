// Store identity used by the API and admin. The Supabase project is shared with
// another storefront, so orders placed here are tagged with BRAND_TAG.
export const BRAND_NAME = "Sezon";
// Tag added to every order placed on this storefront (admin can filter by it).
export const BRAND_TAG = "Sezon";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sezon.pk").replace(/\/+$/, "");
export const ORDER_PREFIX = "SZ";
export const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1753370241607-5d48d8aaa70e?auto=format&fit=crop&w=1600&q=80";
export const FREE_DELIVERY_OVER_PKR = 5000;
