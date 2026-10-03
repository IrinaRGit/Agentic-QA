import { Locator, Page } from '@playwright/test';
import type {
  AddChildFormPayload,
  AddChildInterestChip,
  ChildAvatarIcon,
} from '../../test-data/factories/child.factory';

/** Inline “add child” form on the dashboard kids section. */
export class AddChildFormComponent {
  readonly formRoot: Locator;
  readonly firstNameInput: Locator;
  readonly birthYearInput: Locator;
  readonly monthInput: Locator;
  readonly interestsInput: Locator;
  readonly genderCombobox: Locator;
  readonly addChildButton: Locator;

  constructor(page: Page, formRoot: Locator) {
    this.formRoot = formRoot;
    this.firstNameInput = formRoot.getByRole('textbox', { name: "Child's first name" });
    this.birthYearInput = formRoot.getByRole('spinbutton', { name: 'Birth year' });
    this.monthInput = formRoot.getByRole('spinbutton', { name: 'Month' });
    this.interestsInput = formRoot.getByRole('textbox', { name: 'Interests (comma-separated)' });
    this.genderCombobox = formRoot.getByRole('combobox', { name: 'Gender' });
    this.addChildButton = formRoot.getByRole('button', { name: 'Add child', exact: true });
  }

  /** Avatar icon button on the add-child form. */
  avatarIconButton(name: ChildAvatarIcon): Locator {
    return this.formRoot.getByRole('button', { name, exact: true });
  }

  /** Pick an avatar icon for the new child. */
  async selectAvatar(name: ChildAvatarIcon): Promise<void> {
    await this.avatarIconButton(name).click();
  }

  /** Submit the new child profile. */
  async submit(): Promise<void> {
    await this.addChildButton.click();
  }

  /** Interest shortcut chip (includes leading `+`). */
  interestChip(label: AddChildInterestChip): Locator {
    return this.formRoot.getByRole('button', { name: label, exact: true });
  }

  /** Activate an interest shortcut chip. */
  async clickInterestChip(label: AddChildInterestChip): Promise<void> {
    await this.interestChip(label).click();
  }

  /** Fill the add-child form from a factory payload. */
  async fillPayload(payload: AddChildFormPayload): Promise<void> {
    await this.firstNameInput.fill(payload.firstName);
    await this.birthYearInput.fill(String(payload.birthYear));
    await this.monthInput.fill(String(payload.month));
    await this.interestsInput.fill(payload.interests);
    await this.genderCombobox.selectOption(payload.gender);
    await this.selectAvatar(payload.avatarIcon);
  }

  /** Selected gender option on the add-child `<select>`. */
  selectedGenderOption(): Locator {
    return this.genderCombobox.locator('option:checked');
  }

  /** Clear text/spinbutton fields (does not change gender default). */
  async clearTextFields(): Promise<void> {
    await this.firstNameInput.fill('');
    await this.birthYearInput.fill('');
    await this.monthInput.fill('');
    await this.interestsInput.fill('');
  }
}
