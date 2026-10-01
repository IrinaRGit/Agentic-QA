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
    // AC5: Given the add-child form with required fields empty, when I activate Add child, then focus moves to Birth year and no new child row appears (count unchanged).
    fields: {
      firstName: '',
      birthYear: '',
      month: '',
      interests: '',
    } satisfies EmptyAddChildFormFields,
  },
] as const;

// Open question (AQPBT-5 / Confluence): AC5 says "required fields empty" but only Birth year focus was observed — Month has no [required] in the live form; whether Month or Gender must be set for a successful add is not specified in AC.
// Open question: No AC describes invalid avatar-editor or remove inputs; only add-child empty submit is in scope for negative data here.
