-- Run ONLY after the updated application is deployed and authenticated saves pass.
-- This intentionally disables saving from the old Vercel client.
-- Keep outside automatic migrations until cutover is authorized and coordinated.
BEGIN;
SET LOCAL lock_timeout = '3s';
REVOKE INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER ON public.user_question_history,public.user_progress FROM PUBLIC,anon,authenticated;
-- PostgreSQL 17+ also grants table maintenance separately from ordinary writes.
DO $$ BEGIN
 IF current_setting('server_version_num')::integer >= 170000 THEN
  EXECUTE 'REVOKE MAINTAIN ON public.user_question_history,public.user_progress FROM PUBLIC,anon,authenticated';
 END IF;
END $$;
REVOKE ALL ON FUNCTION public.save_question_answer(text,text,text,text,text,text,text,text,integer) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.increment_progress(uuid,text,text,boolean) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.increment_progress(uuid,text,boolean) FROM PUBLIC,anon,authenticated;
-- The SECURITY DEFINER submit_issued_answer function retains internal execution.
DO $$
DECLARE role_name text; table_name text; signature text;
BEGIN
 FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
  FOREACH table_name IN ARRAY ARRAY['public.user_question_history','public.user_progress'] LOOP
   IF has_table_privilege(role_name,table_name,'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
      OR has_any_column_privilege(role_name,table_name,'INSERT,UPDATE,REFERENCES') THEN
    RAISE EXCEPTION 'Client write privileges remain for % on %',role_name,table_name;
   END IF;
   IF current_setting('server_version_num')::integer >= 170000 THEN
    IF has_table_privilege(role_name,table_name,'MAINTAIN') THEN
     RAISE EXCEPTION 'Client maintenance privileges remain';
    END IF;
   END IF;
  END LOOP;
  FOREACH signature IN ARRAY ARRAY[
   'public.save_question_answer(text,text,text,text,text,text,text,text,integer)',
   'public.increment_progress(uuid,text,text,boolean)',
   'public.increment_progress(uuid,text,boolean)'] LOOP
   IF has_function_privilege(role_name,signature,'EXECUTE') THEN
    RAISE EXCEPTION 'Legacy execution remains for % on %',role_name,signature;
   END IF;
  END LOOP;
 END LOOP;
 IF NOT has_function_privilege('authenticated','public.submit_issued_answer(uuid,text,integer)','EXECUTE')
    OR has_function_privilege('anon','public.submit_issued_answer(uuid,text,integer)','EXECUTE')
    OR NOT has_table_privilege('authenticated','public.user_progress','SELECT')
    OR NOT has_table_privilege('authenticated','public.user_question_history','SELECT')
    OR NOT has_table_privilege('service_role','public.issued_questions','INSERT')
    OR NOT has_table_privilege('service_role','public.issued_questions','SELECT') THEN
  RAISE EXCEPTION 'Required access did not survive cutover';
 END IF;
END $$;
COMMIT;
