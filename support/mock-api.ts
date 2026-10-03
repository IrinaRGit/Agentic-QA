import type { Page, Route } from '@playwright/test';
import { API_CONNECTIONS_PATH, API_ME_PATH } from './api.constants';

export type ListMockVariant = 'empty' | 'server-error';

interface MeResponseBody {
  family?: {
    children?: unknown[];
  };
}

const meRouteGlob = `**${API_ME_PATH}`;
const connectionsRouteGlob = `**${API_CONNECTIONS_PATH}`;

async function fulfillServerError(route: Route): Promise<void> {
  await route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({ message: 'Internal Server Error' }),
  });
}

/**
 * Mocks GET /api/v1/me list data (`family.children`).
 * `empty` clears children from a live upstream response; `server-error` returns 500.
 */
export async function mockMeList(page: Page, variant: ListMockVariant): Promise<void> {
  await page.route(meRouteGlob, async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    if (variant === 'server-error') {
      await fulfillServerError(route);
      return;
    }

    const upstream = await route.fetch();
    const body = (await upstream.json()) as MeResponseBody;
    if (body.family) {
      body.family.children = [];
    }

    await route.fulfill({
      status: upstream.status(),
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

/**
 * Mocks GET /api/v1/connections list data.
 * `empty` returns []; `server-error` returns 500.
 */
export async function mockConnectionsList(page: Page, variant: ListMockVariant): Promise<void> {
  await page.route(connectionsRouteGlob, async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    if (variant === 'server-error') {
      await fulfillServerError(route);
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
}

/** Stops list mocks registered by {@link mockMeList} and {@link mockConnectionsList}. */
export async function unmockListEndpoints(page: Page): Promise<void> {
  await page.unroute(meRouteGlob);
  await page.unroute(connectionsRouteGlob);
}
