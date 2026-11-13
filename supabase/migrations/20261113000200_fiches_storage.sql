insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fiches',
  'fiches',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fiches_select_own_folder" on storage.objects;
create policy "fiches_select_own_folder"
on storage.objects for select to authenticated
using (bucket_id = 'fiches' and (storage.foldername(name))[1] = auth.uid()::text);


drop policy if exists "fiches_insert_own_folder" on storage.objects;
create policy "fiches_insert_own_folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'fiches' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "fiches_delete_own_folder" on storage.objects;
create policy "fiches_delete_own_folder"
on storage.objects for delete to authenticated
using (bucket_id = 'fiches' and (storage.foldername(name))[1] = auth.uid()::text);