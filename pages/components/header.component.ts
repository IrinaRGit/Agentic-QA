import { Locator, Page } from '@playwright/test';
/** Shared sidebar navigation and top toolbar on signed-in BuddyTime pages. */
export class HeaderComponent {
  readonly sidebar: Locator;
  readonly navigation: Locator;
  readonly brandName: Locator;
  readonly userLocation: Locator;

  readonly dashboardLink: Locator;
  readonly calendarLink: Locator;
  readonly friendsLink: Locator;
  readonly communitiesLink: Locator;
  readonly availabilityLink: Locator;
  readonly playdatesLink: Locator;
  readonly birthdaysLink: Locator;
  readonly discoverButton: Locator;
  readonly myProfileLink: Locator;
  readonly adminLink: Locator;
  readonly goPremiumButton: Locator;

  readonly topBanner: Locator;
  readonly menuButton: Locator;
  readonly notificationsButton: Locator;
  readonly logOutButton: Locator;
  readonly closeMenuButton: Locator;

  constructor(private readonly page: Page) {
    this.sidebar = page.getByRole('complementary');
    this.navigation = page.getByRole('navigation');
    this.brandName = this.sidebar.getByText('BuddyTime', { exact: true });
    this.userLocation = this.sidebar.getByText(/Thornhill beta/);

    this.dashboardLink = this.navigation.getByRole('link', { name: 'Dashboard' });
    this.calendarLink = this.navigation.getByRole('link', { name: 'Calendar' });
    this.friendsLink = this.navigation.getByRole('link', { name: 'Friends' });
    this.communitiesLink = this.navigation.getByRole('link', { name: 'Communities' });
    this.availabilityLink = this.navigation.getByRole('link', { name: 'Availability' });
    this.playdatesLink = this.navigation.getByRole('link', { name: 'Playdates' });
    this.birthdaysLink = this.navigation.getByRole('link', { name: 'Birthdays' });
    this.discoverButton = this.navigation.getByRole('button', { name: 'Discover', exact: true });
    this.myProfileLink = this.navigation.getByRole('link', { name: 'My Profile' });
    this.adminLink = this.navigation.getByRole('link', { name: 'Admin' });
    this.goPremiumButton = this.sidebar.getByRole('button', { name: /Go Premium/ });

    this.topBanner = page.getByRole('banner');
    this.menuButton = this.topBanner.getByRole('button', { name: 'Menu', exact: true });
    this.notificationsButton = this.topBanner.getByRole('button', {
      name: 'Notifications',
      exact: true,
    });
    this.logOutButton = this.topBanner.getByRole('button', { name: 'Log out', exact: true });
    this.closeMenuButton = page.getByRole('button', { name: 'Close menu', exact: true });
  }

  /** Open the mobile sidebar overlay. */
  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  /** Dismiss the mobile sidebar overlay. */
  async closeMenu(): Promise<void> {
    await this.closeMenuButton.click();
  }

  /** Open the notifications control in the top toolbar. */
  async openNotifications(): Promise<void> {
    await this.notificationsButton.click();
  }

  /** Sign out from the top toolbar. */
  async logOut(): Promise<void> {
    await this.logOutButton.click();
  }

  /** Navigate to the dashboard via sidebar. */
  async gotoDashboard(): Promise<void> {
    await this.dashboardLink.click();
  }

  /** Navigate to calendar via sidebar. */
  async gotoCalendar(): Promise<void> {
    await this.calendarLink.click();
  }

  /** Navigate to friends via sidebar. */
  async gotoFriends(): Promise<void> {
    await this.friendsLink.click();
  }

  /** Navigate to communities via sidebar. */
  async gotoCommunities(): Promise<void> {
    await this.communitiesLink.click();
  }

  /** Navigate to availability via sidebar. */
  async gotoAvailability(): Promise<void> {
    await this.availabilityLink.click();
  }

  /** Navigate to playdates via sidebar. */
  async gotoPlaydates(): Promise<void> {
    await this.playdatesLink.click();
  }

  /** Navigate to birthdays via sidebar. */
  async gotoBirthdays(): Promise<void> {
    await this.birthdaysLink.click();
  }

  /** Navigate to profile via sidebar. */
  async gotoProfile(): Promise<void> {
    await this.myProfileLink.click();
  }

  /** Navigate to admin via sidebar. */
  async gotoAdmin(): Promise<void> {
    await this.adminLink.click();
  }

  /** Activate Discover in the sidebar. */
  async openDiscover(): Promise<void> {
    await this.discoverButton.click();
  }

  /** Open the Go Premium upsell card in the sidebar. */
  async openGoPremium(): Promise<void> {
    await this.goPremiumButton.click();
  }
}
