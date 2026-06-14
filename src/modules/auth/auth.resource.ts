import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  AuthResponse,
  AuthSessionResponse,
  MessageResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SignInEmailRequest,
  SignUpEmailRequest,
} from './auth.types';

interface AuthResourceDependencies {
  http: AxiosInstance;
  storeSessionCookie: (headers?: Record<string, any>) => void;
  clearSessionCookie: () => void;
  withSessionCookie: (
    config?: AxiosRequestConfig<any>,
  ) => AxiosRequestConfig<any>;
}

export class AuthResource {
  constructor(private readonly dependencies: AuthResourceDependencies) {}

  public signUpEmail = async (
    data: SignUpEmailRequest,
    config?: AxiosRequestConfig<any>,
  ): Promise<AuthResponse> => {
    const response = await this.dependencies.http.post<AuthResponse>(
      '/api/auth/sign-up/email',
      data,
      config,
    );
    this.dependencies.storeSessionCookie(response.headers);
    return response.data;
  };

  public signInEmail = async (
    data: SignInEmailRequest,
    config?: AxiosRequestConfig<any>,
  ): Promise<AuthResponse> => {
    const response = await this.dependencies.http.post<AuthResponse>(
      '/api/auth/sign-in/email',
      data,
      config,
    );
    this.dependencies.storeSessionCookie(response.headers);
    return response.data;
  };

  public signOut = async (
    config?: AxiosRequestConfig<any>,
  ): Promise<MessageResponse> => {
    const response = await this.dependencies.http.post<MessageResponse>(
      '/api/auth/sign-out',
      {},
      this.dependencies.withSessionCookie(config),
    );
    this.dependencies.clearSessionCookie();
    return response.data;
  };

  public verifyEmail = async (
    token: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<MessageResponse> => {
    const response = await this.dependencies.http.get<MessageResponse>(
      '/api/auth/verify-email',
      {
        ...config,
        params: {
          ...config?.params,
          token,
        },
      },
    );
    return response.data;
  };

  public requestPasswordReset = async (
    data: RequestPasswordResetRequest,
    config?: AxiosRequestConfig<any>,
  ): Promise<MessageResponse> => {
    const response = await this.dependencies.http.post<MessageResponse>(
      '/api/auth/request-password-reset',
      data,
      config,
    );
    return response.data;
  };

  public resetPassword = async (
    data: ResetPasswordRequest,
    config?: AxiosRequestConfig<any>,
  ): Promise<MessageResponse> => {
    const response = await this.dependencies.http.post<MessageResponse>(
      '/api/auth/reset-password',
      data,
      config,
    );
    return response.data;
  };

  public getSession = async (
    config?: AxiosRequestConfig<any>,
  ): Promise<AuthSessionResponse> => {
    const response = await this.dependencies.http.get<AuthSessionResponse>(
      '/api/auth/get-session',
      this.dependencies.withSessionCookie(config),
    );
    return response.data;
  };
}
