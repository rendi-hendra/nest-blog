export class RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export class UserResponse {
  name: string;
  email: string;
  token?: string;
}

export class LoginUserRequest {
  email: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
