export interface Content {
  id: string;
  prompt: string;
  output: string;
  createdAt: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
