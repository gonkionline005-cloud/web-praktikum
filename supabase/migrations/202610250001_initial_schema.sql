create table public.genres (
  id text primary key,
  name text not null unique,
  constraint genres_id_not_blank
    check (id = btrim(id) and id <> ''),
  constraint genres_name_not_blank
    check (name = btrim(name) and name <> '')
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  genre_id text not null references public.genres(id)
    on update cascade on delete restrict,
  title text not null,
  author text not null,
  status text not null,
  rating smallint,
  note text not null default '',
  created_at timestamptz not null default now(),
  constraint books_title_length
    check (char_length(btrim(title)) between 3 and 100),
  constraint books_author_not_blank
    check (btrim(author) <> ''),
  constraint books_status_allowed
    check (status in ('want', 'reading', 'done')),
  constraint books_rating_range
    check (rating is null or rating between 1 and 5)
);

alter table public.genres enable row level security;
alter table public.books enable row level security;

revoke all on table public.genres from anon, authenticated;
revoke all on table public.books from anon, authenticated;

grant select on table public.genres to anon, authenticated;

create policy "genres are publicly readable"
on public.genres
for select
to anon, authenticated
using (true);