import fs from 'fs';
import path from 'path';
import type { TrackedRecord } from './cleanup.types';

export const TRACKER_PATH = path.join('.test-artifacts', 'created-records.jsonl');

function trackerAbsolutePath(): string {
  return path.resolve(process.cwd(), TRACKER_PATH);
}

/** Ensures the tracker file exists and is empty at the start of a run. */
export function initTracker(): void {
  const filePath = trackerAbsolutePath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '', 'utf8');
}

/** Appends one created record for later API cleanup. */
export function trackRecord(record: TrackedRecord): void {
  const filePath = trackerAbsolutePath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`, 'utf8');
}

/** Returns deduplicated records (first owner wins if duplicates share type+id). */
export function getTrackedRecords(): TrackedRecord[] {
  const filePath = trackerAbsolutePath();
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const seen = new Set<string>();
  const records: TrackedRecord[] = [];

  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const parsed = JSON.parse(trimmed) as TrackedRecord;
    const key = `${parsed.type}:${parsed.id}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    records.push(parsed);
  }

  return records;
}

/** Clears the tracker after cleanup (idempotent empty state). */
export function resetTracker(): void {
  initTracker();
}
