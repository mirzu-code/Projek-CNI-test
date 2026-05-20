This folder contains SQL migration files you can run in your Supabase project.

How to apply migrations:

Option A — Use Supabase SQL Editor (easiest):
1. Go to your Supabase project → SQL Editor → New query.
2. Open `001_create_tables.sql`, paste the contents, and run.
3. Open `002_rls_policies.sql` and run (only if you want to disable RLS for quick testing).

Option B — Use Supabase CLI (recommended for repeatable setup):
1. Install Supabase CLI: https://supabase.com/docs/guides/cli
2. Login: `supabase login` and follow the prompts.
3. Run SQL file directly against project (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars):

```bash
export SUPABASE_URL=https://hnpiduoeyajtpcbwatyq.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<<YOUR_SERVICE_ROLE_KEY>>

supabase sql "$(cat supabase_migrations/001_create_tables.sql)"
supabase sql "$(cat supabase_migrations/002_rls_policies.sql)"
```

Notes:
- For production, do NOT use service role key in client-side code. Use it only for server-side migration scripts.
- Disabling RLS is only for quick testing. Create appropriate policies before production.

If you want, paste your Supabase `service_role` key here temporarily and I can run the migrations from this environment (I'll remove it after): otherwise run the SQL using the dashboard or CLI.
