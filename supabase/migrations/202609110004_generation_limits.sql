BEGIN;
CREATE TABLE public.question_generation_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX question_generation_user_time ON public.question_generation_requests(user_id,created_at);
ALTER TABLE public.question_generation_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.question_generation_requests FROM PUBLIC,anon,authenticated;
CREATE FUNCTION public.reserve_question_generation(p_user_id uuid) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,pg_temp AS $$
BEGIN
 IF p_user_id IS NULL THEN RAISE EXCEPTION 'User required' USING ERRCODE='22023'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('generation:'||p_user_id::text,0));
 IF (SELECT count(*) FROM public.question_generation_requests WHERE user_id=p_user_id AND created_at>now()-interval '1 hour')>=20
 OR (SELECT count(*) FROM public.question_generation_requests WHERE user_id=p_user_id AND created_at>now()-interval '1 minute')>=3
 THEN RETURN false; END IF;
 INSERT INTO public.question_generation_requests(user_id) VALUES(p_user_id);
 RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.reserve_question_generation(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_question_generation(uuid) TO service_role;
COMMIT;
