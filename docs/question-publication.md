# Question publication and retirement

The reader accepts legacy bank rows without publicationStatus and rows explicitly marked published. Any other explicit value, including retired or draft, is excluded before selection in service practice and both mixed-practice fallback paths. Pagination continues when a page contains no eligible rows.

Publish substantive rewrites under new immutable questionId values. Mark the superseded original retired and record supersededBy; retain the original question, key, and explanations for audit. New records can carry supersedes, reviewedAt, and reviewSources metadata. A change to bank eligibility does not invalidate already issued questions or rewrite past answers, grades, or progress.

Deploy the retirement-aware reader before changing bank statuses. Publish new rows and retire their predecessors together with one DynamoDB transaction: require each new key to be absent and require each original's reviewed content/status to match the captured snapshot. If a condition fails, stop and re-read the specific affected records before retrying. Use a client request token for uncertain retries of the exact same transaction. Read back affected keys after success.

This is an editorial workflow, not a claim that all legacy content has been reviewed. The production runtime remains read-only against DynamoDB; use a separately authorized operator identity for publication. Do not grant bank writes to the application's compute role.
