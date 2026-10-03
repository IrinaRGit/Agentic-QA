import path from 'path';
import dotenv from 'dotenv';
import type { APIRequestContext } from '@playwright/test';
import { request as playwrightRequest } from '@playwright/test';
import { createFamilyApiContext, deleteTrackedRecord } from './api-client';
import type { RecordOwner } from './cleanup.types';
import { getTrackedRecords, resetTracker } from './record-tracker';

/** Deletes every tracked record via the REST API, then clears the tracker. */
export async function cleanupCreatedRecords(): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: true });

  const records = getTrackedRecords();
  if (records.length === 0) {
    resetTracker();
    return;
  }

  const contexts = new Map<RecordOwner, APIRequestContext>();

  try {
    for (const record of records) {
      let context = contexts.get(record.owner);
      if (!context) {
        try {
          context = await createFamilyApiContext(playwrightRequest, record.owner);
          contexts.set(record.owner, context);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.warn(`Cleanup skipped ${record.type} ${record.id}: ${message}`);
          continue;
        }
      }

      const result = await deleteTrackedRecord(context, record);
      if (result.ok) {
        console.log(`Deleted ${result.type} ${result.id}`);
      } else {
        console.warn(
          `Failed to delete ${result.type} ${result.id}: HTTP ${result.status} — ${result.message}`,
        );
      }
    }
  } finally {
    await Promise.all([...contexts.values()].map((ctx) => ctx.dispose()));
    resetTracker();
  }
}
