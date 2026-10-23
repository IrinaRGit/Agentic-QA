import { test, expect, trackRecord } from './fixtures';
import { deleteChild } from '../support/api-client';
import {
  API_CHILDREN_PATH,
  API_ME_PATH,
} from '../support/api.constants';
import { buildApiChildCreatePayload } from '../test-data/factories/api-child.factory';
import { expectPlainObject, expectTopLevelType } from './helpers/catalog-assertions';

type MeFamilyChildren = {
  family?: {
    children?: Array<{ id?: string; firstName?: string }>;
  };
};

type CreateChildResponse = {
  id?: string;
  firstName?: string;
  birthYear?: number;
  birthMonth?: number;
  age?: number;
  gender?: string;
  interests?: unknown[];
  avatarKey?: string;
};

test('POST create child, GET /me lists child, DELETE removes child @api', async ({ mainApiContext }) => {
  const payload = buildApiChildCreatePayload();

  const createResponse = await mainApiContext.post(API_CHILDREN_PATH, { data: payload });
  expect(createResponse.status()).toBe(201);

  const created: unknown = await createResponse.json();
  expectPlainObject(created);
  expectTopLevelType(created, 'id', 'string');
  expectTopLevelType(created, 'firstName', 'string');
  expectTopLevelType(created, 'birthYear', 'number');
  expectTopLevelType(created, 'birthMonth', 'number');
  expectTopLevelType(created, 'age', 'number');
  expectTopLevelType(created, 'gender', 'string');
  expectTopLevelType(created, 'interests', 'array');
  expectTopLevelType(created, 'avatarKey', 'string');

  const child = created as CreateChildResponse;
  expect(child.firstName).toBe(payload.firstName);
  const childId = child.id as string;

  trackRecord({ type: 'child', id: childId, owner: 'main' });

  const meResponse = await mainApiContext.get(API_ME_PATH);
  expect(meResponse.status()).toBe(200);
  const meBody = (await meResponse.json()) as MeFamilyChildren;
  const children = meBody.family?.children ?? [];
  expect(children.some((row) => row.id === childId && row.firstName === payload.firstName)).toBe(true);

  const deleteResult = await deleteChild(mainApiContext, childId);
  expect(deleteResult.status).toBe(204);
});
