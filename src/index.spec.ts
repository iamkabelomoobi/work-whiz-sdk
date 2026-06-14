import WorkWhizSDK, { WorkWhizClient } from './index';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('package entrypoint', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should export WorkWhizClient from the package root', () => {
    expect(new WorkWhizClient({})).toBeInstanceOf(WorkWhizClient);
  });

  it('should expose client methods from the default SDK export', () => {
    const sdk = new WorkWhizSDK({});

    expect(typeof sdk.signInEmail).toBe('function');
    expect(typeof sdk.graphql).toBe('function');
  });
});
