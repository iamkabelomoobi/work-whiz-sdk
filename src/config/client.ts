import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import dotenv from 'dotenv';
import { ClientConfig } from '../interfaces';

dotenv.config();

/**
 * Custom API error class with status code and details
 */
class ApiError extends Error {
  /**
   * @param message - Error message
   * @param status - HTTP status code
   * @param details - Additional error details
   */
  constructor(
    message: string,
    public status?: number,
    public details?: any,
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * WorkWhiz API Client for interacting with the WorkWhiz REST API
 */
export class WorkWhizClient {
  private instance: AxiosInstance;
  private apiKey: string;

  /**
   * Create a new WorkWhizClient instance
   * @param config - Client configuration
   * @param config.apiKey - API key for authentication
   * @param config.baseURL - Base URL for the API
   * @param config.timeout - Request timeout in milliseconds
   */
  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey || process.env.WORK_WHIZ_API_KEY || '';

    this.instance = axios.create({
      baseURL:
        config.baseURL ||
        process.env.WORK_WHIZ_BASE_URL ||
        'https://api.workwhiz.com',
      timeout: config.timeout ? Number(config.timeout) : 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.instance.interceptors.request.use((req: any) => {
      if (!req.headers) {
        req.headers = {};
      }
      req.headers.Authorization = `Bearer ${this.apiKey}`;
      return req;
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          const errorMessage =
            (error.response.data as any)?.message || 'API request failed';
          throw new ApiError(
            errorMessage,
            error.response.status,
            error.response.data,
          );
        }
        throw new ApiError(
          error.message || 'Network error',
          error.code ? parseInt(error.code) : undefined,
        );
      },
    );
  }

  /**
   * Send a GET request
   * @param url - The URL to send the request to
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  /**
   * Send a POST request
   * @param url - The URL to send the request to
   * @param data - The data to send in the request body
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Send a PUT request
   * @param url - The URL to send the request to
   * @param data - The data to send in the request body
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Send a PATCH request
   * @param url - The URL to send the request to
   * @param data - The data to send in the request body
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Send a DELETE request
   * @param url - The URL to send the request to
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}
