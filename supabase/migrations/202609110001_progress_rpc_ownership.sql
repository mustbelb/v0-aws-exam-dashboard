-- Preserve both legacy RPC signatures while enforcing ownership.
-- Exam-specific uniqueness and transactional grading are separate migrations.
BEGIN;
CREATE OR REPLACE FUNCTION public.increment_progress(
  p_user_id uuid, p_service text,
  p_certification text DEFAULT 'DVA-C02', p_correct boolean DEFAULT false
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Not authorized to update this user' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.user_progress
    (user_id, certification, service, questions_attempted, questions_correct, last_practiced_at)
  VALUES (p_user_id, p_certification, p_service, 1, CASE WHEN p_correct THEN 1 ELSE 0 END, NOW())
  ON CONFLICT (user_id, service) DO UPDATE SET
    questions_attempted = user_progress.questions_attempted + 1,
    questions_correct = user_progress.questions_correct + CASE WHEN p_correct THEN 1 ELSE 0 END,
    certification = p_certification, last_practiced_at = NOW(), updated_at = NOW();
END;
$$;
CREATE OR REPLACE FUNCTION public.increment_progress(
  p_user_id uuid, p_service text, p_correct boolean
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Not authorized to update this user' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.user_progress
    (user_id, service, questions_attempted, questions_correct, last_practiced_at)
  VALUES (p_user_id, p_service, 1, CASE WHEN p_correct THEN 1 ELSE 0 END, NOW())
  ON CONFLICT (user_id, service) DO UPDATE SET
    questions_attempted = user_progress.questions_attempted + 1,
    questions_correct = user_progress.questions_correct + CASE WHEN p_correct THEN 1 ELSE 0 END,
    last_practiced_at = NOW(), updated_at = NOW();
END;
$$;
REVOKE ALL ON FUNCTION public.increment_progress(uuid,text,text,boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.increment_progress(uuid,text,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_progress(uuid,text,text,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_progress(uuid,text,boolean) TO authenticated;
COMMIT;
