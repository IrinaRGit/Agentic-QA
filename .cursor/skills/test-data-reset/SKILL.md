---
name: test-data-reset
description: Deletes records that Playwright tests created in the app under test, using the delete calls in support/api-client.ts. Use only when the user explicitly asks to reset test data after an interrupted run left records behind.
disable-model-invocation: true
---

# Test Data Reset

Run from the repo root:

```bash
npx tsx .cursor/skills/test-data-reset/scripts/reset-test-data.ts [--dry-run] [--type <type>]
```

Reuses `support/api-client.ts` and `support/record-tracker.ts` — do not duplicate API logic. Default: delete every record in `.test-artifacts/created-records.jsonl` with its owner's storage state. Flags: `--dry-run` (list targets, delete nothing), `--type <type>`. Never delete a record the tracker did not record.

## Workflow

confirm intent; check the auth files exist (run the setup project if not); run
--dry-run first unless the user already confirmed; 401 → the storage state expired,
re-run setup; 404 → report it as already removed.

1. Confirm the user explicitly asked to reset leftover test data (not routine suite cleanup).
2. Ensure `playwright/.auth/user.json` exists for `main` records (and `playwright/.auth/alt-user.json` if any tracked `alt` records). If missing: `npx playwright test --project=setup`.
3. Run with `--dry-run` unless the user already confirmed deletion.
4. Run without `--dry-run` to delete, then read the script output.

## Result template

```markdown
- **Scope:** (all tracked types | --type value)
- **Found:** N
- **Deleted:** N (includes HTTP 404 already removed)
- **Failed:** N (includes HTTP 401 — re-run setup)
```
