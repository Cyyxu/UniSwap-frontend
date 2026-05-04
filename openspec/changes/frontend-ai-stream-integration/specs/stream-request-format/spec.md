## ADDED Requirements

### Requirement: Request body SHALL use userInputText field
The AI streaming API client SHALL send requests with a `userInputText` field in the request body to match the backend's `UserAiMessageDTO` contract.

#### Scenario: Sending a chat message
- **WHEN** the user sends a chat message through the streaming API
- **THEN** the request body SHALL contain `{ userInputText: "<message>" }` instead of `{ content: "<message>" }`

#### Scenario: Optional commodity context
- **WHEN** the user sends a chat message with commodity context
- **THEN** the request body SHALL contain both `userInputText` and `commodityId` fields

### Requirement: Request SHALL include Accept header for SSE
The AI streaming API client SHALL include the `Accept: text/event-stream` header to properly negotiate SSE content type with the backend.

#### Scenario: Making a streaming request
- **WHEN** the client initiates a streaming chat request
- **THEN** the HTTP request SHALL include header `Accept: text/event-stream`

#### Scenario: Content-Type header
- **WHEN** the client initiates a streaming chat request
- **THEN** the HTTP request SHALL include header `Content-Type: application/json`

### Requirement: TypeScript interface SHALL match backend DTO
The `AiChatRequest` TypeScript interface SHALL be updated to reflect the backend's `UserAiMessageDTO` structure.

#### Scenario: Type checking at compile time
- **WHEN** developers use the `aiApi.stream()` method
- **THEN** TypeScript SHALL enforce the correct request structure with `userInputText` field

#### Scenario: Optional fields support
- **WHEN** the request includes optional fields like `commodityId`
- **THEN** TypeScript SHALL allow these fields without type errors
