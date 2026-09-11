-- Run after 202609110001_progress_rpc_ownership.sql.
-- Assertions run in a transaction and do not retain progress changes.
BEGIN;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
DO $$ BEGIN
  BEGIN
    PERFORM public.increment_progress('00000000-0000-0000-0000-000000000002'::uuid,'lambda','DVA-C02',true);
    RAISE EXCEPTION 'Ownership test failed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM public.increment_progress('00000000-0000-0000-0000-000000000002'::uuid,'lambda',true);
    RAISE EXCEPTION 'Legacy ownership test failed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $$;
ROLLBACK;
SELECT has_function_privilege('anon','public.increment_progress(uuid,text,text,boolean)','EXECUTE') AS anon_new,
       has_function_privilege('anon','public.increment_progress(uuid,text,boolean)','EXECUTE') AS anon_legacy,
       has_function_privilege('authenticated','public.increment_progress(uuid,text,text,boolean)','EXECUTE') AS authenticated_allowed;
