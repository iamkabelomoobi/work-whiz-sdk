import { AxiosRequestConfig } from 'axios';

export interface ClientConfig {
  baseURL?: string;
  apiKey?: string;
  timeout?: string;
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
}
