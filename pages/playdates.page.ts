import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { ProposePlaydateFormComponent } from './components/propose-playdate-form.component';
import { HeaderComponent } from './components/header.component';

/** Playdate matching and request lists. */
export class PlaydatesPage {
  readonly header: HeaderComponent;
  readonly heading: Locator;
  readonly proposePlaydateForm: ProposePlaydateFormComponent;
  readonly pendingRequestsSection: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.heading = page.getByRole('heading', { name: 'Find a playdate', exact: true });
    const formRoot = page.locator('div').filter({ hasText: 'Propose' }).first();
    this.proposePlaydateForm = new ProposePlaydateFormComponent(page, formRoot);
    this.pendingRequestsSection = page.getByText('Pending requests', { exact: true });
  }

  /** Open the playdates page. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Playdates);
  }

  /** Cancel a pending request row by family name. */
  async cancelPendingRequestFor(familyName: string): Promise<void> {
    const row = this.page.locator('div').filter({ hasText: familyName }).first();
    await row.getByRole('button', { name: 'cancel', exact: true }).click();
  }
}
