import { InventoryItem } from './items';
import { Accounts } from './accounts';

export interface InventoryLogs {
  id: number;
  activity: string;
  updatedItem: InventoryItem;
  inventoryId: number;
  involvedUserUUID: string;
  involvedUser: Accounts;
  updatedAt: Date;
}

export type InventoryLogsFormData = Omit<
  InventoryLogs,
  'id' | 'updatedItem' | 'involvedUser' | 'updatedAt'
>;
