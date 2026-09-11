-- Additive: safe to deploy while the legacy site still runs.
BEGIN;
CREATE TABLE public.issued_questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 service text NOT NULL CHECK (length(service) BETWEEN 1 AND 80),
 certification text NOT NULL CHECK (certification IN ('DVA-C02','SAA-C03')),
 question_id text NOT NULL CHECK (length(question_id) BETWEEN 1 AND 200),
 question_hash text NOT NULL CHECK (question_hash ~ '^[a-f0-9]{32}$'),
 question_text text NOT NULL CHECK (length(question_text) BETWEEN 1 AND 16000),
 correct_answer text NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
 explanation jsonb NOT NULL CHECK (jsonb_typeof(explanation)='object'),
 exam_tip text NOT NULL DEFAULT '',
 topic text,
 created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);
CREATE INDEX issued_questions_user_idx ON public.issued_questions(user_id,created_at);
ALTER TABLE public.issued_questions ENABLE ROW LEVEL SECURITY;
-- No client policies: even a learner cannot inspect the answer before submitting.
REVOKE ALL ON public.issued_questions FROM PUBLIC,anon,authenticated;
GRANT SELECT, INSERT ON public.issued_questions TO service_role;

CREATE FUNCTION public.submit_issued_answer(p_issuance_id uuid,p_user_answer text,p_time_taken_seconds integer DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,pg_temp AS $$
DECLARE u uuid := auth.uid(); issued public.issued_questions%ROWTYPE; result jsonb;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='42501'; END IF;
 IF p_user_answer IS NULL OR upper(p_user_answer) NOT IN ('A','B','C','D')
 OR (p_time_taken_seconds IS NOT NULL AND p_time_taken_seconds NOT BETWEEN 0 AND 86400)
 THEN RAISE EXCEPTION 'Invalid answer parameters' USING ERRCODE='22023'; END IF;
 SELECT * INTO issued FROM public.issued_questions WHERE id=p_issuance_id AND user_id=u;
 IF NOT FOUND THEN RAISE EXCEPTION 'Question not issued to this user' USING ERRCODE='P0002'; END IF;
 -- Match the atomic saver lock so expiry checks and retries observe committed history.
 PERFORM pg_advisory_xact_lock(hashtextextended(u::text,0));
 IF issued.expires_at < now() AND NOT EXISTS (
  SELECT 1 FROM public.user_question_history WHERE user_id=u AND service=issued.service
  AND certification=issued.certification AND (question_id=issued.question_id OR question_hash=issued.question_hash)
 ) THEN RAISE EXCEPTION 'Issued question expired' USING ERRCODE='22023'; END IF;
 result := public.save_question_answer(issued.service,issued.certification,issued.question_id,
  issued.question_hash,issued.question_text,issued.correct_answer,upper(p_user_answer),issued.topic,p_time_taken_seconds);
 RETURN result || jsonb_build_object('explanation',issued.explanation,'examTip',issued.exam_tip);
END $$;
REVOKE ALL ON FUNCTION public.submit_issued_answer(uuid,text,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.submit_issued_answer(uuid,text,integer) TO authenticated;
COMMIT;
