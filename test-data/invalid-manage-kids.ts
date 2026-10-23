/** Cleared add-child text/spinbutton values for negative submit tests. */
export type EmptyAddChildFormFields = {
  firstName: '';
  birthYear: '';
  month: '';
  interests: '';
};

/** AQPBT-5 negative add-child cases (one entry per described invalid input). */
export const invalidManageKidsAddChildInputs = [
  {
    // AC5: Empty required fields → Add child → HTML5 focus on Child's first name; no new row (count unchanged).
    fields: {
      firstName: '',
      birthYear: '',
      month: '',
      interests: '',
    } satisfies EmptyAddChildFormFields,
  },
  {
    // Confluence partial fill: first name + + LEGO, no birth year — child must not be created.
    fields: {
      firstName: 'PartialProbe',
      birthYear: '',
      month: '',
      interests: '',
    },
    clickLegoChip: true,
    expectedInterestsAfterChip: 'LEGO',
  },
] as const;

// Open question (AQPBT-5 / Confluence): Month has no [required] in the live form; whether Month or Gender must be set for a successful add is not specified in AC.
// Open question: No AC describes invalid avatar-editor or remove inputs; only add-child empty submit is in scope for negative data here.
