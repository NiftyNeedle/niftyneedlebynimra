-- ============================================================
--  Nifty Needle — make order numbers random & unguessable
--  Run once in the Supabase SQL Editor (safe on an existing DB).
--
--  Before: NN-1001, NN-1002, … (sequential → guessable, so anyone
--          could enumerate other people's orders on the tracking page).
--  After:  NN-7K3QX9P2, NN-M4TB6WZ8, … (random → acts as a private
--          token, so an order can only be looked up by someone who
--          actually has the number).
--
--  Existing orders keep their old numbers; only NEW orders get random
--  ones. Nothing else changes.
-- ============================================================

-- Generates NN-XXXXXXXX using an alphabet without look-alike
-- characters (no 0/O, 1/I/L) so it's easy to read and type.
create or replace function public.gen_order_number()
returns text
language plpgsql
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  candidate text;
  i int;
begin
  loop
    candidate := 'NN-';
    for i in 1..8 loop
      candidate := candidate
        || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    -- Retry on the (astronomically unlikely) chance of a collision.
    exit when not exists (
      select 1 from public.orders where order_number = candidate
    );
  end loop;
  return candidate;
end;
$$;

-- New orders now get a random number by default.
alter table public.orders
  alter column order_number set default public.gen_order_number();
