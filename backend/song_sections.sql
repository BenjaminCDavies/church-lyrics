create table public.song_sections (
  id uuid not null default gen_random_uuid (),
  song_id uuid not null,
  type text not null default 'verse'::text,
  label text not null default 'Verse 1'::text,
  content text not null default ''::text,
  position integer not null default 1,
  created_at timestamp with time zone null default now(),
  constraint song_sections_pkey primary key (id),
  constraint song_sections_song_id_fkey foreign KEY (song_id) references songs (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists song_sections_song_id_position_idx on public.song_sections using btree (song_id, "position") TABLESPACE pg_default;