# Supabase Setup Guide

## Database Setup

### 1. Create Profiles Table

Go to the **SQL Editor** in your Supabase dashboard and run the following query:

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  name text
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Function to automatically set updated_at on row update
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update the updated_at column
create trigger set_updated_at
  before update on profiles
  for each row execute procedure public.handle_updated_at();

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Authentication Setup

### 2. Configure URL Settings

Go to the **Authentication** tab → **URL Configuration** in your Supabase dashboard.

1. **Set the Site URL:**

   ```
   juno://
   ```

2. **Add the following redirect URLs:**
   ```
   juno://
   juno://*
   juno-dev://
   juno-dev://*
   localhost:8081
   localhost:8081/*
   http://localhost:8081
   http://localhost:8081/*
   ```

---

## Local Development with Mailpit

Supabase CLI automatically captures emails locally using Mailpit — no real emails are sent.

### Prerequisites

- Docker Desktop running
- Supabase CLI installed
- Mailpit installed

### Setup

1. Create a `.env.local` file in the project root (overrides `.env` automatically in Expo):

   ```
   EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<publishable key from supabase status>
   ```

2. Start local Supabase:

   ```
   supabase start
   ```

3. Open **http://127.0.0.1:54324** to view captured emails (confirmations, magic links, password resets, etc.)
   Open **http://127.0.0.1:54323** to view the supabase studio
   API / Project URL: **http://127.0.0.1:54321**

4. Run `supabase status` at any time to see all local URLs and keys.

5. When you are finished working on your Supabase project, you can stop the stack (without resetting your local database): `supabase stop`

### Switching back to production

Delete `.env.local` — Expo will fall back to the production values in `.env`.
