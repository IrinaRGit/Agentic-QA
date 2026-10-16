---
name: self-heal
description: Repairs drifted Playwright locators after a UI change — patch the POM, re-run unchanged assertions, open a PR. Use when the build is red because a locator broke, fix the drifted selector, the test broke after a UI change, or heal the suite. Use ONLY after triage classifies the red run as a test issue (drift/locator drift); NEVER for a real app bug — route those to bug-reporter instead.
---

# Self-Heal

## Prerequisite

- Prerequisite: a completed triage diagnosis classified test issue (drift). If it is a
  real app bug, missing, or ambiguous → stop and route to bug-reporter.

## Steps

1. From the error and trace, find the failing test, the assertion line (read-only),
   the POM property that supplied the locator, and the old locator exactly as written.
2. Re-discover the element with browser_navigate + browser_snapshot against
   APP_URL: same role, current accessible name. Never guess from screenshots.
3. Patch only that locator in the POM (minimal diff; keep role-based; never CSS or
   XPath; never broaden it to make it pass). One locator per run.
4. Re-run the failing spec and prove it green with zero changes under tests/.
5. Open a PR on branch heal/<short-description> with the run id, the triage
   classification, the old → new locator diff, the re-run result, and the line
   "assertions unchanged". Do not merge.

## Stop and escalate

Stop and escalate if green needs an assertion change, if the same locator error
persists after re-discovery, or if a new failure looks like a product regression.

## Report template

Use this in the PR body (or hand off to the parent agent if no PR):

```markdown
## Self-heal report

- **CI run id:**
- **Triage classification:** test issue (drift)
- **Failing test:**
- **Assertion (unchanged):** `tests/...` line N — quote the `expect(...)` only
- **POM file / property:**
- **Locator change:**
  - **Old:** `...`
  - **New:** `...`
- **Re-run:** `npx playwright test <spec> --project=app` — pass / fail
- **assertions unchanged:** yes
```

## Do / Don't

| Do | Don't |
|----|--------|
| Complete [ci-failure-triage](../ci-failure-triage/SKILL.md) first; heal only on **test issue (drift)** | Heal when triage says **real app bug** or **ambiguous** — use [jira-bug-reporter](../jira-bug-reporter/SKILL.md) |
| Change **one** locator in `pages/` per heal run | Patch `tests/` assertions or expected strings to go green |
| Re-discover with **browser_snapshot** on `APP_URL` | Guess labels from screenshots or memory |
| Keep `getByRole` / `getByLabel` / `getByText`; use `{ exact: true }` when needed | Introduce CSS, XPath, or overly broad locators |
| Re-run the **same** failing spec unchanged | Merge the heal PR yourself |
| Branch `heal/<short-description>` and document old → new in the PR | Fix multiple unrelated locators in one run |
