-- Par Value schema v10 — lock Pierogi Open scores to their creator (anonymous auth)

alter table public.pierogi_scores
  add column if not exists created_by uuid not null default auth.uid() references auth.users(id) on delete cascade;

drop policy if exists "Anyone can post a pierogi score" on public.pierogi_scores;
drop policy if exists "Anyone can correct a pierogi hole score" on public.pierogi_scores;

create policy "Signed-in users can post their own pierogi score"
  on public.pierogi_scores
  for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "Signed-in users can update their own pierogi score"
  on public.pierogi_scores
  for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "Signed-in users can delete their own pierogi score"
  on public.pierogi_scores
  for delete
  to authenticated
  using (created_by = auth.uid());
