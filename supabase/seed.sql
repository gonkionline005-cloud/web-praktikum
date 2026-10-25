insert into public.genres (id, name)
values
  ('novel', 'Роман'),
  ('dystopia', 'Антиутопия'),
  ('fantasy', 'Фэнтези'),
  ('philosophical', 'Философский роман'),
  ('detective', 'Детектив'),
  ('classic', 'Классика')
on conflict (id) do update
set name = excluded.name;