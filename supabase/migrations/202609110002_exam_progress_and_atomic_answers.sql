BEGIN;
LOCK TABLE public.user_question_history, public.user_progress IN ACCESS EXCLUSIVE MODE;
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM public.user_question_history WHERE user_id IS NULL OR certification IS NULL OR answered_correctly IS NULL) THEN
  RAISE EXCEPTION 'History requires manual reconciliation';
 END IF;
END $$;
ALTER TABLE public.user_progress DROP CONSTRAINT user_progress_user_id_service_key;
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_user_exam_service_key UNIQUE (user_id, certification, service);
ALTER TABLE public.user_question_history DROP CONSTRAINT user_question_history_user_id_question_hash_key;
ALTER TABLE public.user_question_history ADD CONSTRAINT history_user_exam_service_hash_key UNIQUE (user_id, certification, service, question_hash);
CREATE UNIQUE INDEX history_user_exam_service_question_key ON public.user_question_history (user_id, certification, service, question_id) WHERE question_id IS NOT NULL;
-- Reconcile the old counters from retained answer records, without deleting history.
UPDATE public.user_progress SET questions_attempted=0, questions_correct=0, last_practiced_at=NULL, updated_at=now();
INSERT INTO public.user_progress (user_id,certification,service,questions_attempted,questions_correct,last_practiced_at)
SELECT user_id,certification,service,count(*)::integer,count(*) FILTER (WHERE answered_correctly)::integer,max(created_at)
FROM public.user_question_history GROUP BY user_id,certification,service
ON CONFLICT (user_id,certification,service) DO UPDATE SET
 questions_attempted=excluded.questions_attempted, questions_correct=excluded.questions_correct,
 last_practiced_at=excluded.last_practiced_at, updated_at=now();
-- Keep the currently hosted app compatible until cutover.
CREATE OR REPLACE FUNCTION public.increment_progress(p_user_id uuid,p_service text,p_certification text DEFAULT 'DVA-C02',p_correct boolean DEFAULT false)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,pg_temp AS $$
BEGIN
 IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM p_user_id THEN
  RAISE EXCEPTION 'Not authorized to update this user' USING ERRCODE='42501';
 END IF;
 INSERT INTO public.user_progress(user_id,certification,service,questions_attempted,questions_correct,last_practiced_at)
 VALUES(p_user_id,p_certification,p_service,1,CASE WHEN p_correct THEN 1 ELSE 0 END,now())
 ON CONFLICT(user_id,certification,service) DO UPDATE SET
 questions_attempted=user_progress.questions_attempted+1,
 questions_correct=user_progress.questions_correct+CASE WHEN p_correct THEN 1 ELSE 0 END,
 last_practiced_at=now(),updated_at=now();
END $$;
CREATE OR REPLACE FUNCTION public.increment_progress(p_user_id uuid,p_service text,p_correct boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,pg_temp AS $$
BEGIN
 PERFORM public.increment_progress(p_user_id,p_service,'DVA-C02',p_correct);
END $$;
-- This transaction fixes persistence; trusted question issuance/grading is a separate step.
CREATE FUNCTION public.save_question_answer(p_service text,p_certification text,p_question_id text,p_question_hash text,p_question_text text,p_correct_answer text,p_user_answer text,p_topic text DEFAULT NULL,p_time_taken_seconds integer DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,pg_temp AS $$
DECLARE
 u uuid := auth.uid(); saved public.user_question_history%ROWTYPE; inserted boolean;
 totals jsonb;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='42501'; END IF;
 IF p_certification IS NULL OR p_certification NOT IN ('DVA-C02','SAA-C03')
 OR p_service IS NULL OR length(p_service) NOT BETWEEN 1 AND 80
 OR p_question_id IS NULL OR length(p_question_id) NOT BETWEEN 1 AND 200
 OR p_question_hash IS NULL OR p_question_hash !~ '^[a-f0-9]{32}$'
 OR p_question_text IS NULL OR length(p_question_text) NOT BETWEEN 1 AND 16000
 OR p_correct_answer IS NULL OR upper(p_correct_answer) NOT IN ('A','B','C','D')
 OR p_user_answer IS NULL OR upper(p_user_answer) NOT IN ('A','B','C','D')
 OR (p_time_taken_seconds IS NOT NULL AND p_time_taken_seconds NOT BETWEEN 0 AND 86400)
 THEN RAISE EXCEPTION 'Invalid answer parameters' USING ERRCODE='22023'; END IF;
 -- Serialize saves for the same learner, including simultaneous retries.
 PERFORM pg_advisory_xact_lock(hashtextextended(u::text,0));
 INSERT INTO public.user_question_history(user_id,service,certification,question_id,question_hash,question_text,correct_answer,user_answer,answered_correctly,topic,time_taken_seconds)
 VALUES(u,p_service,p_certification,p_question_id,p_question_hash,p_question_text,upper(p_correct_answer),upper(p_user_answer),upper(p_correct_answer)=upper(p_user_answer),p_topic,p_time_taken_seconds)
 ON CONFLICT DO NOTHING RETURNING * INTO saved;
 inserted := FOUND;
 IF inserted THEN
  INSERT INTO public.user_progress(user_id,certification,service,questions_attempted,questions_correct,last_practiced_at)
  VALUES(u,p_certification,p_service,1,CASE WHEN saved.answered_correctly THEN 1 ELSE 0 END,now())
  ON CONFLICT(user_id,certification,service) DO UPDATE SET
  questions_attempted=user_progress.questions_attempted+1,
  questions_correct=user_progress.questions_correct+CASE WHEN saved.answered_correctly THEN 1 ELSE 0 END,
  last_practiced_at=now(),updated_at=now();
 ELSE
  SELECT * INTO STRICT saved FROM public.user_question_history
  WHERE user_id=u AND certification=p_certification AND service=p_service
  AND (question_hash=p_question_hash OR question_id=p_question_id);
 END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object('service',service,'attempted',questions_attempted,'correct',questions_correct)),'[]'::jsonb)
 INTO totals FROM public.user_progress WHERE user_id=u AND certification=p_certification;
 RETURN jsonb_build_object('success',true,'alreadyAnswered',NOT inserted,'answeredCorrectly',saved.answered_correctly,
 'userAnswer',saved.user_answer,'correctAnswer',saved.correct_answer,'questionHash',saved.question_hash,'serviceProgress',totals);
END $$;
REVOKE ALL ON FUNCTION public.save_question_answer(text,text,text,text,text,text,text,text,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.save_question_answer(text,text,text,text,text,text,text,text,integer) TO authenticated;
COMMIT;
