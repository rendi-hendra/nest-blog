export class UserResponse {
  name: string;
  email: string;
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
