export type SyncableRecord = {
  id: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  last_updated_by?: string | null;
  sync_version: number;
};

export function newestWins<T extends SyncableRecord>(local: T, remote: T): T {
  const localTime = new Date(local.updated_at).getTime();
  const remoteTime = new Date(remote.updated_at).getTime();

  if (Number.isNaN(localTime)) return remote;
  if (Number.isNaN(remoteTime)) return local;

  if (localTime === remoteTime) {
    return local.sync_version >= remote.sync_version ? local : remote;
  }

  return localTime > remoteTime ? local : remote;
}

export const syncTables = [
  "tasks",
  "subtasks",
  "boards",
  "board_cards",
  "task_comments",
  "card_comments",
  "reminders",
  "notifications",
  "clients",
  "client_projects",
  "invoices",
  "contracts",
  "proposals",
] as const;
