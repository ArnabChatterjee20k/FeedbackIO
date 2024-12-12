export enum PermissionEnum {
  READ = "read",
  // write and update
  WRITE = "write",
  DELETE = "delete",
}

export enum TypeEnum {
  FEEDBACK = "feedback",
  POLL = "poll",
}

export interface GetPermissions {
  document_id: string;
  user_id?: string;
  permission?: PermissionEnum;
  type?: TypeEnum;
}

export interface Permissions {
  document_id: string;
  user_id: string;
  permission: PermissionEnum;
  type: TypeEnum;
}

export interface PermissionResponse {
  data: UsersPermission[];
  success: boolean;
}

export interface UsersPermission {
  permissions: PermissionEnum[];
  user_id: string;
}
