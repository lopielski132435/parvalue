-- Par Value schema v11 — revert Pierogi Open ownership lock, back to open honor-system scoring

drop policy if exists "Signed-in users can post their own pierogi score" on public.pierogi_scores;
drop policy if exists "Signed-in users can update their own pierogi score" on public.pierogi_scores;
drop policy if exists "Signed-in users can delete their own pierogi score" on public.pierogi_scores;

create policy "Anyone can post a pierogi score"
  on public.pierogi_scores
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can correct a pierogi hole score"
  on public.pierogi_scores
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Anyone can delete a pierogi hole score"
  on public.pierogi_scores
  for delete
  to anon, authenticated
  using (true);

alter table public.pierogi_scores drop column if exists created_by;
