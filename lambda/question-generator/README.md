# Authenticated question streaming

Build with `node scripts/deployment/build-generator.cjs` and run `npm run test:generation`.
The deployment helper creates or updates the isolated test function only. It preserves
its current provider key and origins; an ignored local ANTHROPIC_API_KEY can override
that key. Never put provider or Supabase server keys into committed configuration.

The function URL uses RESPONSE_STREAM and AWS AuthType NONE. Application authorization
is mandatory: POST a Supabase access token in the Authorization bearer header. The
handler verifies that token with Supabase before reserving quota or invoking the model.
Only the verified user ID is used. CORS and ALLOWED_ORIGINS must contain the exact app
origins. Supabase migration004 must be applied before using this endpoint.

Requests contain service, certification, and optional slug-form topic. The server checks
the shared service definitions and supports both certifications. The provider stream
is decoded privately. Public partial events expose question/options only; completion
requires a saved user-bound issuance record. Answers and explanations are returned by
the app's submit endpoint only after grading. Browser disconnects/timeouts abort work.

The test deployment has concurrency2 and quotas of3/minute and20/hour per user. Failed
provider calls consume quota. Request records are indexed by user/time; arrange periodic
retention cleanup when promoting beyond the test deployment. Logs contain error codes,
not access tokens, prompts, answers, or upstream credential/configuration responses.

The existing legacy provider credential currently returns HTTP401. Replace
ANTHROPIC_API_KEY privately in the test function before live successful-generation QA.
Model configuration is claude-haiku-4-5-20251001. The legacy production generator is
unchanged by this helper. Final Supabase write lockdown is a separate coordinated cutover.
