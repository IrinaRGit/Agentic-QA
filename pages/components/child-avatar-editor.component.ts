import { Locator, Page } from '@playwright/test';
import { AVATAR_EDITOR_GENDER_LABELS, CHILD_AVATAR_ICONS } from '../../test-data/factories/child.factory';

/** Inline avatar editor under a child row on `/app`. */
export class ChildAvatarEditorComponent {
  readonly doneButton: Locator;
  readonly genderCombobox: Locator;

  constructor(private readonly page: Page) {
    this.doneButton = page.getByRole('button', { name: 'done', exact: true });
    this.genderCombobox = page
      .getByRole('combobox')
      .filter({ has: page.getByRole('option', { name: 'Prefer not to say', exact: true }) })
      .first();
  }

  /**
   * Avatar icon in the open editor (first matching control while the add-child form also exposes icons).
   */
  iconButton(name: (typeof CHILD_AVATAR_ICONS)[number]): Locator {
    return this.page.getByRole('button', { name, exact: true }).first();
  }

  /** Whether the editor surface (`done`) is visible. */
  async isOpen(): Promise<boolean> {
    return this.doneButton.isVisible();
  }

  /** Close the editor without picking a new icon. */
  async finishWithoutChanges(): Promise<void> {
    await this.doneButton.click();
  }

  /** Expand the gender listbox in the avatar editor. */
  async openGenderOptions(): Promise<void> {
    await this.genderCombobox.click();
  }

  /** Gender `<option>` in the avatar editor `<select>`. */
  genderOption(label: (typeof AVATAR_EDITOR_GENDER_LABELS)[number]): Locator {
    return this.genderCombobox.locator('option', { hasText: label });
  }
}
