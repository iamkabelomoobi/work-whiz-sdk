import { AxiosRequestConfig } from 'axios';
import {
  AuthResponse,
  AuthSessionResponse,
  MessageResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SignInEmailRequest,
  SignUpEmailRequest,
} from '../modules/auth';
import { GraphQLResponse } from '../graphql';

export interface ClientConfig {
  baseURL?: string;
  apiKey?: string;
  timeout?: string;
  requireApiKey?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}
export interface IWorkWhizClient {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<T>;
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  signUpEmail: (
    data: SignUpEmailRequest,
    config?: AxiosRequestConfig,
  ) => Promise<AuthResponse>;
  signInEmail: (
    data: SignInEmailRequest,
    config?: AxiosRequestConfig,
  ) => Promise<AuthResponse>;
  signOut: (config?: AxiosRequestConfig) => Promise<MessageResponse>;
  verifyEmail: (
    token: string,
    config?: AxiosRequestConfig,
  ) => Promise<MessageResponse>;
  requestPasswordReset: (
    data: RequestPasswordResetRequest,
    config?: AxiosRequestConfig,
  ) => Promise<MessageResponse>;
  resetPassword: (
    data: ResetPasswordRequest,
    config?: AxiosRequestConfig,
  ) => Promise<MessageResponse>;
  getSession: (config?: AxiosRequestConfig) => Promise<AuthSessionResponse>;
  graphql: <
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    query: string,
    variables?: TVariables,
    config?: AxiosRequestConfig,
  ) => Promise<GraphQLResponse<TData>>;
}
