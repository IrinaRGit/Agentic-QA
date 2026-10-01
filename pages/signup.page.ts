import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';

/** Parent sign-up registration page. */
export class SignupPage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly logInLink: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Create your account' });
    this.nameInput = page.getByRole('textbox', { name: 'Your name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password (8+ characters)' });
    this.signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
    this.logInLink = page.getByRole('link', { name: 'Log in', exact: true });
    this.termsLink = page.getByRole('link', { name: 'Terms of Service', exact: true });
    this.privacyLink = page.getByRole('link', { name: 'Privacy Policy', exact: true });
  }

  /** Open the sign-up page. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Signup);
  }

  /** Fill the registration form (does not submit). */
  async fillRegistration(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /** Submit the registration form. */
  async submitSignUp(): Promise<void> {
    await this.signUpButton.click();
  }
}
