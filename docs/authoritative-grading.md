# Trusted question issuance and grading

The updated app issues a private database record for each question. The browser receives its UUID, question text, options, and optional topic. Answer keys, explanations, and exam tips stay private until submission. `POST /api/question/submit` accepts only `issuanceId`, `userAnswer`, and optional `timeTakenSeconds`; client-provided grading or service/exam fields are rejected.

`submit_issued_answer` looks up the record using the authenticated database identity, grades from its stored answer, and calls the existing atomic saver internally. First submissions expire after 24 hours. Retries of saved questions return their original answer even after expiry. Existing certification/service/hash and ID uniqueness continue to prevent duplicate increments. Answer keys in old saved history are unchanged.

## Applied versus pending

- Migration `202609110003_issued_questions.sql` was applied to `rbquwmbthcuvxmowtwej` on September 11, 2026, after rollback-only verification against its live schema. It creates the private table and authenticated submit function. Learners cannot SELECT or INSERT private issuance records. Counts remained 159 saved answers and 24 progress rows.
- The updated application is local only. Its server needs `SUPABASE_SECRET_KEY` in ignored `.env.local` or the hosting server environment. This can hold a Supabase secret key or the existing legacy service-role key; never use a `NEXT_PUBLIC_` variable. After explicit user approval, the existing service-role key was stored in ignored `.env.local` with 0600 permissions. Live read-only API checks returned HTTP 200; no credential value was logged.
- `supabase/cutover/lock-authoritative-writes.sql` is tested but NOT applied live. It removes direct history/progress writes and execution of both increment functions and the client-key saver. The SECURITY DEFINER issued-answer function still calls the saver internally.
- The old Vercel application remains functional. Consequently, legacy client-trusted write paths remain a live security limitation until coordinated cutover. Do not claim authoritative grading is enforced across the live database yet.

## Cutover order

1. Configure a server-only Supabase key and the read-only DynamoDB workload role/profile. The Amplify SSR environment allowlist now supports `SUPABASE_SECRET_KEY`; never log the generated environment file or include it in a public artifact.
2. Deploy the new application to a test host using migration 003. Sign in normally and verify bank retrieval, submission, feedback, duplicate retry, reload, and certification-specific totals. The database role tests impersonate JWT claims inside SQL; they are not browser sign-in tests.
3. Complete the authenticated Lambda streaming endpoint before an Amplify production migration. The current Next.js proxy remains an interim local/Vercel path. It now parses upstream SSE on the server, emits only question/options previews, and issues a private record before completion. Malformed, interrupted, oversized, and provider-error streams cannot become answerable questions.
4. The existing deployed generator hardcodes DVA-C02. This app temporarily returns 503 for SAA-C03 generation to prevent mislabeled exam questions. Repair and deploy the generator's certification handling before removing this guard.
5. Move traffic to the tested application and apply the explicit cutover SQL. Confirm direct writes and legacy RPC calls are denied and issued saves still succeed. Old clients will no longer be able to save; arrange the hosting switch accordingly.

## Validation

- `npm run test:routes`: authentication, input tampering, retry response, generator exam restriction, and public completion.
- `npm run test:generation`: component callback state plus fragmented UTF-8/SSE, private feedback filtering, provider failure, truncation, and size limits.
- `npm run test:issuance`: trusted record contents, public allowlist, all three bank-selection paths, and user/service validation.
- `tests/grading-db-fixture.sql` is for a **disposable local database only**. It reproduces the relevant live columns and Supabase role behavior, not the entire managed platform. Apply migration 002, migration 003, and the cutover script, then run `tests/grading-db-checks.sql`. These checks cover grading, feedback, retries, expiry, user isolation, exam separation, private keys, restricted writes, and rollback on progress failure.
- `node tests/grading-concurrency.cjs` targets only the temporary local Unix socket/port documented in that script. It sends simultaneous answers for a fresh disposable question and checks one saved result and one increment.
- TypeScript and production build pass. The existing configuration skips lint. Authenticated browser service and mixed-practice tests now pass against the live bank/database; no hosting deployment occurred.

References: [Supabase database function permissions](https://supabase.com/docs/guides/database/functions), [API key privileges](https://supabase.com/docs/guides/getting-started/api-keys), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).


## Local AWS authentication

AWS_PROFILE=aws-exam-app is configured in ignored .env.local. That profile delegates credential retrieval to the temporary aws-exam-local CLI login through credential_process. Renew the session using `aws login --profile aws-exam-local --region us-east-2`. Live STS, DynamoDB metadata, and Node SDK count queries passed. This local identity is the existing IAM user, not the future Amplify compute role; no new IAM permissions were granted. The user signed in normally and completed browser verification.

Reference: [AWS console-based temporary CLI login](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html).


## Completed authenticated browser check

Service practice (SAA-C03 Lambda) and mixed practice (DVA-C02 Compute/ECS) both loaded questions, saved answers, displayed feedback, and retained progress after full reload. The first test returned an incorrect result with detailed feedback; the second returned a correct result. Database verification found 161 saved answers, including these two intentional test submissions. Totals: SAA-C03 95 attempted / 25 correct, DVA-C02 66 attempted / 15 correct. Existing 159 answers were preserved. This verifies bank-backed practice; the generated-question endpoint and Amplify deployment still require testing.
