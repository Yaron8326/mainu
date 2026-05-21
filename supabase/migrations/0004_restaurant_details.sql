-- MainU - Restaurant additional details (migration 0004)
-- Adds opening hours, phone number, and reservation URL to restaurants.
-- Hours format: JSON object keyed by weekday (0=Sun ... 6=Sat) with array of {open, close} time slots.
-- Example: {"0": [{"open":"09:00","close":"23:00"}], "5": [{"open":"09:00","close":"15:00"}]}

alter table public.restaurants
  add column if not exists phone text,
  add column if not exists reservation_url text,
  add column if not exists hours jsonb;

-- Helper view: today's hours for each restaurant, useful for "open now?" indicator
-- (Optional — not strictly required for v1, but here for future use)
create or replace function public.is_restaurant_open_now(p_hours jsonb, p_now timestamptz default now())
returns boolean
language plpgsql
stable
as $$
declare
  v_dow text := extract(dow from p_now at time zone 'Asia/Jerusalem')::int::text;
  v_time text := to_char(p_now at time zone 'Asia/Jerusalem', 'HH24:MI');
  v_slots jsonb;
  v_slot jsonb;
begin
  if p_hours is null then return null; end if;
  v_slots := p_hours->v_dow;
  if v_slots is null or jsonb_array_length(v_slots) = 0 then return false; end if;
  for v_slot in select jsonb_array_elements(v_slots)
  loop
    if v_time >= (v_slot->>'open') and v_time <= (v_slot->>'close') then
      return true;
    end if;
  end loop;
  return false;
end;
$$;
