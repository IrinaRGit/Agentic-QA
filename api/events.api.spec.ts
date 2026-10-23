import { test, expect } from './fixtures';
import {
  API_EVENTS_PATH,
  CATALOG_UNAUTHENTICATED_GET_STATUS,
} from '../support/api.constants';
import {
  expectCatalogJsonContentType,
  expectPlainObject,
  expectTopLevelType,
} from './helpers/catalog-assertions';

function expectNullableString(value: unknown): void {
  expect(value === null || typeof value === 'string').toBe(true);
}

test('GET /api/v1/events matches catalog contract @api', async ({ mainApiContext }) => {
  const response = await mainApiContext.get(API_EVENTS_PATH);
  expect(response.status()).toBe(200);
  expectCatalogJsonContentType(response.headers()['content-type']);

  const body: unknown = await response.json();
  expect(Array.isArray(body)).toBe(true);

  if (body.length > 0) {
    const first = body[0];
    expectPlainObject(first);
    expectTopLevelType(first, 'id', 'string');
    expectTopLevelType(first, 'kind', 'string');
    expectTopLevelType(first, 'title', 'string');
    expect(first).toHaveProperty('childId');
    expectNullableString(first.childId);
    expect(first).toHaveProperty('childName');
    expectNullableString(first.childName);
    expectTopLevelType(first, 'startsAt', 'string');
    expect(first).toHaveProperty('endsAt');
    expectNullableString(first.endsAt);
    expectTopLevelType(first, 'venueText', 'string');
    expectTopLevelType(first, 'details', 'string');
    expectTopLevelType(first, 'cardKey', 'string');
    expectTopLevelType(first, 'status', 'string');
    expect(first).toHaveProperty('communityId');
    expectNullableString(first.communityId);
    expect(first).toHaveProperty('communityName');
    expectNullableString(first.communityName);
    expectTopLevelType(first, 'rsvpToken', 'string');
    expectTopLevelType(first, 'counts', 'object');
    expectTopLevelType(first.counts as Record<string, unknown>, 'yes', 'number');
    expectTopLevelType(first.counts as Record<string, unknown>, 'no', 'number');
    expectTopLevelType(first.counts as Record<string, unknown>, 'maybe', 'number');
    expectTopLevelType(first.counts as Record<string, unknown>, 'guestsComing', 'number');
    expectTopLevelType(first, 'createdAt', 'string');
    expectTopLevelType(first, 'canManage', 'boolean');
  }
});

test('GET /api/v1/events without token returns catalog unauthorized status @api', async ({
  unauthenticatedApiContext,
}) => {
  const unauth = await unauthenticatedApiContext.get(API_EVENTS_PATH);
  expect(unauth.status()).toBe(CATALOG_UNAUTHENTICATED_GET_STATUS);
  expectCatalogJsonContentType(unauth.headers()['content-type']);
});
