## Why

The backend has implemented a new streaming AI chat endpoint (`/api/llm/stream`) that uses Server-Sent Events (SSE) with a different request/response format than the current implementation. The frontend needs to be updated to properly integrate with this new endpoint, including correct HTTP headers (`Accept: text/event-stream`), request body format (`UserAiMessageDTO` with `userInputText` field), and SSE response parsing.

## What Changes

- Update the AI API client to match the new backend endpoint contract
- Change request body field from `content` to `userInputText` to match `UserAiMessageDTO`
- Add proper `Accept: text/event-stream` header for SSE streaming
- Update SSE response parsing to handle the new backend response format
- Ensure authentication token is properly included in streaming requests
- Update any UI components that use the AI streaming functionality
- Add error handling for common streaming issues (401/403 auth errors, 429 rate limiting)

## Capabilities

### New Capabilities
- `stream-request-format`: Handle the new request format with `userInputText` field matching backend's `UserAiMessageDTO`
- `sse-response-parsing`: Parse SSE responses from the new backend streaming endpoint format

### Modified Capabilities
- `ai-stream-authentication`: Update authentication to work with the new streaming endpoint requirements

## Impact

- **API Layer**: `src/api/ai.ts` - Update `stream` method signature and implementation
- **Type Definitions**: Update `AiChatRequest` interface to match backend DTO
- **Components**: Any components using `aiApi.stream()` may need updates if they rely on the old request format
- **Documentation**: Update inline comments and JSDoc to reflect new endpoint behavior
- **Error Handling**: Enhanced error messages for streaming-specific issues
