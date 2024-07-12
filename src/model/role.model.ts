export class RoleResponse {
  id: number;
  name: string;
}

export class CreateRoleRequest {
  name: string;
}

export class UpdateRoleRequest {
  id: number;
  name: string;
}

export class UpdateRoleUserRequest {
  id: number;
  userId: number;
  roleId: number;
}
