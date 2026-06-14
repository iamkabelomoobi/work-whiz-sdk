import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { AuthResource } from '../modules/auth';
import {
  AuthResponse,
  AuthSessionResponse,
  MessageResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SignInEmailRequest,
  SignUpEmailRequest,
} from '../modules/auth/auth.types';
import { GraphQLResource } from '../graphql';
import { GraphQLResponse } from '../graphql/graphql.types';
import { ClientConfig, IWorkWhizClient } from '../interfaces/client';

const getEnv = (key: string): string | undefined => {
  if (typeof process === 'undefined') {
    return undefined;
  }

  return process.env?.[key];
};

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any,
    public timestamp: string = new Date().toISOString(),
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class WorkWhizClient implements IWorkWhizClient {
  private instance: AxiosInstance;
  private apiKey: string;
  private sessionCookie?: string;
  private auth: AuthResource;
  private graphQL: GraphQLResource;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey || getEnv('WORK_WHIZ_API_KEY') || '';
    if (config.requireApiKey && !this.apiKey) {
      console.error(
        '❌ [Error]: API key is required to initialize WorkWhizClient.',
      );
      throw new Error('API key is required to initialize WorkWhizClient.');
    }

    console.info('🚀 [Info]: Initializing WorkWhizClient...');
    this.instance = axios.create({
      baseURL:
        config.baseURL || getEnv('WORK_WHIZ_BASE_URL') || 'https://api.workwhiz.com',
      timeout: config.timeout
        ? Number(config.timeout)
        : Number(getEnv('WORK_WHIZ_TIMEOUT')) || 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    this.instance.interceptors.request.use(req => {
      console.info(
        `📤 [Request]: Sending ${req.method?.toUpperCase()} request to ${req.url}`,
      );
      req.headers = req.headers || {};
      if (this.apiKey) {
        req.headers.Authorization = `Bearer ${this.apiKey}`;
      }
      return req;
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.info(
          `✅ [Response]: Received response from ${response.config.url} with status ${response.status}`,
        );
        return response;
      },
      (error: AxiosError) => {
        const errorMessage = `❌ [Error]: Error in ${error.config?.method?.toUpperCase()} ${error.config?.url}: ${
          (error.response?.data as any)?.message || 'API request failed'
        }`;
        console.error(errorMessage);
        if (error.response) {
          throw new ApiError(
            errorMessage,
            error.response.status,
            error.response.data,
          );
        }
        throw new ApiError(error.message || 'Network error', undefined);
      },
    );

    this.auth = new AuthResource({
      http: this.instance,
      storeSessionCookie: headers => this.storeSessionCookie(headers),
      clearSessionCookie: () => this.clearSessionCookie(),
      withSessionCookie: config => this.withSessionCookie(config),
    });
    this.graphQL = new GraphQLResource({
      http: this.instance,
      withSessionCookie: config => this.withSessionCookie(config),
    });
  }

  private storeSessionCookie(headers?: Record<string, any>): void {
    const setCookie = headers?.['set-cookie'] || headers?.['Set-Cookie'];
    if (!setCookie) {
      return;
    }

    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
    this.sessionCookie = cookies
      .map(cookie => String(cookie).split(';')[0])
      .filter(Boolean)
      .join('; ');
  }

  private clearSessionCookie(): void {
    this.sessionCookie = undefined;
  }

  private withSessionCookie(
    config?: AxiosRequestConfig<any>,
  ): AxiosRequestConfig<any> {
    if (!this.sessionCookie) {
      return config || {};
    }

    return {
      ...config,
      headers: {
        ...config?.headers,
        Cookie: this.sessionCookie,
      },
    };
  }

  public get = async <T>(
    url: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> => {
    console.info(`🔍 [Info]: Performing GET request to ${url}`);
    const response = await this.instance.get<T>(url, config);
    console.info(`✅ [Success]: GET request to ${url} completed successfully.`);
    return response.data;
  };

  public post = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> => {
    console.info(`📦 [Info]: Performing POST request to ${url}`);
    const response = await this.instance.post<T>(url, data, config);
    console.info(
      `✅ [Success]: POST request to ${url} completed successfully.`,
    );
    return response.data;
  };

  public put = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> => {
    console.info(`✏️ [Info]: Performing PUT request to ${url}`);
    const response = await this.instance.put<T>(url, data, config);
    console.info(`✅ [Success]: PUT request to ${url} completed successfully.`);
    return response.data;
  };

  public patch = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> => {
    console.info(`🔧 [Info]: Performing PATCH request to ${url}`);
    const response = await this.instance.patch<T>(url, data, config);
    console.info(
      `✅ [Success]: PATCH request to ${url} completed successfully.`,
    );
    return response.data;
  };

  public delete = async <T>(
    url: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> => {
    console.info(`🗑️ [Info]: Performing DELETE request to ${url}`);
    const response = await this.instance.delete<T>(url, config);
    console.info(
      `✅ [Success]: DELETE request to ${url} completed successfully.`,
    );
    return response.data;
  };

  public signUpEmail = async (
    data: SignUpEmailRequest,
    config?: AxiosRequestConfig<any>,
  ): Promise<AuthResponse> => {
    return this.auth.signUpEmail(data, config);
  };

  public signInEmail = async (
    data: SignInEmailRequest,
    config?: AxiosRequestConfig<any>,
  ): Promise<AuthResponse> => {
    return this.auth.signInEmail(data, config);
  };

  public signOut = async (
    config?: AxiosRequestConfig<any>,
  ): Promise<MessageResponse> => {
    return this.auth.signOut(config);
  };

  public verifyEmail = async (
    token: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<MessageResponse> => {
    return this.auth.verifyEmail(token, config);
  };

  public requestPasswordReset = async (
    data: RequestPasswordResetRequest,
    config?: AxiosRequestConfig<any>,
  ): Promise<MessageResponse> => {
    return this.auth.requestPasswordReset(data, config);
  };

  public resetPassword = async (
    data: ResetPasswordRequest,
    config?: AxiosRequestConfig<any>,
  ): Promise<MessageResponse> => {
    return this.auth.resetPassword(data, config);
  };

  public getSession = async (
    config?: AxiosRequestConfig<any>,
  ): Promise<AuthSessionResponse> => {
    return this.auth.getSession(config);
  };

  public graphql = async <
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    query: string,
    variables?: TVariables,
    config?: AxiosRequestConfig<any>,
  ): Promise<GraphQLResponse<TData>> => {
    return this.graphQL.graphql(query, variables, config);
  };
}
