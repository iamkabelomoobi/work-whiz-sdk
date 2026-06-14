<div align="center" style="position: relative;">
<h1>@WORK-WHIZ/SDK</h1>
<p align="center">
 <em>Powerful SDK for seamless integration with Work-Whiz services.</em>
</p>
<p align="left">
 <img src="https://img.shields.io/github/license/iamkabelomoobi/work-whiz-sdk?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
 <img src="https://img.shields.io/github/last-commit/iamkabelomoobi/work-whiz-sdk?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
 <img src="https://img.shields.io/github/languages/top/iamkabelomoobi/work-whiz-sdk?style=default&color=0080ff" alt="repo-top-language">
 <img src="https://img.shields.io/github/languages/count/iamkabelomoobi/work-whiz-sdk?style=default&color=0080ff" alt="repo-language-count">
 <img src="https://img.shields.io/npm/v/@work-whiz/sdk?style=default&color=CB3837" alt="npm-version">
 <img src="https://img.shields.io/npm/dm/@work-whiz/sdk?style=default&color=CB3837" alt="npm-downloads">
</p>
</div>
<br clear="right">

## 🔗 Table of Contents

- [🔗 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [🚀 Getting Started](#-getting-started)
	- [☑️ Prerequisites](#️-prerequisites)
	- [⚙️ Installation](#️-installation)
	- [🤖 Usage](#-usage)
	- [🧪 Testing](#-testing)
- [⚡ Quick Start](#-quick-start)
- [🔐 Authentication](#-authentication)
- [📡 GraphQL](#-graphql)
- [🗂️ Project Structure](#️-project-structure)
- [🛠️ Development](#️-development)
- [📄 License](#-license)

---

## 📍 Overview

The `@work-whiz/sdk` is a lightweight TypeScript SDK for the Work Whiz API. It provides a typed client for Better Auth email authentication, authenticated GraphQL operations, and low-level HTTP requests.

---

## 👾 Features

- Typed Better Auth email sign up, sign in, sign out, email verification, password reset, and session lookup.
- Authenticated GraphQL helper for `/graphql`.
- Automatic Better Auth session cookie capture and replay in Node.
- Browser cookie support through Axios `withCredentials`.
- Generic `get`, `post`, `put`, `patch`, and `delete` methods for lower-level API access.
- TypeScript request and response types exported from the package root.

---

## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with `@work-whiz/sdk`, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript or JavaScript (ES6+)
- **Package Manager:** npm

### ⚙️ Installation

Install `@work-whiz/sdk` using npm:

```sh
❯ npm install @work-whiz/sdk
```

### 🤖 Usage

Import the client from the package root:

```typescript
import { WorkWhizClient } from '@work-whiz/sdk';

const client = new WorkWhizClient({
  baseURL: 'http://localhost:3000',
});
```

### 🧪 Testing

Run the test suite using the following command:

```sh
❯ npm test
```

---

## ⚡ Quick Start

Here’s a quick example to get started with `@work-whiz/sdk`:

```typescript
import { WorkWhizClient } from '@work-whiz/sdk';

const client = new WorkWhizClient({
  baseURL: 'http://localhost:3000',
});

async function main() {
  await client.signInEmail({
    email: 'candidate@example.com',
    password: 'AuthTest!12345',
  });

  const response = await client.graphql<{ me: { id: string; email: string } }>(
    'query Me { me { id email } }',
  );

  console.log(response);
}

main();
```

---

## 🔐 Authentication

The SDK maps to the Work Whiz Better Auth REST endpoints under `/api/auth`.

```typescript
await client.signUpEmail({
  name: 'Candidate User',
  email: 'candidate@example.com',
  password: 'AuthTest!12345',
  phone: '+27821234567',
  role: 'candidate',
  title: 'Mr',
});

await client.signInEmail({
  email: 'candidate@example.com',
  password: 'AuthTest!12345',
});

const session = await client.getSession();

await client.signOut();
```

Available auth methods:

- `signUpEmail(data)`
- `signInEmail(data)`
- `signOut()`
- `verifyEmail(token)`
- `requestPasswordReset(data)`
- `resetPassword(data)`
- `getSession()`

In Node, the client stores the Better Auth `Set-Cookie` header from sign-in and sends it on authenticated calls. In browsers, Axios uses `withCredentials` so the browser can manage cookies.

---

## 📡 GraphQL

Use `graphql<TData, TVariables>()` for profile and account operations exposed through `/graphql`.

```typescript
const result = await client.graphql<
  { me: { id: string; email: string } },
  Record<string, never>
>('query Me { me { id email } }');
```

The GraphQL helper sends the stored Better Auth session cookie automatically when one is available.

---

## 🗂️ Project Structure

Feature code is split by responsibility while keeping `WorkWhizClient` as the single public entrypoint.

```text
src/
  config/
    client.ts
    index.ts
  graphql/
    graphql.resource.ts
    graphql.types.ts
    index.ts
  interfaces/
    client.ts
    index.ts
  modules/
    auth/
      auth.resource.ts
      auth.types.ts
      index.ts
  index.ts
```

`src/config/client.ts` owns Axios setup, API key handling, generic HTTP methods, and session cookie state. Auth behavior lives in `src/modules/auth`, and GraphQL behavior lives in `src/graphql`.

---

## 🛠️ Development

Run tests:

```sh
npm test
```

Build the package:

```sh
npm run build
```

Run lint:

```sh
npm run lint
```

--- 
## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
