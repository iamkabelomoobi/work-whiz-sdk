export interface GraphQLResponse<TData = unknown> {
  data?: TData | null;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
}
