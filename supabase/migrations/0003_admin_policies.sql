-- MainU - Admin moderation policies (migration 0003)
-- Allows the admin user (Yaron) to UPDATE moderation status on restaurants/dishes.
-- Run after 0001_init.sql and 0002_moderation.sql.

-- Helper function — returns true if the calling user is an admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(coalesce(auth.jwt() ->> 'email', '')) in (
      'yaronlevy1983@gmail.com'
      -- Add more admin emails here, comma-separated, lowercase
    ),
    false
  );
$$;

-- Restaurants: admin can update status (or any field)
drop policy if exists "restaurants admin update" on public.restaurants;
create policy "restaurants admin update" on public.restaurants
  for update using (public.is_admin()) with check (public.is_admin());

-- Dishes: admin can update status (or any field)
drop policy if exists "dishes admin update" on public.dishes;
create policy "dishes admin update" on public.dishes
  for update using (public.is_admin()) with check (public.is_admin());
