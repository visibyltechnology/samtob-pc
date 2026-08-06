-- ============================================================================
-- SAMTOB P&C — Supabase schema
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run: uses "if not exists" / "or replace" everywhere it can.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. PROFILES  (extends Supabase's built-in auth.users with app-specific fields)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own or admin reads all" on public.profiles;
create policy "profiles: read own or admin reads all"
  on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper used by policies below to check "is the current user an admin?"
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. PRODUCTS
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null check (category in ('laptops', 'phones', 'gadgets')),
  condition text not null check (condition in ('new', 'uk-used')),
  brand text not null,
  price integer not null check (price >= 0),
  old_price integer check (old_price >= 0),
  specs jsonb not null default '{}'::jsonb,
  stock integer not null default 0 check (stock >= 0),
  warranty_days integer not null default 0,
  description text not null default '',
  images text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products: public read" on public.products;
create policy "products: public read"
  on public.products for select
  using (true);

drop policy if exists "products: admin write" on public.products;
create policy "products: admin write"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. ORDERS
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  region text not null check (region in ('ibadan', 'southwest', 'eastern', 'northern')),
  delivery_method text not null,
  delivery_fee integer not null default 0,
  items jsonb not null,
  subtotal integer not null,
  total integer not null,
  payment_method text not null check (payment_method in ('bank-transfer', 'klump', 'save-to-buy')),
  payment_status text not null default 'awaiting_confirmation'
    check (payment_status in ('awaiting_confirmation', 'paid', 'failed')),
  bank_reference text,
  klump_reference text,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "orders: anyone can create (guest checkout allowed)" on public.orders;
create policy "orders: anyone can create (guest checkout allowed)"
  on public.orders for insert
  with check (true);

drop policy if exists "orders: owner, guest order, or admin reads" on public.orders;
create policy "orders: owner, guest order, or admin reads"
  on public.orders for select
  using (auth.uid() = user_id or user_id is null or public.is_admin());

drop policy if exists "orders: admin updates" on public.orders;
create policy "orders: admin updates"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. SAVE-TO-BUY PLANS  (customer saves toward a product in instalments)
-- ----------------------------------------------------------------------------
create table if not exists public.save_to_buy_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  target_amount integer not null check (target_amount > 0),
  saved_amount integer not null default 0 check (saved_amount >= 0),
  frequency text not null default 'monthly' check (frequency in ('weekly', 'monthly')),
  installment_amount integer not null default 0 check (installment_amount >= 0),
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Safe to run again even if you already created this table before frequency/installment_amount existed:
alter table public.save_to_buy_plans add column if not exists frequency text not null default 'monthly';
alter table public.save_to_buy_plans add column if not exists installment_amount integer not null default 0;

alter table public.save_to_buy_plans enable row level security;

drop policy if exists "save_to_buy_plans: owner or admin reads" on public.save_to_buy_plans;
create policy "save_to_buy_plans: owner or admin reads"
  on public.save_to_buy_plans for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "save_to_buy_plans: owner creates" on public.save_to_buy_plans;
create policy "save_to_buy_plans: owner creates"
  on public.save_to_buy_plans for insert
  with check (auth.uid() = user_id);

drop policy if exists "save_to_buy_plans: owner cancels or admin updates" on public.save_to_buy_plans;
create policy "save_to_buy_plans: owner cancels or admin updates"
  on public.save_to_buy_plans for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. SAVE-TO-BUY CONTRIBUTIONS  (each bank-transfer top-up toward a plan)
-- ----------------------------------------------------------------------------
create table if not exists public.save_to_buy_contributions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.save_to_buy_plans(id) on delete cascade,
  amount integer not null check (amount > 0),
  bank_reference text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

alter table public.save_to_buy_contributions enable row level security;

drop policy if exists "contributions: owner or admin reads" on public.save_to_buy_contributions;
create policy "contributions: owner or admin reads"
  on public.save_to_buy_contributions for select
  using (
    public.is_admin() or exists (
      select 1 from public.save_to_buy_plans plan
      where plan.id = plan_id and plan.user_id = auth.uid()
    )
  );

drop policy if exists "contributions: owner creates" on public.save_to_buy_contributions;
create policy "contributions: owner creates"
  on public.save_to_buy_contributions for insert
  with check (
    exists (
      select 1 from public.save_to_buy_plans plan
      where plan.id = plan_id and plan.user_id = auth.uid()
    )
  );

drop policy if exists "contributions: admin updates" on public.save_to_buy_contributions;
create policy "contributions: admin updates"
  on public.save_to_buy_contributions for update
  using (public.is_admin())
  with check (public.is_admin());

-- Automatically bump save_to_buy_plans.saved_amount + status whenever
-- a contribution is confirmed (confirmation itself happens via the admin API route).
create or replace function public.apply_confirmed_contribution()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'confirmed' and old.status is distinct from 'confirmed' then
    update public.save_to_buy_plans
      set saved_amount = saved_amount + new.amount,
          status = case when saved_amount + new.amount >= target_amount then 'completed' else status end
      where id = new.plan_id;
    new.confirmed_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_contribution_confirmed on public.save_to_buy_contributions;
create trigger on_contribution_confirmed
  before update on public.save_to_buy_contributions
  for each row execute procedure public.apply_confirmed_contribution();

-- ----------------------------------------------------------------------------
-- 6. REVIEWS
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating int not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews: public read" on public.reviews;
create policy "reviews: public read"
  on public.reviews for select
  using (true);

drop policy if exists "reviews: admin write" on public.reviews;
create policy "reviews: admin write"
  on public.reviews for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. STORAGE — bucket for product images (public read, admin write via API)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product-images: public read" on storage.objects;
create policy "product-images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Uploads happen through /api/upload using the service-role key on the server,
-- which bypasses RLS entirely — so no public insert policy is required here.

-- ----------------------------------------------------------------------------
-- 8. SEED DATA — your 12 starter products + 3 sample reviews
-- ----------------------------------------------------------------------------
insert into public.products (name, slug, category, condition, brand, price, old_price, specs, stock, warranty_days, description, images, featured)
values
  ('HP EliteBook 840 G6', 'hp-elitebook-840-g6', 'laptops', 'uk-used', 'HP', 385000, 450000,
   '{"cpu":"Intel Core i5-8th Gen","ram":"8GB DDR4","storage":"256GB SSD","screen":"14\" FHD"}', 6, 30,
   'Sleek business laptop, UK used, thoroughly tested and cleaned. Comes with charger, bag and 30 days limited guaranty.',
   array['/images/products/laptop-1.svg'], true),
  ('Dell Latitude 5410', 'dell-latitude-5410', 'laptops', 'uk-used', 'Dell', 420000, 480000,
   '{"cpu":"Intel Core i7-10th Gen","ram":"16GB DDR4","storage":"512GB SSD","screen":"14\" FHD"}', 4, 30,
   'Powerful i7 business laptop, UK used, great for multitasking and light design work.',
   array['/images/products/laptop-2.svg'], true),
  ('Apple MacBook Air M1', 'macbook-air-m1', 'laptops', 'new', 'Apple', 950000, null,
   '{"cpu":"Apple M1","ram":"8GB","storage":"256GB SSD","screen":"13.3\" Retina"}', 3, 365,
   'Brand new sealed MacBook Air with M1 chip. 1 year full warranty.',
   array['/images/products/laptop-3.svg'], true),
  ('Lenovo ThinkPad T480', 'lenovo-thinkpad-t480', 'laptops', 'uk-used', 'Lenovo', 310000, 360000,
   '{"cpu":"Intel Core i5-8th Gen","ram":"8GB DDR4","storage":"256GB SSD","screen":"14\" HD"}', 8, 30,
   'Rugged and reliable ThinkPad, great battery life, ideal for students and office work.',
   array['/images/products/laptop-4.svg'], false),
  ('iPhone 12 Pro 128GB', 'iphone-12-pro-128gb', 'phones', 'uk-used', 'Apple', 480000, 540000,
   '{"storage":"128GB","ram":"6GB","screen":"6.1\" Super Retina XDR","battery":"Health 88%+"}', 5, 30,
   'Clean UK used iPhone 12 Pro, factory unlocked, Face ID working perfectly.',
   array['/images/products/phone-1.svg'], true),
  ('Samsung Galaxy S23', 'samsung-galaxy-s23', 'phones', 'new', 'Samsung', 620000, null,
   '{"storage":"256GB","ram":"8GB","screen":"6.1\" Dynamic AMOLED"}', 7, 365,
   'Brand new Samsung flagship, sealed in box, 1 year manufacturer warranty.',
   array['/images/products/phone-2.svg'], true),
  ('iPhone 11 64GB', 'iphone-11-64gb', 'phones', 'uk-used', 'Apple', 290000, 330000,
   '{"storage":"64GB","ram":"4GB","screen":"6.1\" Liquid Retina"}', 10, 30,
   'Affordable and reliable, UK used iPhone 11 in excellent cosmetic condition.',
   array['/images/products/phone-3.svg'], false),
  ('JBL Flip 6 Bluetooth Speaker', 'jbl-flip-6', 'gadgets', 'new', 'JBL', 65000, 78000,
   '{"battery":"12 hours playtime","rating":"IP67 waterproof"}', 15, 365,
   'Portable waterproof Bluetooth speaker with punchy bass. Brand new, sealed.',
   array['/images/products/gadget-1.svg'], true),
  ('Apple Watch Series 8', 'apple-watch-series-8', 'gadgets', 'new', 'Apple', 340000, null,
   '{"size":"45mm","connectivity":"GPS"}', 4, 365,
   'Brand new Apple Watch Series 8, GPS model, 1 year warranty.',
   array['/images/products/gadget-2.svg'], false),
  ('Anker PowerCore 20000mAh', 'anker-powercore-20000', 'gadgets', 'new', 'Anker', 32000, 38000,
   '{"capacity":"20000mAh","ports":"2x USB-A, 1x USB-C"}', 20, 180,
   'High capacity fast-charging power bank, brand new with 6 months warranty.',
   array['/images/products/gadget-3.svg'], false),
  ('HP Pavilion 15', 'hp-pavilion-15', 'laptops', 'new', 'HP', 540000, null,
   '{"cpu":"Intel Core i5-12th Gen","ram":"8GB DDR4","storage":"512GB SSD","screen":"15.6\" FHD"}', 6, 365,
   'Brand new HP Pavilion, sealed box, ideal for everyday computing and light gaming.',
   array['/images/products/laptop-5.svg'], false),
  ('Samsung Galaxy A54', 'samsung-galaxy-a54', 'phones', 'new', 'Samsung', 310000, 335000,
   '{"storage":"128GB","ram":"8GB","screen":"6.4\" Super AMOLED"}', 9, 365,
   'Brand new mid-range Samsung with excellent camera and battery life.',
   array['/images/products/phone-4.svg'], true)
on conflict (slug) do nothing;

insert into public.reviews (name, text, rating)
values
  ('Bukola A.', 'Bought a UK used HP laptop, works perfectly and delivery was fast within Ibadan.', 5),
  ('Emeka O.', 'Great customer service, they fixed my phone screen same day at Challenge store.', 5),
  ('Fatima Y.', 'Nationwide delivery worked well for me, laptop arrived in 4 days, well packaged.', 4)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- 9. MAKE YOURSELF ADMIN
-- ----------------------------------------------------------------------------
-- After you sign up for the first time on the live site (via /account/register),
-- run this once, replacing the email, to promote that account to admin:
--
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'your-real-admin-email@example.com');
