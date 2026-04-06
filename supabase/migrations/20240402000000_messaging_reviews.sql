-- MIGRATION: 20240402000000_messaging_reviews.sql

-- Table: messages
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  item_id uuid references items(id) on delete set null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Table: reviews
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_id uuid references profiles(id) on delete cascade not null,
  reviewed_id uuid references profiles(id) on delete cascade not null,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS)
alter table messages enable row level security;
alter table reviews enable row level security;

-- Policies for messages
create policy "Users can see messages they sent or received" on messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages" on messages
  for insert with check (auth.uid() = sender_id);

-- Policies for reviews
create policy "Reviews are viewable by everyone" on reviews
  for select using (true);

create policy "Users can post reviews for others" on reviews
  for insert with check (auth.uid() = reviewer_id);
