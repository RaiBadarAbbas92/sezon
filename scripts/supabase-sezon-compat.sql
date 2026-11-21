-- Sezon ↔ Bustaniya admin compatibility. Run BEFORE scripts/supabase-catalog-categories.sql.
-- supabase/schema.sql created catalog_categories with (is_active, image_url); the admin panel uses
-- (status, image, description, updated_at). Add those columns and keep both pairs in sync.

alter table public.catalog_categories
  add column if not exists description text not null default '',
  add column if not exists image text not null default '',
  add column if not exists status text not null default 'Active',
  add column if not exists updated_at timestamptz not null default now();

update public.catalog_categories
set status = case when is_active then 'Active' else 'Draft' end,
    image = coalesce(nullif(image, ''), image_url, '')
where status is distinct from case when is_active then 'Active' else 'Draft' end
   or (image = '' and image_url is not null);

create or replace function public.sezon_sync_category_columns() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    new.is_active := (new.status = 'Active');
  elsif new.is_active is distinct from old.is_active then
    new.status := case when new.is_active then 'Active' else 'Draft' end;
  end if;
  if tg_op = 'INSERT' or new.image is distinct from old.image then
    new.image_url := nullif(new.image, '');
  elsif new.image_url is distinct from old.image_url then
    new.image := coalesce(new.image_url, '');
  end if;
  return new;
end $$;

drop trigger if exists sezon_sync_category_columns on public.catalog_categories;
create trigger sezon_sync_category_columns before insert or update on public.catalog_categories
for each row execute function public.sezon_sync_category_columns();
