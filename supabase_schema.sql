-- Add user_id to tasks table
alter table public.tasks 
add column user_id uuid references auth.users not null default auth.uid();

-- Update RLS policies
drop policy "Enable all access for all users" on public.tasks;

create policy "Users can view their own tasks" on public.tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks" on public.tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks" on public.tasks
  for delete using (auth.uid() = user_id);
