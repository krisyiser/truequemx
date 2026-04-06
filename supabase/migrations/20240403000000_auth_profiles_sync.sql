-- MIGRATION: 20240403000000_auth_profiles_sync.sql

-- Trigger function to create a profile automatically on signup
create or replace function public.handle_new_user()
returns trigger
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'username', substring(new.email from '(.*)@'))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute after a user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
