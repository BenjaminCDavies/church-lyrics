create table public.setlist_songs (
  id uuid not null default gen_random_uuid (),
  setlist_id uuid null,
  song_id uuid null,
  position integer not null,
  constraint setlist_songs_pkey primary key (id),
  constraint setlist_songs_setlist_id_fkey foreign KEY (setlist_id) references weekly_setlists (id) on delete CASCADE,
  constraint setlist_songs_song_id_fkey foreign KEY (song_id) references songs (id) on delete CASCADE
) TABLESPACE pg_default;