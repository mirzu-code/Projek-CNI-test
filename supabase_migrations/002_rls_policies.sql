-- 002_rls_policies.sql
-- For quick testing only. Use policies for production.

-- Enable RLS with open policies for testing.
-- This lets the app insert/read bookings and read menus from the anonymous client.
-- In production, replace these with stricter policies.

alter table bookings enable row level security;
create policy open_all_bookings on bookings for all using (true) with check (true);

alter table menus enable row level security;
create policy open_all_menus on menus for all using (true) with check (true);

alter table admin_user enable row level security;
create policy open_all_admin_user on admin_user for select using (true) with check (true);
