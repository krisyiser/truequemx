-- MIGRATION: 20240401000000_init_truequemx.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  username text unique,
  full_name text,
  avatar_url text,
  city text default 'Poza Rica',
  trust_points int default 10,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Table: items
create table if not exists items (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text check (category in ('Hogar', 'Herramientas', 'Ropa', 'Servicios', 'Otros')),
  looking_for text,
  image_url text,
  status text default 'active' check (status in ('active', 'swapped')),
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table items enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Policies for items
create policy "Items are viewable by everyone" on items
  for select using (true);

create policy "Users can insert their own items" on items
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own items" on items
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own items" on items
  for delete using (auth.uid() = owner_id);

-- Simple trigger for updated_at on profiles
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on profiles
  for each row execute procedure handle_updated_at();
