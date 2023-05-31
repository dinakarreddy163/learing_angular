export interface PermissionElement {
  name: string;
  permission_id: number;
  permission_access_id: number | null;
  permission_group_id: number;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
}

export interface GroupBy {
  name: string;
  permission_group_id: number;
  isGroupBy: boolean;
}
