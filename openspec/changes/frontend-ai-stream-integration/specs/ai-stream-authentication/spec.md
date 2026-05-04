## MODIFIED Requirements

### Requirement: Include authentication token in streaming requests
The AI streaming client SHALL include the user's authentication token in the HTTP Authorization header when making streaming requests.

#### Scenario: Token retrieved from auth utility
- **WHEN** initiating a streaming request
- **THEN** the client SHALL call `getAccessToken()` to retrieve the current access token

#### Scenario: Token formatted with Bearer prefix
- **WHEN** the token is retrieved
- **THEN** the client SHALL ensure it has the `Bearer ` prefix using `formatAuthToken()`

#### Scenario: Token included in Authorization header
- **WHEN** making the fetch request
- **THEN** the client SHALL include header `Authorization: Bearer <token>`

### Requirement: Validate token existence before streaming
The client SHALL verify that a valid authentication token exists before initiating a streaming request.

#### Scenario: No token available
- **WHEN** `getAccessToken()` returns null or empty string
- **THEN** the client SHALL invoke `onError('未登录，请先登录')` and abort the request

#### Scenario: Token exists
- **WHEN** `getAccessToken()` returns a non-empty token
- **THEN** the client SHALL proceed with the streaming request

### Requirement: Handle authentication errors during streaming
The client SHALL detect and handle authentication-related HTTP errors from the streaming endpoint.

#### Scenario: 401 Unauthorized response
- **WHEN** the server responds with HTTP 401
- **THEN** the client SHALL invoke `onError('登录已过期，请重新登录')`

#### Scenario: 403 Forbidden response
- **WHEN** the server responds with HTTP 403
- **THEN** the client SHALL invoke `onError('登录已过期，请重新登录')`

#### Scenario: 429 Rate Limit response
- **WHEN** the server responds with HTTP 429
- **THEN** the client SHALL invoke `onError('请求过于频繁，请稍后再试')`

### Requirement: Log authentication debug information
The client SHALL log authentication-related information to aid in debugging streaming issues.

#### Scenario: Token retrieval logging
- **WHEN** the token is retrieved
- **THEN** the client SHALL log a truncated version of the token (first 20 characters)

#### Scenario: Request URL logging
- **WHEN** initiating the streaming request
- **THEN** the client SHALL log the full request URL

#### Scenario: Error response logging
- **WHEN** an HTTP error occurs
- **THEN** the client SHALL log the status code and error details
