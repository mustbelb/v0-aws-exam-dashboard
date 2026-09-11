\set ON_ERROR_STOP on
BEGIN;
INSERT INTO public.issued_questions(id,user_id,service,certification,question_id,question_hash,question_text,correct_answer,explanation,exam_tip)
VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','lambda','DVA-C02','fixture',md5('fixture'),'fixture','B','{"correct":"B is trusted"}','tip'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','11111111-1111-4111-8111-111111111111','lambda','SAA-C03','fixture',md5('fixture'),'fixture','B','{"correct":"B is trusted"}','tip'),
 ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','11111111-1111-4111-8111-111111111111','failure','DVA-C02','failure',md5('failure'),'failure','A','{"correct":"A"}','tip'),
 ('dddddddd-dddd-4ddd-8ddd-dddddddddddd','11111111-1111-4111-8111-111111111111','lambda','DVA-C02','expired',md5('expired'),'expired','A','{"correct":"A"}','tip');
UPDATE public.issued_questions SET expires_at=now()-interval '1 day' WHERE question_id='expired';
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
DO $$ DECLARE r jsonb; BEGIN
 r:=public.submit_issued_answer('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','A',10);
 IF r->>'answeredCorrectly'<>'false' OR r->>'correctAnswer'<>'B' OR r->'explanation'->>'correct'<>'B is trusted' THEN RAISE EXCEPTION 'Trusted grading failed'; END IF;
 r:=public.submit_issued_answer('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','B',11);
 IF r->>'alreadyAnswered'<>'true' OR r->>'userAnswer'<>'A' OR r->>'answeredCorrectly'<>'false' THEN RAISE EXCEPTION 'Retry changed result'; END IF;
 r:=public.submit_issued_answer('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','B',1);
 IF r->>'answeredCorrectly'<>'true' THEN RAISE EXCEPTION 'Exam separation failed'; END IF;
 IF (SELECT count(*) FROM public.user_progress WHERE user_id=auth.uid() AND service='lambda')<>2 THEN RAISE EXCEPTION 'Exam totals mixed'; END IF;
 BEGIN
  PERFORM public.submit_issued_answer('dddddddd-dddd-4ddd-8ddd-dddddddddddd','A',0);
  RAISE EXCEPTION 'Expired question accepted';
 EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 BEGIN
  PERFORM public.submit_issued_answer('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Z',0);
  RAISE EXCEPTION 'Invalid answer accepted';
 EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 BEGIN
  PERFORM * FROM public.issued_questions;
  RAISE EXCEPTION 'Private answer keys readable';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  INSERT INTO public.user_progress(user_id,service) VALUES(auth.uid(),'forged');
  RAISE EXCEPTION 'Direct progress write allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE public.user_question_history SET answered_correctly=true;
  RAISE EXCEPTION 'Direct history update allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM public.increment_progress(auth.uid(),'forged',true);
  RAISE EXCEPTION 'Legacy RPC accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM public.save_question_answer('forged','DVA-C02','forged',md5('forged'),'forged','A','A',NULL,0);
  RAISE EXCEPTION 'Client-key RPC accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
DO $$ BEGIN
 BEGIN
  PERFORM public.submit_issued_answer('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','B',0);
  RAISE EXCEPTION 'Cross-user submission accepted';
 EXCEPTION WHEN no_data_found THEN NULL; END;
 IF (SELECT count(*) FROM public.user_question_history)<>0 THEN RAISE EXCEPTION 'Cross-user history readable'; END IF;
END $$;
RESET ROLE;
UPDATE public.issued_questions SET expires_at=now()-interval '1 day' WHERE question_id='fixture';
SELECT set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
SET LOCAL ROLE authenticated;
DO $$ DECLARE r jsonb; BEGIN
 r:=public.submit_issued_answer('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','B',10);
 IF r->>'userAnswer'<>'A' THEN RAISE EXCEPTION 'Expired retry lost original result'; END IF;
END $$;
RESET ROLE;
CREATE FUNCTION pg_temp.reject_progress() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN IF NEW.service='failure' THEN RAISE EXCEPTION 'Simulated failure' USING ERRCODE='23514'; END IF; RETURN NEW; END $$;
CREATE TRIGGER test_progress_failure BEFORE INSERT OR UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION pg_temp.reject_progress();
SET LOCAL ROLE authenticated;
DO $$ BEGIN
 BEGIN
  PERFORM public.submit_issued_answer('cccccccc-cccc-4ccc-8ccc-cccccccccccc','A',1);
  RAISE EXCEPTION 'Progress failure ignored';
 EXCEPTION WHEN check_violation THEN NULL; END;
 IF EXISTS(SELECT 1 FROM public.user_question_history WHERE service='failure') THEN RAISE EXCEPTION 'Partial history retained'; END IF;
END $$;
RESET ROLE;
SET LOCAL ROLE anon;
DO $$ BEGIN
 BEGIN
  PERFORM public.submit_issued_answer('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','A',0);
  RAISE EXCEPTION 'Anonymous execution accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
ROLLBACK;
SELECT 'PASS: grading, feedback, retries, expiry, exam separation, user isolation, private keys, lockdown and atomic rollback' AS result;
