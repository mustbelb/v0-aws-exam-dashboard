-- Run against a test database or during maintenance; all test changes roll back.
BEGIN;
DO $$ DECLARE u uuid; r jsonb; before_rows integer; a integer; b integer;
BEGIN
 SELECT id INTO u FROM auth.users LIMIT 1;
 IF u IS NULL THEN RAISE EXCEPTION 'Missing test account'; END IF;
 PERFORM set_config('request.jwt.claim.sub',u::text,true);
 SELECT count(*) INTO before_rows FROM public.user_question_history;
 r:=public.save_question_answer('migration-test','DVA-C02','test-id',md5('migration-test'),'fixture','A','B',NULL,0);
 IF r->>'alreadyAnswered'<>'false' OR r->>'answeredCorrectly'<>'false' THEN RAISE EXCEPTION 'Initial save failed'; END IF;
 r:=public.save_question_answer('migration-test','DVA-C02','test-id',md5('migration-test'),'fixture','A','A',NULL,3);
 IF r->>'alreadyAnswered'<>'true' OR r->>'userAnswer'<>'B' OR r->>'answeredCorrectly'<>'false' THEN RAISE EXCEPTION 'Retry changed original answer'; END IF;
 r:=public.save_question_answer('migration-test','SAA-C03','test-id',md5('migration-test'),'fixture','A','A',NULL,3);
 SELECT questions_attempted INTO a FROM public.user_progress WHERE user_id=u AND service='migration-test' AND certification='DVA-C02';
 SELECT questions_attempted INTO b FROM public.user_progress WHERE user_id=u AND service='migration-test' AND certification='SAA-C03';
 IF a<>1 OR b<>1 OR (SELECT count(*) FROM public.user_question_history)<>before_rows+2 THEN RAISE EXCEPTION 'Exam isolation failed'; END IF;
 PERFORM public.increment_progress(u,'migration-legacy','SAA-C03',true);
 PERFORM public.increment_progress(u,'migration-legacy',false);
 IF (SELECT count(*) FROM public.user_progress WHERE user_id=u AND service='migration-legacy')<>2 THEN RAISE EXCEPTION 'Legacy exam isolation failed'; END IF;
END $$;
CREATE FUNCTION pg_temp.reject_test_progress() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.service='migration-failure' THEN RAISE EXCEPTION 'Simulated progress failure' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER migration_failure BEFORE INSERT OR UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION pg_temp.reject_test_progress();
DO $$ BEGIN
 BEGIN
 PERFORM public.save_question_answer('migration-failure','DVA-C02','failure-id',md5('failure'),'fixture','A','A',NULL,1);
 RAISE EXCEPTION 'Expected failure missing';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
 IF EXISTS(SELECT 1 FROM public.user_question_history WHERE service='migration-failure') THEN RAISE EXCEPTION 'Partial answer persisted'; END IF;
END $$;
ROLLBACK;
