import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import dotenv from 'dotenv';
import { ClientConfig, IWorkWhizClient } from '../interfaces';

dotenv.config();

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

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey || process.env.WORK_WHIZ_API_KEY || '';
    if (!this.apiKey) {
      console.error(
        '❌ [Error]: API key is required to initialize WorkWhizClient.',
      );
      throw new Error('API key is required to initialize WorkWhizClient.');
    }

    console.info('🚀 [Info]: Initializing WorkWhizClient...');
    this.instance = axios.create({
      baseURL:
        config.baseURL ||
        process.env.WORK_WHIZ_BASE_URL ||
        'https://api.workwhiz.com',
      timeout: config.timeout
        ? Number(config.timeout)
        : Number(process.env.WORK_WHIZ_TIMEOUT) || 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.instance.interceptors.request.use(req => {
      console.info(
        `📤 [Request]: Sending ${req.method?.toUpperCase()} request to ${req.url}`,
      );
      req.headers = req.headers || {};
      req.headers.Authorization = `Bearer ${this.apiKey}`;
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
  }

  public get = async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    console.info(`🔍 [Info]: Performing GET request to ${url}`);
    const response = await this.instance.get<T>(url, config);
    console.info(`✅ [Success]: GET request to ${url} completed successfully.`);
    return response.data;
  };

  public post = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
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
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    console.info(`✏️ [Info]: Performing PUT request to ${url}`);
    const response = await this.instance.put<T>(url, data, config);
    console.info(`✅ [Success]: PUT request to ${url} completed successfully.`);
    return response.data;
  };

  public patch = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
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
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    console.info(`🗑️ [Info]: Performing DELETE request to ${url}`);
    const response = await this.instance.delete<T>(url, config);
    console.info(
      `✅ [Success]: DELETE request to ${url} completed successfully.`,
    );
    return response.data;
  };
}
