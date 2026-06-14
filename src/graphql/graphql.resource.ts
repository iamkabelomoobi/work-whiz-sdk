import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { GraphQLResponse } from './graphql.types';

interface GraphQLResourceDependencies {
  http: AxiosInstance;
  withSessionCookie: (
    config?: AxiosRequestConfig<any>,
  ) => AxiosRequestConfig<any>;
}

export class GraphQLResource {
  constructor(private readonly dependencies: GraphQLResourceDependencies) {}

  public graphql = async <
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    query: string,
    variables?: TVariables,
    config?: AxiosRequestConfig<any>,
  ): Promise<GraphQLResponse<TData>> => {
    const response = await this.dependencies.http.post<GraphQLResponse<TData>>(
      '/graphql',
      { query, variables },
      this.dependencies.withSessionCookie(config),
    );
    return response.data;
  };
}
