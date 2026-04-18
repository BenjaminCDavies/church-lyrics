create table public.weekly_setlists (
  id uuid not null default gen_random_uuid (),
  name text not null,
  service_date date not null,
  is_active boolean null default false,
  created_at timestamp without time zone null default now(),
  constraint weekly_setlists_pkey primary key (id)
) TABLESPACE pg_default;