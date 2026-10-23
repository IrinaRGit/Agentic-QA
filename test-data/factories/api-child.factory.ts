/** POST /api/v1/children body fields from api/CATALOG.md. */
export type ApiChildCreatePayload = {
  firstName: string;
  birthYear: number;
  birthMonth: number;
  gender: string;
  avatarKey: string;
  interests: string[];
};

/** Unique create-child payload for API tests (`Date.now()` suffix). */
export function buildApiChildCreatePayload(
  overrides: Partial<ApiChildCreatePayload> = {},
): ApiChildCreatePayload {
  const suffix = Date.now();
  return {
    firstName: `ApiKid${suffix}`,
    birthYear: 2016,
    birthMonth: 6,
    gender: 'boy',
    avatarKey: 'fox',
    interests: ['api-catalog'],
    ...overrides,
  };
}
