import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { CircleInvitePanelComponent } from './components/circle-invite-panel.component';
import { FamilyManagePanelComponent } from './components/family-manage-panel.component';
import { HeaderComponent } from './components/header.component';

/** Friends / circle list page. */
export class FriendsPage {
  readonly header: HeaderComponent;
  readonly inviteFamilyButton: Locator;
  readonly exploreCommunitiesLink: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.inviteFamilyButton = page.getByRole('button', { name: '+ Invite a family', exact: true });
    this.exploreCommunitiesLink = page.getByRole('link', {
      name: 'Explore Communities',
      exact: true,
    });
  }

  /** Open the friends page. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Friends);
  }

  /** Open manage actions for a family card by family name. */
  async openManageForFamily(familyName: string): Promise<FamilyManagePanelComponent> {
    const card = this.page.locator('div').filter({ hasText: familyName }).first();
    await card.getByRole('button', { name: 'manage', exact: true }).click();
    const panelRoot = card.filter({
      has: this.page.getByRole('button', { name: 'cancel', exact: true }),
    });
    return new FamilyManagePanelComponent(this.page, panelRoot);
  }

  /** Expand the circle invite link panel. */
  async openCircleInvite(): Promise<CircleInvitePanelComponent> {
    await this.inviteFamilyButton.click();
    const panelRoot = this.page.locator('div').filter({ hasText: 'Circle invite:' }).first();
    return new CircleInvitePanelComponent(this.page, panelRoot);
  }

  /** Start scheduling a playdate with a family. */
  async schedulePlaydateWith(familyName: string): Promise<void> {
    const card = this.page.locator('div').filter({ hasText: familyName }).first();
    await card.getByRole('button', { name: 'Schedule Playdate', exact: true }).click();
  }
}
