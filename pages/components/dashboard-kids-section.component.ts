import { Locator, Page } from '@playwright/test';
import { ChildAvatarEditorComponent } from './child-avatar-editor.component';

/** Practicum seed child summary lines on `/app` (Confluence / AQPBT-5). */
export const DASHBOARD_SEED_CHILD_SUMMARIES = {
  mia: 'Mia, 7 · Girl',
  maria: 'Maria, 7 · Girl',
} as const;

/** Family block: child rows, stats, and inline manage actions on `/app`. */
export class DashboardKidsSectionComponent {
  readonly myKidsLabel: Locator;
  private readonly familyBlockRoot: Locator;

  constructor(private readonly page: Page) {
    this.myKidsLabel = page.getByText('My Kids', { exact: true });
    this.familyBlockRoot = page
      .locator('div')
      .filter({ has: page.getByText('The Gorfels', { exact: true }) })
      .filter({ has: page.getByRole('button', { name: 'Add child', exact: true }) })
      .first();
  }

  /** Family name heading in the kids block (e.g. The Gorfels). */
  familyName(name: string): Locator {
    return this.familyBlockRoot.getByText(name, { exact: true });
  }

  /** Parent display name in the kids block (e.g. Lev Test). */
  parentDisplayName(name: string): Locator {
    return this.familyBlockRoot.locator('span.muted', { hasText: name });
  }

  /** Summary line for a child (`{name}, {age} · {Boy|Girl}`). */
  childSummaryLine(summary: string): Locator {
    return this.page.getByText(summary, { exact: true });
  }

  /** Summary line located by the child's first name (with or without gender suffix). */
  childSummaryForFirstName(firstName: string): Locator {
    return this.page.getByText(new RegExp(`^${firstName}, \\d+`));
  }

  /** Interest tag on a child row. */
  childInterestTag(label: string): Locator {
    return this.page.getByText(label, { exact: true });
  }

  /** Change avatar for the nth child row (0 = first listed child). */
  changeAvatarButtonByIndex(index: number): Locator {
    return this.familyBlockRoot.getByRole('button', { name: 'Change avatar', exact: true }).nth(index);
  }

  /** Remove control for the nth child row (0 = first listed child). */
  removeButtonByIndex(index: number): Locator {
    return this.familyBlockRoot.getByRole('button', { name: 'remove', exact: true }).nth(index);
  }

  /** Remove control for the last listed child (newly appended rows). */
  lastChildRemoveButton(): Locator {
    return this.familyBlockRoot.getByRole('button', { name: 'remove', exact: true }).last();
  }

  /** Locators for the open inline avatar editor on `/app`. */
  avatarEditorPanel(): ChildAvatarEditorComponent {
    return new ChildAvatarEditorComponent(this.page);
  }

  /** Numeric value shown in the My Kids stat. */
  async myKidsCount(): Promise<number> {
    const block = this.myKidsLabel.locator('..');
    const text = (await block.innerText()).trim();
    const match = text.match(/^(\d+)/);
    if (!match) {
      throw new Error(`Could not parse My Kids count from: ${text}`);
    }
    return Number.parseInt(match[1], 10);
  }

  /** Count child rows that expose remove actions in the family block. */
  async listedChildRowCount(): Promise<number> {
    return this.familyBlockRoot.getByRole('button', { name: 'remove', exact: true }).count();
  }

  /** Page-level confirm/cancel dialog from remove (expected absent). */
  confirmDialog(): Locator {
    return this.page.getByRole('dialog');
  }
}
