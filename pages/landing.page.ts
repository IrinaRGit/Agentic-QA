import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';

/** Public marketing landing page. */
export class LandingPage {
  readonly tagline: Locator;
  readonly getStartedLink: Locator;
  readonly logInLink: Locator;
  readonly privacyLink: Locator;
  readonly termsLink: Locator;

  constructor(private readonly page: Page) {
    this.tagline = page.getByText(
      'See when your kids\' friends are free — and book a playdate in three taps.',
    );
    this.getStartedLink = page.getByRole('link', { name: 'Get started', exact: true });
    this.logInLink = page.getByRole('link', { name: 'Log in', exact: true });
    this.privacyLink = page.getByRole('link', { name: 'Privacy', exact: true });
    this.termsLink = page.getByRole('link', { name: 'Terms', exact: true });
  }

  /** Open the public landing page. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Landing);
  }

  /** Navigate to sign up via “Get started”. */
  async openSignUp(): Promise<void> {
    await this.getStartedLink.click();
  }

  /** Navigate to log in. */
  async openLogIn(): Promise<void> {
    await this.logInLink.click();
  }
}
