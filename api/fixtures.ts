import type { APIRequestContext } from '@playwright/test';
import { test as cleanupTest } from '../fixtures/cleanup.fixture';
import {
  createApiContextForOwner,
  createUnauthenticatedApiContext,
} from '../support/api-client';

type ApiFixtures = {
  mainApiContext: APIRequestContext;
  altApiContext: APIRequestContext;
  unauthenticatedApiContext: APIRequestContext;
};

export const test = cleanupTest.extend<ApiFixtures>({
  mainApiContext: async ({ playwright }, use) => {
    const context = await createApiContextForOwner(playwright.request, 'main');
    await use(context);
    await context.dispose();
  },

  altApiContext: async ({ playwright }, use) => {
    const context = await createApiContextForOwner(playwright.request, 'alt');
    await use(context);
    await context.dispose();
  },

  unauthenticatedApiContext: async ({ playwright }, use) => {
    const context = await createUnauthenticatedApiContext(playwright.request);
    await use(context);
    await context.dispose();
  },
});

export { expect } from '../fixtures/cleanup.fixture';
export { trackRecord } from '../fixtures/cleanup.fixture';
