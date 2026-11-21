create table if not exists public.catalog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image text not null default '',
  parent_slug text,
  status text not null default 'Active' check (status in ('Active', 'Draft', 'Archived')),
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.catalog_categories
  add column if not exists show_in_header boolean not null default true,
  add column if not exists show_on_homepage boolean not null default true,
  add column if not exists show_in_footer boolean not null default false,
  add column if not exists show_in_search boolean not null default true,
  add column if not exists seo_title text not null default '',
  add column if not exists seo_description text not null default '',
  add column if not exists image_alt text not null default '';

create index if not exists catalog_categories_parent_slug_idx on public.catalog_categories (parent_slug);
create index if not exists catalog_categories_status_sort_idx on public.catalog_categories (status, sort_order);

alter table public.catalog_categories enable row level security;

drop policy if exists "Public active catalog categories are readable" on public.catalog_categories;
create policy "Public active catalog categories are readable"
  on public.catalog_categories
  for select
  using (status = 'Active');

-- Sezon: categories are seeded by supabase/seed.sql (structure fixed in lib/brand.ts).
