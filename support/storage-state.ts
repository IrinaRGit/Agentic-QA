import fs from 'fs';

interface StorageStateOrigin {
  origin?: string;
  localStorage?: Array<{ name: string; value: string }>;
}

interface PlaywrightStorageState {
  origins?: StorageStateOrigin[];
}

/** Reads `bt_token` from a Playwright storage-state file for API Bearer auth. */
export function readBearerTokenFromStorageState(storageStatePath: string): string | null {
  if (!fs.existsSync(storageStatePath)) {
    return null;
  }

  const raw = fs.readFileSync(storageStatePath, 'utf8');
  const state = JSON.parse(raw) as PlaywrightStorageState;

  for (const origin of state.origins ?? []) {
    for (const entry of origin.localStorage ?? []) {
      if (entry.name === 'bt_token' && entry.value) {
        return entry.value;
      }
    }
  }

  return null;
}
