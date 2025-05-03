import { WorkWhizClient } from './client';

describe('WorkWhizClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw an error if API key is missing', () => {
    delete process.env.WORK_WHIZ_API_KEY;
    expect(() => new WorkWhizClient({})).toThrow(
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
});
