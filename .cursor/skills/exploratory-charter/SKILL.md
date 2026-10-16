---
name: exploratory-charter
description: Turns a feature name and a risk into a session charter and a blank findings template. Use when the user asks for an exploratory charter, session charter, exploratory testing plan, or wants to structure a time-boxed exploration before or after clicking through the app. The tester supplies the thinking; this skill only enforces the format.
---

# Exploratory Charter

format only — never invent risks, oracles, or findings.

- Required inputs: feature and risk (ask if missing). Optional: time box, scope in/out,
  ticket key, Confluence page, page URL.
- Charter template: Feature, Risk, Time box, In scope, Out of scope, Ticket; Mission;
  Oracles (human); Areas to probe (human); Notes before start.
- Findings template: # | Type (bug / question / note) | Area | Observation | Severity |
  Follow-up; then Coverage (Tried / Not tried / Charter done?).
- Save as charters/<feature-slug>.md. Do not write specs, file bugs, or run tests here.

## Charter template (copy into file)

```markdown
# Session charter: <Feature>

## Feature

## Risk

## Time box

## In scope

## Out of scope

## Ticket

## Mission

## Oracles (human)

## Areas to probe (human)

## Notes before start
```

## Findings template (append in same file)

```markdown
---

## Findings

| # | Type (bug / question / note) | Area | Observation | Severity | Follow-up |
|---|------------------------------|------|-------------|----------|-----------|

## Coverage

- **Tried:**
- **Not tried:**
- **Charter done?**
```
