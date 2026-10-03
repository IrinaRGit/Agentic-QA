export type RecordOwner = 'main' | 'alt';

export type TrackedRecordType = 'child';

export interface TrackedRecord {
  type: TrackedRecordType;
  id: string;
  owner: RecordOwner;
}

export interface DeleteRecordResult {
  type: TrackedRecordType;
  id: string;
  ok: boolean;
  status: number;
  message: string;
}
