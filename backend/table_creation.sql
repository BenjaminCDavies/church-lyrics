-- Songs table
create table songs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text,
  lyrics text not null,
  created_at timestamp default now()
);

-- Weekly setlists table
create table weekly_setlists (
  id uuid default gen_random_uuid() primary key,
  name text not null,              -- e.g. "Sunday 20 April 2025"
  service_date date not null,
  is_active boolean default false, -- only one active at a time
  created_at timestamp default now()
);

-- Join table: which songs are in which setlist (and in what order)
create table setlist_songs (
  id uuid default gen_random_uuid() primary key,
  setlist_id uuid references weekly_setlists(id) on delete cascade,
  song_id uuid references songs(id) on delete cascade,
  position integer not null        -- song order in the setlist
);

-- Allow public read access (users don't need to log in)
alter table songs enable row level security;
alter table weekly_setlists enable row level security;
alter table setlist_songs enable row level security;

create policy "Public read songs" on songs for select using (true);
create policy "Public read setlists" on weekly_setlists for select using (true);
create policy "Public read setlist_songs" on setlist_songs for select using (true);