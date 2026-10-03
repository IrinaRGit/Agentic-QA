# AQPBT-5 — Dashboard manage kids

Jira: [AQPBT-5](https://legionqaschool.atlassian.net/browse/AQPBT-5)  
Confluence: [Dashboard: manage kids](https://legionqaschool.atlassian.net/wiki/spaces/AQPBT/pages/309166081)

```gherkin
Feature: Dashboard manage kids — Change avatar, remove, add-child form

  Background:
    Given I am signed in as the main family parent
    And I am on "/app"
```

## Happy paths

```gherkin
  Scenario: Dashboard shows family header, children, add-child form, and matching My Kids count
    Then I see the family name "The Gorfels"
    And I see the parent display name "Lev Test"
    And I see child "Mia" with summary "Mia, 7 · Girl" and interest tags "drawing" and "lego"
    And I see child "Maria" with summary "Maria, 7 · Girl" and interest tag "art"
    And each listed child has "Change avatar" and "remove" actions
    And I see the add-child fields "Child's first name", "Birth year", "Month", "Interests (comma-separated)", and "Gender"
    And I see avatar icon buttons from "Fox" through "Ball"
    And I see interest shortcuts "+ LEGO" through "+ Crafts"
    And I see the "Add child" button
    And the "My Kids" stat equals the number of listed child rows

  Scenario: Opening Change avatar shows icon row, gender combobox, and done
    When I activate "Change avatar" for child "Mia"
    Then I see avatar icon buttons "Fox", "Dino", "Robot", "Cat", "Penguin", "Unicorn", "Bear", "Bunny", "Frog", "Owl", "Lion", "Panda", "Whale", "Ladybug", "Rocket", and "Ball"
    And I see the avatar editor gender combobox with "Prefer not to say", "Boy", and "Girl"
    And I see the "done" button

  Scenario: Done without changing avatar keeps child summary and tags
    Given child "Mia" has summary "Mia, 7 · Girl" with interest tags "drawing" and "lego"
    When I activate "Change avatar" for child "Mia"
    And I activate "done" without selecting a new avatar icon
    Then the avatar editor is closed
    And child "Mia" still has summary "Mia, 7 · Girl" with interest tags "drawing" and "lego"

  Scenario: Interest shortcut + LEGO fills Interests (comma-separated) with LEGO
    When I activate "+ LEGO" on the add-child form
    Then the "Interests (comma-separated)" field contains "LEGO"

  Scenario: Remove child drops the row and decreases My Kids by one
    Given a unique child was added on the dashboard
    When I activate "remove" for that child
    Then that child row is no longer shown
    And the "My Kids" stat decreased by one on the same page view
```

## Negative

```gherkin
  Scenario: Add child with empty required fields focuses Birth year and does not add a row
    Given the add-child form has empty required fields
    And I note the current "My Kids" count
    When I activate "Add child"
    Then focus is on "Birth year"
    And no new child row appears
    And the "My Kids" stat is unchanged

  Scenario: Partial add-child with first name and LEGO does not create a child
    Given the add-child form has only "Child's first name" filled and interests contain "LEGO" from "+ LEGO"
    And I note the current "My Kids" count
    When I activate "Add child"
    Then no new child row appears
    And the "My Kids" stat is unchanged
```

## Edge cases

```gherkin
  Scenario: Change avatar toggles the avatar editor closed
    When I activate "Change avatar" for child "Mia"
    And I activate "Change avatar" for child "Mia" again
    Then the avatar editor is not visible for child "Mia"

  Scenario: Remove acts immediately without a confirm or cancel step
    Given a unique child was added on the dashboard
    When I activate "remove" for that child
    Then there is no confirm or cancel dialog
    And that child row is no longer shown

  Scenario: Add-child Gender combobox defaults to prefer not to say
    Then the "Gender" combobox shows "Gender: prefer not to say"

  Scenario: Multiple interest shortcuts append to Interests (comma-separated)
    When I activate "+ LEGO" on the add-child form
    And I activate "+ Minecraft" on the add-child form
    Then the "Interests (comma-separated)" field contains "LEGO" and "Minecraft"
```

<!--
Ambiguities / gaps:
- Successful Add child with a new row is out of scope in AQPBT-5; remove/edge scenarios create a unique child in-test then delete via UI.
- AC5 "required fields empty" — only Birth year focus was observed; Month is not marked required in the live form.
- No visible validation message on failed add-child submit (focus shift only).
- Birth year + Month → displayed age rule not specified (e.g. Mia, 7 · Girl).
- Remove has no undo/confirm in the accessibility tree.
- Co-parent / second-session behavior not observed.
- Profile kids list sync vs duplicate not specified.
- Min/max children per family unknown.
- Success toast after done or Add child not observed.
- Opening avatar editor on another child while one is open not tested.
- Add form Gender label "Gender: prefer not to say" vs avatar editor "Prefer not to say".
- Family/child examples (The Gorfels, Lev Test, Mia, Maria) follow Confluence; env drift is a test risk.
-->
