-- MainU - Moderation system
-- User-submitted restaurants and dishes go to 'pending' status first.
-- Admin (Yaron) approves them via Supabase Studio Table Editor.
-- Run after 0001_init.sql.

-- ============================================================
-- 1) Add status + created_by columns
-- ============================================================

alter table public.restaurants
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'));

alter table public.restaurants
  add column if not exists created_by uuid references auth.users(id) on delete set null;

alter table public.dishes
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'));

alter table public.dishes
  add column if not exists created_by uuid references auth.users(id) on delete set null;

-- ============================================================
-- 2) Backfill existing seed data as 'approved' (we trust the seed)
-- ============================================================

update public.restaurants set status = 'approved' where created_by is null;
update public.dishes        set status = 'approved' where created_by is null;

-- ============================================================
-- 3) Triggers — auto-set created_by + force status='pending' on insert
-- ============================================================

create or replace function public.set_pending_and_creator()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Force every new user submission to pending — admin must approve
  new.status     := 'pending';
  new.created_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists restaurants_set_pending on public.restaurants;
create trigger restaurants_set_pending
  before insert on public.restaurants
  for each row execute function public.set_pending_and_creator();

drop trigger if exists dishes_set_pending on public.dishes;
create trigger dishes_set_pending
  before insert on public.dishes
  for each row execute function public.set_pending_and_creator();

-- ============================================================
-- 4) Replace read policies — only approved is public, plus own submissions
-- ============================================================

drop policy if exists "restaurants read" on public.restaurants;
create policy "restaurants read" on public.restaurants for select using (
  status = 'approved' or created_by = auth.uid()
);

drop policy if exists "dishes read" on public.dishes;
create policy "dishes read" on public.dishes for select using (
  status = 'approved' or created_by = auth.uid()
);

-- ============================================================
-- 5) Insert policies (idempotent — works if you already created them earlier)
-- ============================================================

drop policy if exists "restaurants insert auth" on public.restaurants;
create policy "restaurants insert auth" on public.restaurants for insert
  with check (auth.uid() is not null);

drop policy if exists "dishes insert auth" on public.dishes;
create policy "dishes insert auth" on public.dishes for insert
  with check (auth.uid() is not null);
