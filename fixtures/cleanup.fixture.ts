import { test as base, expect, type Response } from '@playwright/test';
import { CREATE_CHILD_PATH_PATTERN } from '../support/api.constants';
import type { RecordOwner } from '../support/cleanup.types';
import { trackRecord } from '../support/record-tracker';

export type { RecordOwner };

type CleanupFixtures = {
  /** Which family's storage state is active for auto-tracking UI creates. */
  recordOwner: RecordOwner;
};

async function maybeTrackCreateChildResponse(
  response: Response,
  recordOwner: RecordOwner,
): Promise<void> {
  if (response.request().method() !== 'POST') {
    return;
  }

  if (response.status() !== 201) {
    return;
  }

  let pathname: string;
  try {
    pathname = new URL(response.url()).pathname;
  } catch {
    return;
  }

  if (!CREATE_CHILD_PATH_PATTERN.test(pathname)) {
    return;
  }

  try {
    const body = (await response.json()) as { id?: string };
    const id = body.id;
    if (!id || id.startsWith('mock-')) {
      return;
    }
    trackRecord({ type: 'child', id, owner: recordOwner });
  } catch {
    // Response body not JSON or already consumed
  }
}

export const test = base.extend<CleanupFixtures>({
  recordOwner: ['main', { option: true }],

  page: async ({ page, recordOwner }, use) => {
    const listener = (response: Response) => {
      void maybeTrackCreateChildResponse(response, recordOwner);
    };
    page.on('response', listener);
    await use(page);
    page.off('response', listener);
  },
});

export { expect };
export { trackRecord } from '../support/record-tracker';
