import path from 'path';
import dotenv from 'dotenv';
import { cleanupCreatedRecords } from './cleanup-records';

export default async function globalTeardown(): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: true });
  await cleanupCreatedRecords();
}
