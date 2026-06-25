-- SmartQuery AI Supabase Database Schema
-- Version 1.0 | PostgreSQL | June 2026

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

---------------------------------------------------------
-- 1. Profiles Table
---------------------------------------------------------
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

---------------------------------------------------------
-- 2. Chats Table
---------------------------------------------------------
create table public.chats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  original_prompt text not null,
  optimized_prompt text not null,
  ai_response text,
  original_tokens int default 0,
  optimized_tokens int default 0,
  tokens_saved int default 0,
  savings_percentage float default 0,
  applied_rules jsonb default '[]'::jsonb,
  removed_phrases jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.chats enable row level security;

-- Policies for Chats
create policy "Users can select their own chats"
  on public.chats for select
  using (auth.uid() = user_id);

create policy "Users can insert their own chats"
  on public.chats for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own chats"
  on public.chats for delete
  using (auth.uid() = user_id);

---------------------------------------------------------
-- 3. Feedback Table
---------------------------------------------------------
create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.feedback enable row level security;

-- Policies for Feedback
create policy "Users can select their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

create policy "Users can insert their own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

---------------------------------------------------------
-- 4. Triggers to automatically create Profile on Signup
---------------------------------------------------------
-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auth.users table
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
