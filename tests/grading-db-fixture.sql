-- Disposable local database only. Mirrors relevant live columns, not a full Supabase installation.
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE ROLE service_role BYPASSRLS;
CREATE SCHEMA auth;
CREATE TABLE auth.users(id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
GRANT USAGE ON SCHEMA auth, public TO anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO PUBLIC;
CREATE TABLE public.user_question_history (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid REFERENCES auth.users(id),service text NOT NULL,
 topic text,question_hash text NOT NULL,question_text text NOT NULL,correct_answer text NOT NULL,
 user_answer text,answered_correctly boolean,time_taken_seconds integer,created_at timestamptz DEFAULT now(),
 question_id text,certification text DEFAULT 'DVA-C02',
 CONSTRAINT user_question_history_user_id_question_hash_key UNIQUE(user_id,question_hash)
);
CREATE TABLE public.user_progress (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid REFERENCES auth.users(id),service text NOT NULL,
 questions_attempted integer DEFAULT 0,questions_correct integer DEFAULT 0,last_practiced_at timestamptz,
 created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now(),certification text DEFAULT 'DVA-C02',
 CONSTRAINT user_progress_user_id_service_key UNIQUE(user_id,service)
);
ALTER TABLE public.user_question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_history ON public.user_question_history TO authenticated USING (user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
CREATE POLICY own_progress ON public.user_progress TO authenticated USING (user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
GRANT ALL ON public.user_question_history,public.user_progress TO authenticated,service_role;
INSERT INTO auth.users(id) VALUES('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');
