import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { AddChildFormComponent } from './components/add-child-form.component';
import { CircleInvitePanelComponent } from './components/circle-invite-panel.component';
import { CoParentInvitePanelComponent } from './components/co-parent-invite-panel.component';
import { HeaderComponent } from './components/header.component';

/** Signed-in home dashboard (/app). */
export class DashboardPage {
  readonly header: HeaderComponent;
  readonly greetingHeading: Locator;
  readonly findPlaydateLink: Locator;
  readonly inviteFamilyButton: Locator;
  readonly inviteCoParentButton: Locator;
  readonly enablePushRemindersButton: Locator;
  readonly installAppButton: Locator;
  readonly addChildForm: AddChildFormComponent;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.greetingHeading = page.getByRole('heading', { level: 2 });
    this.findPlaydateLink = page.getByRole('link', { name: 'Find a Playdate', exact: true });
    this.inviteFamilyButton = page.getByRole('button', { name: '+ Invite a family', exact: true });
    this.inviteCoParentButton = page.getByRole('button', { name: 'Invite co-parent', exact: true });
    this.enablePushRemindersButton = page.getByRole('button', {
      name: 'Enable push reminders',
      exact: true,
    });
    this.installAppButton = page.getByRole('button', { name: 'Install app', exact: true });
    const addChildRoot = page.getByRole('button', { name: 'Add child', exact: true }).locator('..');
    this.addChildForm = new AddChildFormComponent(page, addChildRoot);
  }

  /** Open the dashboard. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Dashboard);
  }

  /** Expand the circle invite link panel. */
  async openCircleInvite(): Promise<CircleInvitePanelComponent> {
    await this.inviteFamilyButton.click();
    const panelRoot = this.page.locator('div').filter({ hasText: 'Circle invite:' }).first();
    return new CircleInvitePanelComponent(this.page, panelRoot);
  }

  /** Expand the co-parent invite link panel. */
  async openCoParentInvite(): Promise<CoParentInvitePanelComponent> {
    await this.inviteCoParentButton.click();
    const panelRoot = this.page.locator('div').filter({ hasText: 'Co-parent invite:' }).first();
    return new CoParentInvitePanelComponent(this.page, panelRoot);
  }
}
