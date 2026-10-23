import { test, expect } from './fixtures';
import {
  API_ME_PATH,
  CATALOG_UNAUTHENTICATED_GET_STATUS,
} from '../support/api.constants';
import {
  expectCatalogJsonContentType,
  expectPlainObject,
  expectTopLevelType,
} from './helpers/catalog-assertions';

test('GET /api/v1/me matches catalog contract @api', async ({
  mainApiContext,
  unauthenticatedApiContext,
}) => {
  const response = await mainApiContext.get(API_ME_PATH);
  expect(response.status()).toBe(200);
  expectCatalogJsonContentType(response.headers()['content-type']);

  const body: unknown = await response.json();
  expectPlainObject(body);
  expectTopLevelType(body, 'parent', 'object');
  expectTopLevelType(body, 'family', 'object');
  expectTopLevelType(body, 'isAdmin', 'boolean');

  const unauth = await unauthenticatedApiContext.get(API_ME_PATH);
  expect(unauth.status()).toBe(CATALOG_UNAUTHENTICATED_GET_STATUS);
  expectCatalogJsonContentType(unauth.headers()['content-type']);
});
