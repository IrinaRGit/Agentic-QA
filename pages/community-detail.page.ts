import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { CreateGroupEventFormComponent } from './components/create-group-event-form.component';
import { PostAnnouncementFormComponent } from './components/post-announcement-form.component';
import { HeaderComponent } from './components/header.component';

/** Single community detail (members, events, announcements). */
export class CommunityDetailPage {
  readonly header: HeaderComponent;
  readonly backLink: Locator;
  readonly communityHeading: Locator;
  readonly inviteFamiliesButton: Locator;
  readonly copyInviteLinkButton: Locator;
  readonly membersTab: Locator;
  readonly eventsTab: Locator;
  readonly announcementsTab: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.backLink = page.getByRole('link', { name: '← All communities', exact: true });
    this.communityHeading = page.getByRole('heading', { level: 2 });
    this.inviteFamiliesButton = page.getByRole('button', { name: 'Invite families', exact: true });
    this.copyInviteLinkButton = page.getByRole('button', { name: 'Copy invite link', exact: true });
    this.membersTab = page.getByRole('tab', { name: 'Members', exact: true });
    this.eventsTab = page.getByRole('tab', { name: 'Events', exact: true });
    this.announcementsTab = page.getByRole('tab', { name: 'Announcements', exact: true });
  }

  /** Open the explored Maple Class community. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.CommunityDetail);
  }

  /** Switch to the Events tab. */
  async openEventsTab(): Promise<CreateGroupEventFormComponent> {
    await this.eventsTab.click();
    const formRoot = this.page.locator('div').filter({ hasText: 'Create a group event' }).first();
    return new CreateGroupEventFormComponent(this.page, formRoot);
  }

  /** Switch to the Announcements tab. */
  async openAnnouncementsTab(): Promise<PostAnnouncementFormComponent> {
    await this.announcementsTab.click();
    const formRoot = this.page.locator('div').filter({ hasText: 'New announcement' }).first();
    return new PostAnnouncementFormComponent(this.page, formRoot);
  }

  /** Copy the group invite link (from Members tab). */
  async copyGroupInviteLink(): Promise<void> {
    await this.copyInviteLinkButton.click();
  }
}
