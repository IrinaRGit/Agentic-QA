import { test, expect } from './fixtures';
import {
  API_CONNECTIONS_PATH,
  CATALOG_UNAUTHENTICATED_GET_STATUS,
} from '../support/api.constants';
import { expectCatalogJsonContentType } from './helpers/catalog-assertions';

test('GET /api/v1/connections matches catalog contract @api', async ({
  mainApiContext,
  unauthenticatedApiContext,
}) => {
  const response = await mainApiContext.get(API_CONNECTIONS_PATH);
  expect(response.status()).toBe(200);
  expectCatalogJsonContentType(response.headers()['content-type']);

  const body: unknown = await response.json();
  expect(Array.isArray(body)).toBe(true);

  const unauth = await unauthenticatedApiContext.get(API_CONNECTIONS_PATH);
  expect(unauth.status()).toBe(CATALOG_UNAUTHENTICATED_GET_STATUS);
  expectCatalogJsonContentType(unauth.headers()['content-type']);
});
