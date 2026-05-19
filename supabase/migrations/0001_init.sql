-- MainU - Phase 1 schema
-- Run inside Supabase SQL editor (or via supabase db push)

create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  level text not null default 'beginner'
    check (level in ('beginner','advanced','experienced','pro','master')),
  ratings_count int not null default 0,
  is_chef_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  lat numeric,
  lng numeric,
  cuisine_tags text[],
  is_kosher boolean not null default false,
  is_vegan_friendly boolean not null default false,
  cover_image_url text,
  avg_dish_rating numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  category text not null
    check (category in ('starters','mains','desserts','drinks','sides')),
  price numeric,
  image_url text,
  avg_rating numeric not null default 0,
  ratings_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists dishes_restaurant_idx on public.dishes(restaurant_id);
create index if not exists dishes_name_idx on public.dishes using gin (to_tsvector('simple', name));

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references public.dishes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  photo_url text,
  comment text,
  created_at timestamptz not null default now(),
  unique (dish_id, user_id)
);

create index if not exists ratings_dish_idx on public.ratings(dish_id);
create index if not exists ratings_user_idx on public.ratings(user_id);

create table if not exists public.price_reports (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references public.dishes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reported_price numeric not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Recompute dish avg
create or replace function public.recompute_dish_stats(p_dish_id uuid)
returns void language plpgsql as $$
declare
  v_avg numeric;
  v_count int;
  v_rest uuid;
begin
  select coalesce(avg(stars), 0), count(*)
    into v_avg, v_count
    from public.ratings where dish_id = p_dish_id;

  update public.dishes
     set avg_rating = round(v_avg::numeric, 2),
         ratings_count = v_count
   where id = p_dish_id
   returning restaurant_id into v_rest;

  if v_rest is not null then
    update public.restaurants r
       set avg_dish_rating = coalesce((
         select round(avg(d.avg_rating)::numeric, 2)
           from public.dishes d
          where d.restaurant_id = r.id and d.ratings_count > 0
       ), 0)
     where r.id = v_rest;
  end if;
end;
$$;

-- Recompute profile level/count
create or replace function public.recompute_profile_stats(p_user_id uuid)
returns void language plpgsql as $$
declare v_count int; v_level text;
begin
  select count(*) into v_count from public.ratings where user_id = p_user_id;
  v_level := case
    when v_count >= 100 then 'master'
    when v_count >= 41  then 'pro'
    when v_count >= 16  then 'experienced'
    when v_count >= 6   then 'advanced'
    else 'beginner'
  end;
  update public.profiles
     set ratings_count = v_count, level = v_level
   where id = p_user_id;
end;
$$;

create or replace function public.ratings_after_change()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    perform public.recompute_dish_stats(old.dish_id);
    perform public.recompute_profile_stats(old.user_id);
    return old;
  else
    perform public.recompute_dish_stats(new.dish_id);
    perform public.recompute_profile_stats(new.user_id);
    return new;
  end if;
end;
$$;

drop trigger if exists ratings_aiu on public.ratings;
create trigger ratings_aiu
  after insert or update or delete on public.ratings
  for each row execute procedure public.ratings_after_change();

-- Price reports - update dish price after 3 similar reports
create or replace function public.price_reports_after_insert()
returns trigger language plpgsql as $$
declare v_median numeric; v_n int;
begin
  select count(*), percentile_cont(0.5) within group (order by reported_price)
    into v_n, v_median
    from public.price_reports
   where dish_id = new.dish_id
     and created_at > now() - interval '30 days';

  if v_n >= 3 then
    update public.dishes set price = round(v_median::numeric, 2)
     where id = new.dish_id;
  end if;
  return new;
end;
$$;

drop trigger if exists price_reports_ai on public.price_reports;
create trigger price_reports_ai
  after insert on public.price_reports
  for each row execute procedure public.price_reports_after_insert();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles      enable row level security;
alter table public.restaurants   enable row level security;
alter table public.dishes        enable row level security;
alter table public.ratings       enable row level security;
alter table public.price_reports enable row level security;

-- profiles
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (true);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

-- restaurants (read-only for users; admin via service key)
drop policy if exists "restaurants read" on public.restaurants;
create policy "restaurants read" on public.restaurants for select using (true);

-- dishes (read-only for users)
drop policy if exists "dishes read" on public.dishes;
create policy "dishes read" on public.dishes for select using (true);

-- ratings
drop policy if exists "ratings read" on public.ratings;
create policy "ratings read" on public.ratings for select using (true);

drop policy if exists "ratings insert own" on public.ratings;
create policy "ratings insert own" on public.ratings for insert with check (auth.uid() = user_id);

drop policy if exists "ratings update own" on public.ratings;
create policy "ratings update own" on public.ratings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ratings delete own" on public.ratings;
create policy "ratings delete own" on public.ratings for delete using (auth.uid() = user_id);

-- price reports
drop policy if exists "price reports read" on public.price_reports;
create policy "price reports read" on public.price_reports for select using (true);

drop policy if exists "price reports insert own" on public.price_reports;
create policy "price reports insert own" on public.price_reports for insert with check (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET (rating-photos)
-- Run separately if bucket creation via SQL is not allowed in your project.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('rating-photos', 'rating-photos', true)
on conflict (id) do nothing;

drop policy if exists "rating-photos public read" on storage.objects;
create policy "rating-photos public read" on storage.objects
  for select using (bucket_id = 'rating-photos');

drop policy if exists "rating-photos auth upload" on storage.objects;
create policy "rating-photos auth upload" on storage.objects
  for insert with check (
    bucket_id = 'rating-photos'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
