import fs from 'fs';
import type { APIRequest, APIRequestContext } from '@playwright/test';
import { AUTH_FILE, ALT_AUTH_FILE } from './auth.constants';
import { API_CHILDREN_PATH } from './api.constants';
import { appOrigin } from './app-origin';
import type { DeleteRecordResult, RecordOwner, TrackedRecord, TrackedRecordType } from './cleanup.types';
import { readBearerTokenFromStorageState } from './storage-state';

function storageStatePathForOwner(owner: RecordOwner): string {
  return owner === 'main' ? AUTH_FILE : ALT_AUTH_FILE;
}

/** Playwright API context scoped to one family (main or alt storage state). */
export async function createApiContextForOwner(
  request: APIRequest,
  owner: RecordOwner,
): Promise<APIRequestContext> {
  const storageState = storageStatePathForOwner(owner);
  if (!fs.existsSync(storageState)) {
    throw new Error(`Storage state not found for "${owner}" family (${storageState}). Run setup or skip alt tests.`);
  }

  const token = readBearerTokenFromStorageState(storageState);
  const extraHTTPHeaders: Record<string, string> = {};
  if (token) {
    extraHTTPHeaders.Authorization = `Bearer ${token}`;
  }

  return request.newContext({
    baseURL: appOrigin(),
    storageState,
    extraHTTPHeaders,
  });
}

/** @deprecated Prefer {@link createApiContextForOwner}. */
export const createFamilyApiContext = createApiContextForOwner;

/** API context with no storage state or Authorization header. */
export async function createUnauthenticatedApiContext(request: APIRequest): Promise<APIRequestContext> {
  return request.newContext({ baseURL: appOrigin() });
}

/** DELETE /api/v1/children/:id (204 = success). */
export async function deleteChild(
  apiContext: APIRequestContext,
  id: string,
): Promise<DeleteRecordResult> {
  const response = await apiContext.delete(`${API_CHILDREN_PATH}/${encodeURIComponent(id)}`);
  const status = response.status();
  let message = response.statusText();

  if (!response.ok()) {
    const body = await response.text();
    if (body) {
      message = body.length > 300 ? `${body.slice(0, 300)}…` : body;
    }
  }

  const ok = status === 204 || status === 404;

  return {
    type: 'child',
    id,
    ok,
    status,
    message,
  };
}

/** Dispatches delete by tracked record type. */
export async function deleteTrackedRecord(
  apiContext: APIRequestContext,
  record: TrackedRecord,
): Promise<DeleteRecordResult> {
  switch (record.type) {
    case 'child':
      return deleteChild(apiContext, record.id);
  }
}

export type { TrackedRecordType };
