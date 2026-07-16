import { post } from "./client";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  gender?: string;
  bloodType?: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
    photo?: string;
  };
  token: string;
}

export function register(input: RegisterInput): Promise<AuthResult> {
  return post<AuthResult>("/auth/register", input);
}

export function login(input: LoginInput): Promise<AuthResult> {
  return post<AuthResult>("/auth/login", input);
}

export function loginDoctor(input: LoginInput): Promise<{ doctor: AuthResult["user"]; token: string }> {
  return post("/auth/doctor/login", input);
}
