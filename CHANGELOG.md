# Changelog

## [0.1.0] - 2026-06-13

### Added

- Added Better Auth email authentication methods for sign up, sign in, sign out, email verification, password reset, and session lookup.
- Added authenticated GraphQL helper support for `/graphql`.
- Added typed auth and GraphQL request/response exports from the package root.
- Added Node session cookie capture/replay and browser credential support for authenticated requests.

### Changed

- Made API key enforcement opt-in through `requireApiKey` so cookie-based auth can be used without a bearer token.

## [0.0.0-alpha.1] - 2025-05-03

### Added

- Initial implementation of `WorkWhizClient` with `get`, `post`, `put`, `patch`, and `delete` methods.
- Basic error handling with `ApiError`.
