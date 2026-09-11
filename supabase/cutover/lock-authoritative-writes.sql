-- Run ONLY after the updated application is deployed and authenticated saves pass.
-- This intentionally disables saving from the old Vercel client.
-- Keep outside automatic migrations until cutover is authorized and coordinated.
BEGIN;
REVOKE INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER ON public.user_question_history,public.user_progress FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.save_question_answer(text,text,text,text,text,text,text,text,integer) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.increment_progress(uuid,text,text,boolean) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.increment_progress(uuid,text,boolean) FROM PUBLIC,anon,authenticated;
-- The SECURITY DEFINER submit_issued_answer function retains internal execution.
COMMIT;
