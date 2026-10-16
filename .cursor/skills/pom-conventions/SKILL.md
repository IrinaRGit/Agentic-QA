---
name: pom-conventions
description: Page Object Model conventions for Playwright tests in this project. Apply whenever generating, refactoring, or reviewing any Playwright test that interacts with the app under test (BuddyTime) — even if the user doesn't say "POM". Tests should never contain inline locators.
paths: "tests/**, pages/**"
---

# POM Conventions

Read this file at the start of every task that touches `tests/` or `pages/` (generate, refactor, or review).

## Steps

- Steps: one class per page or distinct component; locators as readonly properties
  set in the constructor (getByRole, getByLabel, getByText — never CSS); methods for
  user actions that do not assert; no expect() in pages/; compose components inside
  pages; specs import POMs and instantiate them with new XxxPage(page).

## BuddyTime page inventory

Routes come from `AppRoute` in `test-data/routes.ts` and each page’s `goto()`.

| route | page object | notes |
|-------|-------------|--------|
| `/` | `LandingPage` | Public marketing landing page. |
| `/login` | `LoginPage` | Log-in page for existing parents. |
| `/signup` | `SignupPage` | Parent sign-up registration page. |
| `/forgot-password` | `ForgotPasswordPage` | Forgot-password / reset-link request page. |
| `/app` | `DashboardPage` | Signed-in home dashboard. Composes `HeaderComponent`, `AddChildFormComponent`, `DashboardKidsSectionComponent`; invite panels via `openCircleInvite()` / `openCoParentInvite()`. |
| `/calendar` | `CalendarPage` | Family calendar view. |
| `/friends` | `FriendsPage` | Friends / circle list page. Composes `HeaderComponent`; `FamilyManagePanelComponent` / `CircleInvitePanelComponent` from page methods. |
| `/communities` | `CommunitiesPage` | Communities list page. |
| `/communities/15f52f3a-ba2f-46b7-b859-047ed8f6b50f` | `CommunityDetailPage` | Single community detail (explored Maple Class id). Composes `HeaderComponent`; tab methods return `CreateGroupEventFormComponent` / `PostAnnouncementFormComponent`. |
| `/communities/new` | `NewCommunityPage` | Create-community wizard. Composes `CreateCommunityFormComponent`. |
| `/availability` | `AvailabilityPage` | Weekly availability editor. |
| `/playdates` | `PlaydatesPage` | Playdate matching and request lists. Composes `ProposePlaydateFormComponent`. |
| `/playdates/new` | `NewPlaydatePage` | Entry route for proposing a playdate. |
| `/birthdays` | `BirthdaysPage` | Birthday party invitations page. Composes `CreateBirthdayPartyFormComponent`. |
| `/profile` | `ProfilePage` | My Profile — account, family, and settings. Composes `HeaderComponent`; delete flow via `DeleteAccountFormComponent`. |
| `/admin` | `AdminPage` | Platform admin metrics dashboard. |

Component-only POMs (no dedicated route): `pages/components/*.component.ts` — e.g. `HeaderComponent`, `ChildAvatarEditorComponent`. Hold them on the page that hosts the UI.

## Locator rules

- Locator rules: scope dialog locators to the dialog; use { exact: true } where labels
  share a prefix; act on rows and cards by accessible name; never hardcode APP_URL
  (pages use relative paths; Playwright's baseURL comes from APP_URL); shared parts
  such as the header are components a page holds — never a base class it extends;
  two-family flows use one page object instance per context.

## Known app issues

| bug key | symptom | workaround in tests |
|---------|---------|---------------------|
| | | |

add a row only when the instructor confirms a defect; mark the test with test.fail(true, '<AQPBT bug key>: <reason>').

## Output

- Output: page objects in pages/, specs in tests/ that import them. Include one short
  example POM and one spec that uses it, taken from this repo.

### Example POM (`pages/login.page.ts`)

```typescript
import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';

/** Log-in page for existing parents. */
export class LoginPage {
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly logInButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Welcome back' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.logInButton = page.getByRole('button', { name: 'Log in', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Login);
  }

  async submitLogin(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.logInButton.click();
  }
}
```

### Example spec (`tests/auth.setup.ts`)

```typescript
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages';

setup('authenticate main family', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(loginPage.heading).toBeVisible();
  await loginPage.submitLogin(
    process.env.APP_USER_EMAIL!,
    process.env.APP_USER_PASSWORD!,
  );
});
```

When new pages are added under `pages/`, extend the inventory from those files — do not invent routes or class names.
