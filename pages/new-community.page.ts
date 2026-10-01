import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { CreateCommunityFormComponent } from './components/create-community-form.component';
import { HeaderComponent } from './components/header.component';

/** Create-community wizard at /communities/new. */
export class NewCommunityPage {
  readonly header: HeaderComponent;
  readonly backLink: Locator;
  readonly createCommunityForm: CreateCommunityFormComponent;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.backLink = page.getByRole('link', { name: '← Back to communities', exact: true });
    const formRoot = page.locator('div').filter({ hasText: 'Create a community' }).first();
    this.createCommunityForm = new CreateCommunityFormComponent(page, formRoot);
  }

  /** Open the create-community form. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.NewCommunity);
  }
}
