# Creating an SDK for Your Express REST API (Work Whiz)

I'll guide you through creating an npm SDK for your Work Whiz API. Here's a comprehensive step-by-step process:

## 1. Set Up the SDK Project Structure

First, create a new directory for your SDK and initialize it:

```bash
mkdir work-whiz-sdk
cd work-whiz-sdk
npm init -y
```

## 2. Install Required Dependencies

```bash
npm install axios dotenv
npm install --save-dev typescript @types/node @types/axios jest ts-jest @types/jest eslint prettier
```

## 3. Basic SDK Structure

Here's how to structure your SDK files:

```
work-whiz-sdk/
├── src/
│   ├── index.ts            # Main SDK entry point
│   ├── client.ts           # HTTP client configuration
│   ├── resources/          # API resource modules
│   │   ├── auth.ts
│   │   ├── tasks.ts
│   │   └── ... (other resources)
│   └── types/              # Type definitions
├── tests/                  # Test files
├── .env.example            # Environment example
├── .gitignore
├── package.json
├── tsconfig.json           # TypeScript config
└── README.md
```

## 4. SDK Implementation

### src/client.ts - HTTP Client Setup

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface ClientConfig {
  baseURL?: string;
  apiKey?: string;
  timeout?: number;
}

export class WorkWhizClient {
  private instance: AxiosInstance;
  private apiKey: string;

  constructor(config: ClientConfig = {}) {
    this.apiKey = config.apiKey || process.env.WORK_WHIZ_API_KEY || '';

    this.instance = axios.create({
      baseURL: config.baseURL || process.env.WORK_WHIZ_BASE_URL || 'https://your-api-url.com',
      timeout: config.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.instance.interceptors.request.use((req) => {
      if (this.apiKey) {
        req.headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      return req;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error('API Error:', error.response.data);
          throw new Error(error.response.data.message || 'API request failed');
        } else if (error.request) {
          console.error('Network Error:', error.request);
          throw new Error('Network error - no response received');
        } else {
          console.error('Request Error:', error.message);
          throw new Error('Error setting up request');
        }
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}
```

### src/resources/auth.ts - Example Resource

```typescript
import { WorkWhizClient } from '../client';

export class AuthResource {
  constructor(private client: WorkWhizClient) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    return this.client.post('/auth/login', { email, password });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ id: string; email: string }> {
    return this.client.post('/auth/register', userData);
  }

  async me(): Promise<{ id: string; email: string; name: string }> {
    return this.client.get('/auth/me');
  }
}
```

### src/index.ts - Main SDK Entry

```typescript
import { WorkWhizClient } from './client';
import { AuthResource } from './resources/auth';
// Import other resources as needed

export class WorkWhizSDK {
  public auth: AuthResource;
  // Add other resources here

  constructor(config: { apiKey?: string; baseURL?: string; timeout?: number } = {}) {
    const client = new WorkWhizClient(config);
    
    this.auth = new AuthResource(client);
    // Initialize other resources here
  }
}

export default WorkWhizSDK;
```

## 5. TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

## 6. Package.json Configuration

Update your package.json with these important fields:

```json
{
  "name": "work-whiz-sdk",
  "version": "1.0.0",
  "description": "Official SDK for Work Whiz API",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "prepublish": "npm run build",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src/**/*.ts"
  },
  "files": ["dist"],
  "keywords": ["work-whiz", "api", "sdk"],
  "author": "Your Name",
  "license": "MIT"
}
```

## 7. Testing the SDK

Create a test file in `tests/auth.test.ts`:

```typescript
import { WorkWhizSDK } from '../src';

describe('WorkWhizSDK', () => {
  let sdk: WorkWhizSDK;

  beforeAll(() => {
    sdk = new WorkWhizSDK({
      baseURL: 'http://localhost:3000', // or your test server
      apiKey: 'test-api-key'
    });
  });

  it('should login successfully', async () => {
    const result = await sdk.auth.login('test@example.com', 'password');
    expect(result).toHaveProperty('token');
  });
});
```

## 8. Building and Publishing

1. Build the SDK:
```bash
npm run build
```

2. Login to npm:
```bash
npm login
```

3. Publish the package:
```bash
npm publish
```

## 9. Using the SDK in a Project

After publishing, users can install and use your SDK like this:

```bash
npm install work-whiz-sdk
```

Example usage:

```typescript
import WorkWhizSDK from 'work-whiz-sdk';

const sdk = new WorkWhizSDK({
  apiKey: 'your-api-key',
  baseURL: 'https://api.workwhiz.com' // or your API URL
});

async function main() {
  try {
    // Login
    const { token } = await sdk.auth.login('user@example.com', 'password');
    console.log('Logged in with token:', token);
    
    // Get user profile
    const profile = await sdk.auth.me();
    console.log('User profile:', profile);
    
    // Use other resources...
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

## 10. Documentation

Create a comprehensive README.md with:

- Installation instructions
- Configuration options
- Authentication methods
- API resource examples
- Error handling
- Contribution guidelines
- License information

## Additional Considerations

1. **Error Handling**: Implement custom error classes for better error handling
2. **Retry Logic**: Add retry mechanisms for failed requests
3. **Rate Limiting**: Handle rate limiting from the API
4. **Webhooks**: If your API supports webhooks, add webhook verification
5. **Pagination**: Implement pagination helpers for list endpoints
6. **Type Safety**: Add comprehensive TypeScript interfaces for all API responses
7. **Versioning**: Consider API versioning in your SDK

Would you like me to elaborate on any specific part of this SDK implementation?