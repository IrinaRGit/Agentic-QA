import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { HeaderComponent } from './components/header.component';

/** Communities list page. */
export class CommunitiesPage {
  readonly header: HeaderComponent;
  readonly heading: Locator;
  readonly createGroupLink: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.heading = page.getByRole('heading', { name: 'Your communities', exact: true });
    this.createGroupLink = page.getByRole('link', { name: '+ Create group', exact: true });
  }

  /** Open the communities list. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Communities);
  }

  /** Open a community by its visible name. */
  async openCommunity(name: string): Promise<void> {
    await this.page.getByRole('link', { name: new RegExp(name) }).click();
  }
}
