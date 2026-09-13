# Question publication and retirement

The reader accepts legacy bank rows without publicationStatus and rows explicitly marked published. Any other explicit value, including retired or draft, is excluded before selection in service practice and the shared mixed-practice fallback path. Pagination continues when a page contains no eligible rows.

Publish substantive rewrites under new immutable questionId values. Mark the superseded original retired and record supersededBy; retain the original question, key, and explanations for audit. New records can carry supersedes, reviewedAt, and reviewSources metadata. A change to bank eligibility does not invalidate already issued questions or rewrite past answers, grades, or progress.

Deploy the retirement-aware reader before changing bank statuses. Publish new rows and retire their predecessors together with one DynamoDB transaction: require each new key to be absent and require each original's reviewed content/status to match the captured snapshot. If a condition fails, stop and re-read the specific affected records before retrying. Use a client request token for uncertain retries of the exact same transaction. Read back affected keys after success.

This is an editorial workflow, not a claim that all legacy content has been reviewed. The production runtime remains read-only against DynamoDB; use a separately authorized operator identity for publication. Do not grant bank writes to the application's compute role.

## Reader metadata cache

The next-question reader keeps eligible IDs and DynamoDB keys in a process-local cache for up to 30 seconds, with at most 128 exam/service catalogs. Concurrent requests on the same process share a refresh. New publications and summary counts can take up to 30 seconds to appear; each hosting process refreshes independently. There is no shared cache service or publication-side invalidation requirement.

Before issuing a selected ID, the reader performs a strongly consistent exact-PK/SK Query and rechecks publicationStatus and questionId. This uses the existing dynamodb:Query permission. A deleted, retired, or replaced candidate is rejected and selection tries another candidate. An AWS error fails the request rather than serving a cached question body. Question bodies, answers, and learner history are never stored in this cache.

A retirement committed before the exact-key read is observed by that read. DynamoDB selection and Supabase issuance are not one transaction: a retirement concurrent with the interval after that read can still leave a valid issued snapshot. Already issued snapshots remain gradeable under the existing issuance rules.

Cache refreshes still read the whole partition, including retired records. Projection reduces response payload, not DynamoDB read capacity for that refresh. Strong consistency increases the per-refresh read cost relative to the old eventually consistent query. Warm requests generally read one question, but retirement fallback may read multiple candidates. Benefits depend on repeated requests sharing a warm process; cold starts and low traffic may see no cost reduction. A persistent published-question access path remains a later option if measurements justify it.

Learner history uses ordered question-ID keyset pagination, scoped to authenticated user, exam, and service. It continues until an empty page, including when the server applies a lower row limit. Null legacy IDs do not exclude any bank ID. The existing unique non-null question-ID index supports this ordering. Concurrent unanswered requests may still select the same question; this change does not introduce question reservations or alter transactional answer deduplication.

Next-question success and bank-empty/exhausted responses explicitly use private, no-store. Test locally with npm run test:issuance, npm run test:routes, and npm run typecheck before rollout. No database migration or IAM expansion is needed. Performance and concurrency capacity require staging measurements.

AWS reference: [projection expressions and read capacity](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html).
