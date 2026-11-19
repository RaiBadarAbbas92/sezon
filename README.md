This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Supabase (products, categories, orders)

The store uses the same tables as the Bustaniya backend, so that admin panel can manage it.

1. Supabase → SQL Editor: run `supabase/schema.sql`, then `supabase/seed.sql` (the category tree, retires old categories, demo crochet products).
2. Copy `.env.example` to `.env.local` and fill in the URL + keys, then restart `npm run dev`.

Without `.env.local` the store shows the local catalogue from `lib/products.ts`, and checkout runs in demo mode (no order is saved).
Products, categories and stock come from `lib/catalog.ts`; checkout posts to `app/api/orders/route.ts`.

### Categories

The category structure is fixed in `lib/brand.ts` (6 sections: Clothing, Accessories, Bags, Home & Living, Gifts,
Amigurumi, with their sub-categories). Each has a clean URL: `/clothing`, `/clothing/cardigans`, `/bags`, …
A product's `category` is the most specific slug (`cardigans`, `bags`); `catalog_categories` only supplies cover images
and the admin panel's dropdown options.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
