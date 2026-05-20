-- 002_rls_policies.sql
-- For quick testing only. Use policies for production.

-- Disable RLS for quick testing:
alter table bookings disable row level security;
alter table menus disable row level security;

-- If you prefer to enable RLS and add permissive policies for testing, use:
-- alter table bookings enable row level security;
-- create policy open_all_bookings on bookings for all using (true) with check (true);
-- alter table menus enable row level security;
-- create policy open_all_menus on menus for all using (true) with check (true);
