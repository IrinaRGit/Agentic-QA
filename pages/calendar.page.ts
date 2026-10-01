import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { HeaderComponent } from './components/header.component';

/** Family calendar view. */
export class CalendarPage {
  readonly header: HeaderComponent;
  readonly subtitle: Locator;
  readonly thisWeekSection: Locator;
  readonly birthdaysSection: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.subtitle = page.getByText('Your family calendar', { exact: true });
    this.thisWeekSection = page.getByText('This week', { exact: true });
    this.birthdaysSection = page.getByText('🎂 Birthdays this month', { exact: true });
  }

  /** Open the calendar page. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Calendar);
  }
}
