---
name: jira-ticket-analyzer
description: Turns a Jira ticket's acceptance criteria into structured, reviewable Gherkin test scenarios. Use this skill whenever the user references a Jira ticket (AQPBT-1, AQPBT-2, etc.) and asks for test cases, a test plan, scenarios, or wants to plan testing for a ticket — even if they don't say the word "Gherkin".
---

# Jira Ticket to Gherkin Test Cases

The Gherkin is a human-readable checkpoint reviewed before any Playwright code is written.

## Steps

1. Read the ticket with the Atlassian MCP: title, description, every acceptance criterion. If it links a Confluence page in space CONFLUENCE_SPACE_KEY, read that page too and use its business rules.
2. One Feature named after the ticket; every AC covered by at least one Scenario; add negative scenarios (what must NOT happen) and edge cases (boundaries, empty input, duplicates, special characters, max length, time-zone and overlap edges for scheduling rules, a second family's point of view).
3. Given / When / Then: Given = starting state, When = the action under test, Then = the observable expected outcome.
4. Group with comments: # Happy paths, # Negative, # Edge cases.
5. Use real, specific values from the ticket — never placeholders.
6. End with a comment block listing ambiguities or gaps in the acceptance criteria.

## Output

Write `features/<ticket-key>.feature.md` (example: `features/AQPBT-5.feature.md`).

Include Jira and Confluence links at the top of the file. Use fenced `gherkin` blocks per group.

## Atlassian MCP (this repo)

1. Call `getAccessibleAtlassianResources` once; reuse `cloudId` on later calls.
2. `getJiraIssue` with `view: full` (or `evidence`) for description and AC text.
3. If the ticket or Confluence link gives a page id or URL, `getConfluenceContent` with `detail: full` and `content_format: markdown`.
4. Resolve `CONFLUENCE_SPACE_KEY` from `.env` / `.env.example` when searching Confluence by space (practicum default: `AQPBT`).

## Before Playwright

Stop after the feature file unless the user asks for specs. If the user approved a plan only, write the feature file first; implement `tests/` in a separate step.

When live app behavior contradicts the ticket during a later implementation run, report the mismatch — do not weaken Gherkin or assertions to match the app without explicit approval.

## Reference

Example shape: [features/AQPBT-5.feature.md](../../../features/AQPBT-5.feature.md) in this repo.
