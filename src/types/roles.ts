export interface Roles {
  id: number;
  role: string;
  allowGradingSystem: boolean;
  allowInventorySystemAccess: boolean;
  allowInventorySystemAdd: boolean;
  allowInventorySystemEdit: boolean;
  allowInventorySystemDelete: boolean;
  allowInventorySystemVoid: boolean;
  allowInventorySystemViewAuditTrail: boolean;
  allowRequestForPurchaseAccess: boolean;
  allowRequestForPurchaseAdd: boolean;
  allowRequestForPurchaseEdit: boolean;
  allowRequestForPurchaseCancel: boolean;
  allowRequestForPurchasePost: boolean;
  allowRequestForPurchaseSendEmail: boolean;
  allowFixedAssetAccess: boolean;
  allowFixedAssetAdd: boolean;
  allowFixedAssetEdit: boolean;
  allowFixedAssetCancel: boolean;
  allowFixedAssetPost: boolean;
  allowFixedAssetSendEmail: boolean;
  allowUMAccess: boolean;
  allowUMAdd: boolean;
  allowUMEdit: boolean;
  allowLibrariesAccess: boolean;
  allowLibrariesAdd: boolean;
  allowLibrariesEdit: boolean;
  allowLibrariesDelete: boolean;
}

export type RoleFormData = Omit<Roles, 'id'>;
