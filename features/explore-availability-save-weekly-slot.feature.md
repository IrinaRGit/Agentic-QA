# Explore: `/availability` — save weekly slot

**Explored:** https://test.buddytime.ca/availability (read-only crawl; no Save or persistent exception submitted)

## Coverage snapshot

| Flow | Spec coverage | POM |
|------|---------------|-----|
| Open `/availability` and see page chrome | **Gap** | `AvailabilityPage.goto()`, `heading` |
| Sidebar **Availability** navigation | **Gap** | `HeaderComponent.gotoAvailability()` |
| View helper copy under **Set your weekly free time** | **Gap** | — |
| Apply **Weekend afternoons** preset | **Gap** | `applyWeekendAfternoonsPreset()` |
| Add row via **+ Add slot** | **Gap** | `addSlotButton` only |
| Edit slot: **Day**, **Start time**, **End time**, **Kid**, **Hosting**, **Notice** | **Gap** | not modeled on POM |
| Per-weekday **add** buttons (empty day columns) | **Gap** | — |
| **remove** on a slot row | **Gap** | — |
| **Save availability** | **Gap** | `saveAvailabilityButton` only |
| **Add exception** (date, **Away / closed** / **Extra open slot**, **Optional note**) | **Gap** | `addExceptionButton`; date field unnamed in a11y tree |
| Existing specs | `tests/login.spec.ts`, `tests/aqpbt-5-Dashboard-manage-kids.spec.ts` — no `/availability` references |

## Selected gap

**Save availability after configuring a weekly slot** — this is the primary outcome parents need for playdate matching, and nothing in `tests/` asserts it despite partial POM locators.

## Gherkin test plan

```gherkin
Feature: Weekly availability on /availability

  Scenario: Parent saves a configured weekly slot
    Given the main family is signed in and on the Availability page
    When they click the "+ Add slot" button
    And they set Day to "Wed"
    And they set Start time to "16:00"
    And they set End time to "18:00"
    And they set Kid to "Whole family"
    And they set Hosting to "Either"
    And they set Notice to "24h"
    And they click the "Save availability" button
    Then the heading "Set your weekly free time" is visible
    And a row shows Day "Wed" with Start time "16:00" and End time "18:00"

  Scenario: Add exception without a date does not create an exception row
    Given the main family is signed in and on the Availability page
    When they leave the required exception date empty
    And they click the "Add exception" button
    Then the heading "Set your weekly free time" is visible
    And the exception date field is still empty or invalid
    And no new removable exception row appears beyond what was already on the page
```

## Locator hints

| Control | Suggested locator |
|---------|-------------------|
| Page heading | `getByRole('heading', { name: 'Set your weekly free time', exact: true })` |
| + Add slot | `getByRole('button', { name: '+ Add slot', exact: true })` |
| Day | `getByRole('combobox', { name: 'Day' })` — scope to slot row |
| Start time / End time | `getByRole('textbox', { name: 'Start time' })`, `getByRole('textbox', { name: 'End time' })` |
| Kid | `getByRole('combobox', { name: 'Kid' })` |
| Hosting | `getByRole('combobox', { name: 'Hosting' })` |
| Notice | `getByRole('combobox', { name: 'Notice' })` |
| Save availability | `getByRole('button', { name: 'Save availability', exact: true })` |
| Add exception | `getByRole('button', { name: 'Add exception', exact: true })` |
| Exception date | required `textbox` in exceptions section (no accessible name in snapshot — add `getByLabel` if label exists in DOM, or scope by section) |
| Away / closed | `getByRole('combobox', { name: 'Away / closed' })` |
| Optional note | `getByRole('textbox', { name: 'Optional note' })` |

## For test-writer

- **Suggested file:** `tests/availability-weekly-save.spec.ts`
- **POM updates:** Extend `AvailabilityPage` with methods to fill the nth slot row (`selectDay`, `setStartTime`, `setEndTime`, `selectKid`, `selectHosting`, `selectNotice`, `save()`), and an `exceptionsSection` helper for the unnamed date field once located with a stable role/label.
- **Fixtures:** `fixtures/cleanup.fixture.ts`; if save persists server-side, confirm `api-cleanup` tracked types or agreed UI teardown before mutating shared env in CI.
- **Tags:** `@e2e` or `@sanity` on each scenario; use `page.clock` if slot assertions depend on “today”.

## Suggested Jira story

**Title:** As a parent, I can save weekly availability slots so BuddyTime can match playdates.

**Description:** Cover `/availability` weekly editor: add/configure a slot (Day, times, Kid, Hosting, Notice) and save; validate exception date required when adding calendar exceptions.

**Acceptance criteria (draft):**

1. Given a signed-in parent on Availability, when they add a slot and click Save availability, the slot remains visible after reload.
2. Given an empty exception date, when they click Add exception, no new exception is added and required date validation applies.
