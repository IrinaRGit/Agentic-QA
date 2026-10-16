---
name: api-cleanup
description: Ensures Playwright tests clean up the data they create. Use whenever generating or reviewing tests that create persistent records in the app under test (BuddyTime availability, playdates, invites, or anything else), so test data does not accumulate in the shared test environment. Apply this to every test that creates data — even if cleanup isn't explicitly requested.
paths: "tests/**"
---

# API Cleanup

## Steps

1. Import test and expect from fixtures/cleanup.fixture.ts, not from @playwright/test.
2. Records created through the UI are tracked automatically from the create response.
   Records created through the API: call trackRecord({ type, id, owner }) right after
   creation, with owner "main" or "alt".
3. No manual afterAll cleanup blocks — the fixture and global teardown handle it.
4. Cleanup uses the delete calls in support/api-client.ts with the owner family's
   storage state. If a record type has no delete call, the spec uses the UI teardown
   agreed in P10 — never leaves it behind.
5. Never hardcode a credential. Never delete data the test did not create.

## Tracked record types

| type | create request | delete request | owner |
|------|----------------|----------------|-------|
| `child` | `POST /api/v1/children` (201). UI: auto-tracked when `recordOwner` is set and the dashboard create response matches `CREATE_CHILD_PATH_PATTERN`. API: call `trackRecord({ type: 'child', id, owner })` after create. | `DELETE /api/v1/children/:id` via `deleteChild` / `deleteTrackedRecord` in `support/api-client.ts` (204 or 404 = success). Global teardown runs deletes with the matching family storage state (`main` → setup auth file, `alt` → alt auth file). | `main` or `alt` |

When new types are added, update this table from `support/cleanup.types.ts`, `support/record-tracker.ts`, and `support/api-client.ts` — do not invent types or endpoints.
