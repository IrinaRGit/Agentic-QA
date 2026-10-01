import { faker } from '@faker-js/faker';

/** Avatar icon buttons on add-child form and avatar editor (live `/app`, AQPBT-5 AC2). */
export const CHILD_AVATAR_ICONS = [
  'Fox',
  'Dino',
  'Robot',
  'Cat',
  'Penguin',
  'Unicorn',
  'Bear',
  'Bunny',
  'Frog',
  'Owl',
  'Lion',
  'Panda',
  'Whale',
  'Ladybug',
  'Rocket',
  'Ball',
] as const;

/** Union of dashboard avatar icon button labels. */
export type ChildAvatarIcon = (typeof CHILD_AVATAR_ICONS)[number];

/** Gender combobox labels on the add-child form (default **Gender: prefer not to say**). */
export const ADD_CHILD_GENDER_LABELS = [
  'Gender: prefer not to say',
  'Boy',
  'Girl',
] as const;

/** Gender label selected on the add-child form combobox. */
export type AddChildGenderLabel = (typeof ADD_CHILD_GENDER_LABELS)[number];

/** Gender combobox labels in the avatar editor (AQPBT-5 AC2). */
export const AVATAR_EDITOR_GENDER_LABELS = ['Prefer not to say', 'Boy', 'Girl'] as const;

/** Gender label selected in the avatar editor combobox. */
export type AvatarEditorGenderLabel = (typeof AVATAR_EDITOR_GENDER_LABELS)[number];

/** Interest shortcut chips on the add-child form (AQPBT-5 AC1 / AC4). */
export const ADD_CHILD_INTEREST_CHIPS = [
  '+ LEGO',
  '+ Minecraft',
  '+ Soccer',
  '+ Art',
  '+ Reading',
  '+ Dance',
  '+ Hockey',
  '+ Crafts',
] as const;

/** Label on an add-child interest shortcut button (includes leading `+`). */
export type AddChildInterestChip = (typeof ADD_CHILD_INTEREST_CHIPS)[number];

/** Values for the dashboard add-child form (`Child's first name`, spinbuttons, etc.). */
export type AddChildFormPayload = {
  firstName: string;
  birthYear: number;
  month: number;
  interests: string;
  gender: AddChildGenderLabel;
  avatarIcon: ChildAvatarIcon;
};

/** Values applied in the inline avatar editor for an existing child row. */
export type ChildAvatarUpdatePayload = {
  avatarIcon: ChildAvatarIcon;
  gender: AvatarEditorGenderLabel;
};

/** Builds a unique add-child payload for `/app` (Faker + `Date.now()`). */
export function buildAddChildPayload(overrides: Partial<AddChildFormPayload> = {}): AddChildFormPayload {
  const suffix = Date.now();
  const birthYear = faker.number.int({ min: 2012, max: 2020 });

  return {
    firstName: `Kid${faker.person.firstName()}${suffix}`.replace(/\s+/g, ''),
    birthYear,
    month: faker.number.int({ min: 1, max: 12 }),
    interests: faker.helpers.arrayElement(['drawing', 'lego', 'soccer', 'art', 'reading']),
    gender: faker.helpers.arrayElement([...ADD_CHILD_GENDER_LABELS]),
    avatarIcon: faker.helpers.arrayElement([...CHILD_AVATAR_ICONS]),
    ...overrides,
  };
}

/** Builds a unique avatar/gender update for an existing child on `/app`. */
export function buildChildAvatarUpdatePayload(
  overrides: Partial<ChildAvatarUpdatePayload> = {},
): ChildAvatarUpdatePayload {
  return {
    avatarIcon: faker.helpers.arrayElement([...CHILD_AVATAR_ICONS]),
    gender: faker.helpers.arrayElement([...AVATAR_EDITOR_GENDER_LABELS]),
    ...overrides,
  };
}
