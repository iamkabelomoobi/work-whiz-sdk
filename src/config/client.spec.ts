import { WorkWhizClient } from './client';
import axios, { AxiosInstance } from 'axios';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

const createMockAxiosInstance = () =>
  ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  }) as unknown as jest.Mocked<AxiosInstance>;

describe('WorkWhizClient', () => {
  const originalEnv = process.env;
  let axiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'info').mockImplementation(() => undefined);
    axiosInstance = createMockAxiosInstance();
    mockedAxios.create.mockReturnValue(axiosInstance);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('should create an auth-capable instance without an API key', () => {
    delete process.env.WORK_WHIZ_API_KEY;
    const client = new WorkWhizClient({});
    expect(client).toBeDefined();
  });

  it('should throw an error if API key is missing when explicitly required', () => {
    delete process.env.WORK_WHIZ_API_KEY;
    expect(() => new WorkWhizClient({ requireApiKey: true })).toThrow(
      'API key is required to initialize WorkWhizClient.',
    );
  });

  it('should create an instance with valid config', () => {
    const client = new WorkWhizClient({ apiKey: 'test-key' });
    expect(client).toBeDefined();
  });

  it('should use API key from environment variables if not provided in config', () => {
    process.env.WORK_WHIZ_API_KEY = 'env-test-key';
    const client = new WorkWhizClient({});
    expect(client).toBeDefined();
  });

  it('should sign in with email and store the Better Auth session cookie', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        user: { id: 'user-1', email: 'candidate@example.com' },
      },
      headers: {
        'set-cookie': [
          'better-auth.session_token=session-value; Path=/; HttpOnly',
          'better-auth.csrf_token=csrf-value; Path=/',
        ],
      },
    });
    const client = new WorkWhizClient({});

    const response = await client.signInEmail({
      email: 'candidate@example.com',
      password: 'AuthTest!12345',
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/api/auth/sign-in/email',
      {
        email: 'candidate@example.com',
        password: 'AuthTest!12345',
      },
      undefined,
    );
    expect(response.user?.email).toBe('candidate@example.com');
  });

  it('should sign up with email using the documented Better Auth endpoint', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: { user: { id: 'user-1', email: 'candidate@example.com' } },
      headers: {},
    });
    const client = new WorkWhizClient({});

    await client.signUpEmail({
      name: 'Candidate User',
      email: 'candidate@example.com',
      password: 'AuthTest!12345',
      phone: '+27821234567',
      role: 'candidate',
      title: 'Mr',
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/api/auth/sign-up/email',
      {
        name: 'Candidate User',
        email: 'candidate@example.com',
        password: 'AuthTest!12345',
        phone: '+27821234567',
        role: 'candidate',
        title: 'Mr',
      },
      undefined,
    );
  });

  it('should verify email with the token query parameter', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { message: 'Email verified.' },
      headers: {},
    });
    const client = new WorkWhizClient({});

    await client.verifyEmail('verification-token');

    expect(axiosInstance.get).toHaveBeenCalledWith('/api/auth/verify-email', {
      params: {
        token: 'verification-token',
      },
    });
  });

  it('should request and reset passwords through the documented auth endpoints', async () => {
    axiosInstance.post
      .mockResolvedValueOnce({
        data: { message: 'Password reset email requested.' },
        headers: {},
      })
      .mockResolvedValueOnce({
        data: { message: 'Password reset successfully.' },
        headers: {},
      });
    const client = new WorkWhizClient({});

    await client.requestPasswordReset({
      email: 'candidate@example.com',
      redirectTo: 'http://localhost:4200/reset-password',
    });
    await client.resetPassword({
      token: 'reset-token',
      newPassword: 'AuthTest!67890',
    });

    expect(axiosInstance.post).toHaveBeenNthCalledWith(
      1,
      '/api/auth/request-password-reset',
      {
        email: 'candidate@example.com',
        redirectTo: 'http://localhost:4200/reset-password',
      },
      undefined,
    );
    expect(axiosInstance.post).toHaveBeenNthCalledWith(
      2,
      '/api/auth/reset-password',
      {
        token: 'reset-token',
        newPassword: 'AuthTest!67890',
      },
      undefined,
    );
  });

  it('should send the stored Better Auth cookie when getting the current session', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        user: { id: 'user-1', email: 'candidate@example.com' },
      },
      headers: {
        'set-cookie': ['better-auth.session_token=session-value; Path=/'],
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        user: { id: 'user-1', email: 'candidate@example.com' },
      },
      headers: {},
    });
    const client = new WorkWhizClient({});

    await client.signInEmail({
      email: 'candidate@example.com',
      password: 'AuthTest!12345',
    });
    await client.getSession();

    expect(axiosInstance.get).toHaveBeenCalledWith('/api/auth/get-session', {
      headers: {
        Cookie: 'better-auth.session_token=session-value',
      },
    });
  });

  it('should send the stored Better Auth cookie when signing out', async () => {
    axiosInstance.post
      .mockResolvedValueOnce({
        data: { user: { id: 'user-1' } },
        headers: {
          'set-cookie': ['better-auth.session_token=session-value; Path=/'],
        },
      })
      .mockResolvedValueOnce({ data: { message: 'Signed out.' }, headers: {} });
    const client = new WorkWhizClient({});

    await client.signInEmail({
      email: 'candidate@example.com',
      password: 'AuthTest!12345',
    });
    await client.signOut();

    expect(axiosInstance.post).toHaveBeenLastCalledWith(
      '/api/auth/sign-out',
      {},
      {
        headers: {
          Cookie: 'better-auth.session_token=session-value',
        },
      },
    );
  });

  it('should post GraphQL operations with the stored Better Auth cookie', async () => {
    axiosInstance.post
      .mockResolvedValueOnce({
        data: { user: { id: 'user-1' } },
        headers: {
          'set-cookie': ['better-auth.session_token=session-value; Path=/'],
        },
      })
      .mockResolvedValueOnce({
        data: { data: { me: { id: 'user-1' } } },
        headers: {},
      });
    const client = new WorkWhizClient({});

    await client.signInEmail({
      email: 'candidate@example.com',
      password: 'AuthTest!12345',
    });
    const response = await client.graphql<{ me: { id: string } }>(
      'query Me { me { id } }',
    );

    expect(axiosInstance.post).toHaveBeenLastCalledWith(
      '/graphql',
      {
        query: 'query Me { me { id } }',
        variables: undefined,
      },
      {
        headers: {
          Cookie: 'better-auth.session_token=session-value',
        },
      },
    );
    expect(response.data?.me.id).toBe('user-1');
  });
});
