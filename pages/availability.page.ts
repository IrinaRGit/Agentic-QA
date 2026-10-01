import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { HeaderComponent } from './components/header.component';

/** Weekly availability editor. */
export class AvailabilityPage {
  readonly header: HeaderComponent;
  readonly heading: Locator;
  readonly weekendAfternoonsPreset: Locator;
  readonly addSlotButton: Locator;
  readonly saveAvailabilityButton: Locator;
  readonly addExceptionButton: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.heading = page.getByRole('heading', { name: 'Set your weekly free time', exact: true });
    this.weekendAfternoonsPreset = page.getByRole('button', {
      name: 'Weekend afternoons',
      exact: true,
    });
    this.addSlotButton = page.getByRole('button', { name: '+ Add slot', exact: true });
    this.saveAvailabilityButton = page.getByRole('button', {
      name: 'Save availability',
      exact: true,
    });
    this.addExceptionButton = page.getByRole('button', { name: 'Add exception', exact: true });
  }

  /** Open availability settings. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Availability);
  }

  /** Apply the “Weekend afternoons” quick preset. */
  async applyWeekendAfternoonsPreset(): Promise<void> {
    await this.weekendAfternoonsPreset.click();
  }
}
