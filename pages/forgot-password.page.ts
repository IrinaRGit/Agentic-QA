import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';

/** Forgot-password / reset-link request page. */
export class ForgotPasswordPage {
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly sendResetLinkButton: Locator;
  readonly backToLogInLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Reset your password' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.sendResetLinkButton = page.getByRole('button', { name: 'Send reset link', exact: true });
    this.backToLogInLink = page.getByRole('link', { name: '← Back to log in', exact: true });
  }

  /** Open the forgot-password page. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.ForgotPassword);
  }

  /** Fill the email field (does not submit). */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }
}
