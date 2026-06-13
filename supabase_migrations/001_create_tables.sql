-- 001_create_tables.sql
-- Run this in Supabase SQL editor or via `supabase sql` CLI

create table if not exists bookings (
  id bigserial primary key,
  customer_name text,
  customer_phone text,
  booking_date date,
  booking_time text,
  total_guests int,
  status text default 'Pending',
  order_status text default 'Pending',
  booking_source text default 'Online',
  table_id int,
  table_number text,
  table_capacity int,
  cuisine_id int,
  dish text,
  created_at timestamptz default now()
);

create table if not exists menus (
  id bigserial primary key,
  name text not null,
  price numeric(10,2) default 0,
  cuisine_id int not null,
  description text,
  image text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists table_locks (
  table_id int primary key,
  locked_by text,
  lock_token text,
  lock_expires_at timestamptz,
  created_at timestamptz default now()
);
