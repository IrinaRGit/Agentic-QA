import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import type { APIRequestContext } from '@playwright/test';
import { request as playwrightRequest } from '@playwright/test';
import { AUTH_FILE, ALT_AUTH_FILE } from '../../../../support/auth.constants';
import { createFamilyApiContext, deleteTrackedRecord } from '../../../../support/api-client';
import type { RecordOwner, TrackedRecordType } from '../../../../support/cleanup.types';
import { getTrackedRecords, resetTracker, TRACKER_PATH } from '../../../../support/record-tracker';

dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

const VALID_TYPES: TrackedRecordType[] = ['child'];

function parseArgs(): { dryRun: boolean; typeFilter: TrackedRecordType | undefined } {
  const args = process.argv.slice(2);
  let dryRun = false;
  let typeFilter: TrackedRecordType | undefined;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--type') {
      const value = args[i + 1];
      if (!value) {
        throw new Error('--type requires a value (e.g. child)');
      }
      if (!VALID_TYPES.includes(value as TrackedRecordType)) {
        throw new Error(`Unknown type "${value}". Valid types: ${VALID_TYPES.join(', ')}`);
      }
      typeFilter = value as TrackedRecordType;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { dryRun, typeFilter };
}

function scopeLabel(typeFilter: TrackedRecordType | undefined): string {
  return typeFilter ?? 'all tracked types';
}

function authFilesForRecords(records: { owner: RecordOwner }[]): string[] {
  const needsMain = records.some((r) => r.owner === 'main');
  const needsAlt = records.some((r) => r.owner === 'alt');
  const files: string[] = [];
  if (needsMain) {
    files.push(AUTH_FILE);
  }
  if (needsAlt) {
    files.push(ALT_AUTH_FILE);
  }
  return files;
}

async function main(): Promise<void> {
  const { dryRun, typeFilter } = parseArgs();
  const allRecords = getTrackedRecords();
  const records = typeFilter ? allRecords.filter((r) => r.type === typeFilter) : allRecords;

  const scope = scopeLabel(typeFilter);
  let deleted = 0;
  let failed = 0;

  console.log(`Tracker: ${TRACKER_PATH}`);
  console.log(`Scope: ${scope}`);
  console.log(`Found: ${records.length}`);

  if (records.length === 0) {
    console.log('Deleted: 0');
    console.log('Failed: 0');
    if (!dryRun) {
      resetTracker();
    }
    return;
  }

  if (dryRun) {
    for (const record of records) {
      console.log(`  [dry-run] would delete ${record.type} ${record.id} (owner: ${record.owner})`);
    }
    console.log('Deleted: 0');
    console.log('Failed: 0');
    return;
  }

  const missingAuth = authFilesForRecords(records).filter((file) => !fs.existsSync(file));
  if (missingAuth.length > 0) {
    console.error(`Missing storage state: ${missingAuth.join(', ')}. Run: npx playwright test --project=setup`);
    process.exitCode = 1;
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
          console.error(`Failed to create API context for "${record.owner}": ${message}`);
          failed += 1;
          continue;
        }
      }

      const result = await deleteTrackedRecord(context, record);

      if (result.status === 401) {
        console.error(
          `HTTP 401 for ${result.type} ${result.id} (owner: ${record.owner}) — storage state expired; re-run setup.`,
        );
        failed += 1;
        continue;
      }

      if (result.status === 404) {
        console.log(`Already removed: ${result.type} ${result.id}`);
        deleted += 1;
        continue;
      }

      if (result.ok) {
        console.log(`Deleted ${result.type} ${result.id}`);
        deleted += 1;
      } else {
        console.error(
          `Failed ${result.type} ${result.id}: HTTP ${result.status} — ${result.message}`,
        );
        failed += 1;
      }
    }
  } finally {
    await Promise.all([...contexts.values()].map((ctx) => ctx.dispose()));
    resetTracker();
  }

  console.log(`Deleted: ${deleted}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
