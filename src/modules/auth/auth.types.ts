export type WorkWhizRole = 'candidate' | 'employer' | 'admin';

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  role?: WorkWhizRole;
  emailVerified?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
}

export interface SignUpEmailRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'candidate' | 'employer';
  title?: string;
  industry?: string;
  websiteUrl?: string;
  location?: string;
  description?: string;
  size?: number;
  foundedIn?: number;
}

export interface SignInEmailRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: AuthUser;
  [key: string]: any;
}

export interface RequestPasswordResetRequest {
  email: string;
  redirectTo?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface MessageResponse {
  message?: string;
  [key: string]: any;
}

export type AuthSessionResponse = AuthResponse | null;
