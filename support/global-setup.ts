import path from 'path';
import dotenv from 'dotenv';
import { initTracker } from './record-tracker';

export default async function globalSetup(): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: true });
  initTracker();
}
