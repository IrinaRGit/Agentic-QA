import { test, expect } from './fixtures';
import {
  API_COMMUNITIES_PATH,
  CATALOG_UNAUTHENTICATED_GET_STATUS,
  communityByIdPath,
} from '../support/api.constants';
import {
  expectCatalogJsonContentType,
  expectPlainObject,
  expectTopLevelType,
} from './helpers/catalog-assertions';

test('GET /api/v1/communities matches catalog contract @api', async ({
  mainApiContext,
  unauthenticatedApiContext,
}) => {
  const response = await mainApiContext.get(API_COMMUNITIES_PATH);
  expect(response.status()).toBe(200);
  expectCatalogJsonContentType(response.headers()['content-type']);

  const body: unknown = await response.json();
  expect(Array.isArray(body)).toBe(true);

  const unauth = await unauthenticatedApiContext.get(API_COMMUNITIES_PATH);
  expect(unauth.status()).toBe(CATALOG_UNAUTHENTICATED_GET_STATUS);
  expectCatalogJsonContentType(unauth.headers()['content-type']);
});

test('GET /api/v1/communities/{id} matches catalog contract @api', async ({
  mainApiContext,
  unauthenticatedApiContext,
}) => {
  const listResponse = await mainApiContext.get(API_COMMUNITIES_PATH);
  expect(listResponse.status()).toBe(200);
  const listBody: unknown = await listResponse.json();
  expect(Array.isArray(listBody)).toBe(true);

  const first = listBody[0];
  expectPlainObject(first);
  expectTopLevelType(first, 'id', 'string');
  const communityId = first.id as string;

  const response = await mainApiContext.get(communityByIdPath(communityId));
  expect(response.status()).toBe(200);
  expectCatalogJsonContentType(response.headers()['content-type']);

  const body: unknown = await response.json();
  expectPlainObject(body);
  expectTopLevelType(body, 'id', 'string');
  expectTopLevelType(body, 'name', 'string');
  expectTopLevelType(body, 'type', 'string');
  expectTopLevelType(body, 'description', 'string');
  expectTopLevelType(body, 'myRole', 'string');
  expectTopLevelType(body, 'myStatus', 'string');
  expectTopLevelType(body, 'familiesCount', 'number');
  expectTopLevelType(body, 'pendingCount', 'number');
  expectTopLevelType(body, 'createdAt', 'string');
  expectTopLevelType(body, 'members', 'array');

  const unauth = await unauthenticatedApiContext.get(communityByIdPath(communityId));
  expect(unauth.status()).toBe(CATALOG_UNAUTHENTICATED_GET_STATUS);
  expectCatalogJsonContentType(unauth.headers()['content-type']);
});
