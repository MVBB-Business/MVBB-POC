-- Initial schema, modeled on the entities in mvbb-app.jsx's in-memory state
-- (grades, orders, users, drivers, khata entries, negotiations, shipments,
-- expenses). Replaces the prototype's single shared JSON blob
-- (window.storage key 'mv4_shared') with real tables + RLS.
--
-- This is a Phase 1 parity schema: enough structure to hold what the
-- prototype already demonstrates. Phase 2 items (batch/lot tracking with
-- expiry, unit conversion) and Phase 3 items (GST/tax ledger) are deferred
-- per MVBB-Roadmap.docx and should be added as later migrations, not bolted
-- on here.

create extension if not exists "pgcrypto";

create type account_type as enum ('B2B', 'B2C');
create type order_status as enum ('Packed', 'Out for delivery', 'Delivered', 'Cancelled');
create type vehicle_type as enum ('bike', 'auto', 'mini_truck', 'truck');
create type driver_status as enum ('offline', 'available', 'on_delivery', 'deactivated');
create type khata_entry_type as enum ('sale', 'payment');

create table users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  account_type account_type not null default 'B2C',
  business_name text,
  is_hawker boolean not null default false,
  credit_balance numeric not null default 0,
  credit_limit numeric not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table grades (
  id text primary key,
  category text not null,
  label text not null,
  tagline text,
  description text,
  bag_weight_kg numeric not null default 30,
  cost_per_bag numeric not null default 0,
  stock_bags integer not null default 0,
  low_stock_threshold integer not null default 20,
  tiers jsonb not null default '[]', -- [{ min, price }]
  created_at timestamptz not null default now()
);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  grade_id text not null references grades(id),
  type text not null check (type in ('in', 'out')),
  bags integer not null,
  source text,
  order_id text,
  created_at timestamptz not null default now()
);

create table drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique not null,
  vehicle vehicle_type not null,
  plate text,
  status driver_status not null default 'offline',
  created_at timestamptz not null default now()
);

create table orders (
  id text primary key, -- e.g. MVBB########
  invoice_no text unique not null,
  customer_id uuid references users(id),
  customer_name text,
  customer_phone text,
  customer_account_type account_type not null default 'B2C',
  status order_status not null default 'Packed',
  order_source text not null default 'app', -- 'app' | 'admin'
  items jsonb not null default '[]', -- [{ gradeId, name, qty, unit, lineTotal, negotiated }]
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  delivery_fee numeric not null default 0,
  total numeric not null default 0,
  address jsonb,
  pickup_in_store boolean not null default false,
  delivery_slot text,
  payment_method text,
  is_credit_sale boolean not null default false,
  payment_approved boolean not null default false,
  amount_paid numeric not null default 0,
  vehicle_type vehicle_type,
  total_bags integer not null default 0,
  assigned_driver_id uuid references drivers(id),
  assigned_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  eta timestamptz,
  payout numeric,
  payout_settled boolean not null default false,
  payout_settled_at timestamptz,
  cancel_reason text,
  placed_at timestamptz not null default now()
);

create table payment_records (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references orders(id),
  amount numeric not null,
  method text,
  note text,
  recorded_by text,
  recorded_at timestamptz not null default now()
);

create table khata_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  order_id text references orders(id),
  type khata_entry_type not null,
  amount numeric not null,
  note text,
  created_at timestamptz not null default now()
);

create table negotiations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references users(id),
  grade_id text references grades(id),
  status text not null default 'open',
  messages jsonb not null default '[]',
  quoted_price numeric,
  created_at timestamptz not null default now()
);

create table shipments (
  id uuid primary key default gen_random_uuid(),
  grade_id text references grades(id),
  bags integer not null,
  cost_per_bag numeric,
  received_at timestamptz,
  created_at timestamptz not null default now()
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  amount numeric not null,
  description text,
  related_id text,
  created_at timestamptz not null default now()
);

-- Row-level security: enabled everywhere. Policies are intentionally not
-- defined yet — Phase 1 scaffolding should wire these up alongside real
-- Supabase auth (roles: customer, driver, admin sub-roles per
-- ROLE_OPTIONS in the prototype) rather than ship permissive defaults.
alter table users enable row level security;
alter table grades enable row level security;
alter table stock_movements enable row level security;
alter table drivers enable row level security;
alter table orders enable row level security;
alter table payment_records enable row level security;
alter table khata_entries enable row level security;
alter table negotiations enable row level security;
alter table shipments enable row level security;
alter table expenses enable row level security;
