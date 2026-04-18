create table public.songs (
  id uuid not null default gen_random_uuid (),
  title text not null,
  artist text null,
  created_at timestamp without time zone null default now(),
  constraint songs_pkey primary key (id)
) TABLESPACE pg_default;