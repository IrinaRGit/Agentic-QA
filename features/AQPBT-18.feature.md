# AQPBT-18 — Profile family details

Jira: [AQPBT-18](https://legionqaschool.atlassian.net/browse/AQPBT-18)  
Confluence: [Profile: family details (name, host note, address visibility)](https://legionqaschool.atlassian.net/wiki/spaces/AQPBT/pages/329220097)

```gherkin
Feature: Profile family details — family name, host note, address visibility

  Background:
    Given I am signed in as the main family parent
    And I am on "/profile"
```

## Happy paths

```gherkin
  Scenario: Family details section shows name, host note, visibility, and save
    Then I see the heading "Family details"
    And I see the textbox "Family name"
    And I see the textbox "Host address or meeting note"
    And I see the combobox named "Show to trusted circle"
    And I see the button "Save family details"

  Scenario: Visibility combobox lists all three privacy options
    When I open the address visibility combobox in Family details
    Then I can choose "Show only after confirmation"
    And I can choose "Show to trusted circle"
    And I can choose "Keep hidden"

  Scenario: Save family details without changes shows success feedback
    Given the textbox "Family name" has a non-empty saved value
    When I activate "Save family details"
    Then I see "Saving..." on the save control while the request runs
    And I see "Family settings saved"
    And I see the enabled button "Save family details"
```

## Negative

```gherkin
  Scenario: Empty family name blocks save with required-field validation
    Given I clear the textbox "Family name"
    When I activate "Save family details"
    Then the textbox "Family name" shows validation message "Please fill out this field."
    And I do not see "Family settings saved"
```

## Edge cases

```gherkin
  Scenario: Unsaved family name edit is discarded after leaving profile
    Given the textbox "Family name" has saved value "The Gorfels"
    When I fill the textbox "Family name" with "Unsaved probe name"
    And I navigate to "/app" via the sidebar link "Dashboard"
    And I open "/profile" again
    Then the textbox "Family name" has value "The Gorfels"

  Scenario: Alt family has its own Family details defaults
    Given I am signed in as the alt family parent
    And I am on "/profile"
    Then the textbox "Family name" has value "Flintstones"
    And I see the combobox named "Show only after confirmation"
```

<!--
Ambiguities / gaps (not in AC — do not assert unless confirmed):
- Host note + visibility-only save success copy (open question on feature page).
- Whether family name on dashboard updates immediately after a real save (not tested with new name).
- Co-parent sharing one Family details block (out of scope per ticket).
- Browser validation message locale if not en-CA.
-->
