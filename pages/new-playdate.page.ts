import { Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { PlaydatesPage } from './playdates.page';

/** Entry route for proposing a playdate (/playdates/new). */
export class NewPlaydatePage {
  readonly playdates: PlaydatesPage;

  constructor(private readonly page: Page) {
    this.playdates = new PlaydatesPage(page);
  }

  /** Open the new-playdate flow (same UI as Playdates). */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.NewPlaydate);
  }
}
