import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { HeaderComponent } from './components/header.component';

/** Platform admin metrics dashboard. */
export class AdminPage {
  readonly header: HeaderComponent;
  readonly refreshButton: Locator;
  readonly parentsSignedUpCard: Locator;
  readonly latestSignUpsTable: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.refreshButton = page.getByRole('button', { name: 'Refresh', exact: true });
    this.parentsSignedUpCard = page.getByText('Parents signed up', { exact: true });
    this.latestSignUpsTable = page.getByRole('table');
  }

  /** Open the admin dashboard. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Admin);
  }

  /** Reload admin metrics. */
  async refresh(): Promise<void> {
    await this.refreshButton.click();
  }
}
