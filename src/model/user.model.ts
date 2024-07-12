export class UserResponse {
  id?: number;
  name: string;
  email: string;
  roleId?: number;
  role: string;
  token?: string;
}

export class RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export class LoginUserRequest {
  email: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
