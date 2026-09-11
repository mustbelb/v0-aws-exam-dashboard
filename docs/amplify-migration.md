# Amplify migration preparation

The repository now includes an Amplify build specification. This is preparation, not a completed deployment or a claim that live generation works on Amplify.

## Required configuration

1. Connect the GitHub repository/branch to Amplify Hosting, using a Node.js 22 build environment.
2. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, DYNAMODB_REGION=us-east-2, DYNAMODB_TABLE_NAME=exam-questions, and the generator endpoint when ready. The Supabase anon key is intentionally public; never substitute the service-role key.
3. Attach an SSR compute role permitting dynamodb:Query on the actual question-table ARN. The app now uses the SDK credential provider chain rather than hardcoded access-key settings. Keep local AWS_PROFILE credentials outside the repository.
4. Add the Amplify test origin to Supabase's allowed authentication redirect URLs and the Google OAuth configuration if used. Test signup, email confirmation, sign-in, and sign-out.
5. Keep DESIGN_PREVIEW disabled in hosted builds. The build script refuses the opt-in sample-data preview setting and never copies AWS keys or arbitrary environment variables into the deployment.

## Blocking work before production cutover

- Existing generator source and Supabase schema/RPC/RLS have now been inspected; use the verified backend documented below.
- Move the streaming generation connection to a separately authenticated Lambda endpoint. Changing the Next route from Edge to Node does NOT solve Amplify's streaming limitation. The current streaming proxy is retained for the current/local runtime until the separate endpoint contract is ready.
- Define server-authoritative grading for both bank and generated questions. Atomic history/progress persistence is now applied; trusted question issuance and restricted writes remain.
- The new transactional RPC prevents partial saves and duplicate increments. Deploy the updated app before relying on this flow; the old Vercel code still uses separate writes.
- Verify rate limits, real question retrieval, save/reload consistency, generated question feedback, and exam-specific history before retiring Vercel.

## Documentation used

- https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html
- https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html
- https://docs.aws.amazon.com/amplify/latest/userguide/amplify-SSR-compute-role.html

## Verified AWS inventory — 11 September 2026

Read-only console inspection confirmed the question bank and generator in Ohio (us-east-2). The DynamoDB table `exam-questions` reports 3,979 items, with string keys PK/SK and no secondary indexes. A completed query for `CERT#DVA-C02#SERVICE#lambda` returned 104 items. The table count is AWS metadata, not a fresh full-table count.

The `AWS-exam` Lambda uses Node.js 24.x, 512 MB memory, a three-minute timeout, and a RESPONSE_STREAM Function URL. Its URL uses NONE authentication with wildcard CORS. Source inspection confirms there is no application authentication either. The handler accepts service/topic/userId but ignores certification and always prompts for DVA-C02; it does not persist or issue authoritative question IDs. Provider HTTP failures can be mistaken for successful empty completion. These are existing backend defects to resolve before cutover.

No exam-dashboard Amplify app was present in this region. The console also contains `batch-question-generator` and `topic-tagging`; those functions have not been modified. No cloud changes or question writes were made during inspection.

Use DYNAMODB_REGION to explicitly select the question bank region independently of the hosting runtime. Amplify reserves the AWS prefix for internal environment variables: https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html

Next integration dependency: Supabase project configuration, schema/RPC/RLS inspection, and sign-in testing. The downloaded generator source is available locally for implementing an authenticated generation contract; it has not been redeployed.

## Existing Supabase project located through Vercel

The linked resource is `supabase-AWS-exam`, project `rbquwmbthcuvxmowtwej`, in us-east-1. Vercel's NEXT_PUBLIC_SUPABASE_URL confirms `https://rbquwmbthcuvxmowtwej.supabase.co`. This is separate from the empty `AWS Exam APP` project in the Prepare 2 Lead organization (`rerlbckqpphqhukasotw`). Do not initialize or migrate into the empty project as a substitute for the existing backend.

