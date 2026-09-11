-- Read-only inspection before designing the answer/progress transaction.
-- Run in the project's Supabase SQL editor. Contains no user-row data.
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

select tablename, indexname, indexdef
from pg_indexes where schemaname = 'public'
order by tablename, indexname;

select tablename, policyname, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public'
order by tablename, policyname;

select c.relname as table_name, c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r';

select p.proname, pg_get_functiondef(p.oid) as definition
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prokind = 'f'
and p.proname in ('increment_progress', 'handle_new_user');

select c.relname as table_name, con.conname,
       pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
order by c.relname, con.conname;

select event_object_table, trigger_name, action_timing,
       event_manipulation, action_statement
from information_schema.triggers
where event_object_schema = 'public'
order by event_object_table, trigger_name;
