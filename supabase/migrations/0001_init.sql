-- EVIA catalog, identity, enrollments, and instructor payouts
create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'instructor', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null default '',
  avatar_url text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.instructors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  avatar_url text,
  bio text not null default '',
  balance numeric(12,2) not null default 0,
  pending_balance numeric(12,2) not null default 0
);

create table if not exists public.courses (
  id text primary key,
  slug text unique not null,
  title text not null,
  subtitle text,
  description text not null default '',
  thumbnail_url text,
  instructor_id uuid references public.instructors(id),
  intro_vimeo_id text,
  intro_vimeo_hash text,
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  duration_hours numeric(6,1) not null default 0,
  student_count integer not null default 0,
  rating numeric(3,2) not null default 0,
  level text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order integer not null default 1
);

create table if not exists public.lessons (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  description text not null default '',
  duration_minutes integer not null default 0,
  vimeo_id text not null,
  vimeo_hash text,
  sort_order integer not null default 1
);

create table if not exists public.quizzes (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  passing_score integer not null default 70
);

create table if not exists public.quiz_questions (
  id text primary key,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_index integer not null
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  granted_by text,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  score integer not null,
  passed boolean not null,
  attempted_at timestamptz not null default now()
);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.instructors(id) on delete cascade,
  amount numeric(12,2) not null,
  settled_at timestamptz not null default now(),
  note text
);

alter table public.profiles enable row level security;
alter table public.instructors enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.payouts enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "public read published courses" on public.courses
  for select using (is_published = true or public.is_admin());

create policy "public read instructors" on public.instructors for select using (true);
create policy "public read modules" on public.modules for select using (true);
create policy "public read lessons metadata" on public.lessons for select using (true);
create policy "public read quizzes" on public.quizzes for select using (true);

create policy "own profile" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "own enrollments" on public.enrollments
  for select using (user_id = auth.uid() or public.is_admin());

create policy "own progress" on public.lesson_progress
  for select using (user_id = auth.uid() or public.is_admin());

create policy "admin write courses" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());