Local `.env.local` now contains the existing public Supabase URL/anon key and verified question-generator URL, with DYNAMODB_REGION=us-east-2. It is gitignored. No AWS access keys, database passwords, or Supabase service-role keys have been copied.

The existing Supabase resource was provisioned through Vercel Marketplace. Moving web hosting to Amplify does not itself transfer the database's organization/billing. Keep that resource intact during hosting migration. A later transfer from the Vercel-managed organization to a Supabase-managed organization is supported, but requires membership in both organizations and checking the target plan/project limits. Do not uninstall/delete the integration as a shortcut: deletion can remove the database itself.

References:
- https://supabase.com/docs/guides/integrations/vercel-marketplace
- https://supabase.com/docs/guides/platform/project-transfer
- https://supabase.com/docs/guides/troubleshooting/how-to-delete-vercel-linked-projects-9d08aa

## Applied database migration update

Migrations 202609110001 and 202609110002 were applied through the SQL editor to rbquwmbthcuvxmowtwej. Do not rerun 002: it replaces old constraints and reconciles counters. The Supabase migration history table was not updated by the dashboard; these files record the applied changes for future CLI baselining.

Progress is now unique by user/certification/service. History deduplication is scoped to user/certification/service plus question hash or ID. Counters were rebuilt from all 159 retained answer records. The new app submit handler calls save_question_answer exactly once; both practice clients use saved results and returned totals. Legacy increment functions remain compatible for the still-hosted Vercel app, which continues to use its old separate-save flow until cutover.

Persistence fixes are complete, but trusted grading/issuance remains a launch blocker. The new RPC accepts a correct-answer parameter, and existing authenticated direct-write policies and legacy RPC access are retained. These must be restricted alongside the next app/generator change.


## Issuance update

Migration 003 is now applied. See [authoritative grading](authoritative-grading.md) for the current contract, server-key configuration, tests, and coordinated permission lockdown. Earlier notes about client-key saving describe the prior implementation; legacy compatibility still exists only until cutover.

## Current deployment contract (supersedes earlier interim notes)

The browser POSTs to AUTHENTICATED_GENERATOR_URL with its session bearer token; Amplify serves only the authenticated configuration response. Test Lambda `aws-exam-generator-test` is already deployed. Add the eventual Amplify test origin to both its ALLOWED_ORIGINS and Function URL CORS before live testing. Provider generation is blocked by an invalid existing Anthropic key; replace that key privately in the test function. Do not modify the legacy Lambda as part of this test deployment.

Set SUPABASE_SECRET_KEY as a server-only hosting configuration value for private question issuance. scripts/hosting/write-env.cjs copies only the explicit SSR allowlist. Never set AWS_PROFILE or AWS access keys in Amplify; attach the dedicated DynamoDB Query compute role. Migration004 is applied along with001–003, but final permission lockdown is still pending coordinated cutover.

The test branch is codex/aws-integration; the production branch stays unchanged. The build runs typechecking and playback, route, generation and issuance regressions before Next build. The local production build passed (lint is skipped by the existing configuration).

## Publication checkpoint

The local production build and all regression suites pass. Automatic approval review
blocked publishing the full workspace to GitHub, citing potentially private source and
metadata and an unverified destination. No push occurred. The proposed upload is now
limited to application source, tests, build/deployment helpers, and technical docs on
`https://github.com/mustbelb/v0-aws-exam-dashboard`, branch `codex/aws-integration`.
The local `outputs/` handoff reports, environment files and build artifacts are excluded.
User approval of this specific branch publication is required before retrying the push.
The production main branch will not be updated as part of the test deployment.

The Amplify console reached repository selection, but its GitHub repository list remained
loading. No exam app or hosting branch was created. After publication approval, complete
the existing Amplify GitHub connection or investigate that loading state; do not grant
broader repository permissions without checking the exact requested scope.
