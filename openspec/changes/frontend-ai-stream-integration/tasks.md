## 1. Update TypeScript Interfaces

- [x] 1.1 Update `AiChatRequest` interface to use `userInputText` field instead of `content`
- [x] 1.2 Add optional `commodityId` field to `AiChatRequest` interface for commodity context
- [x] 1.3 Verify TypeScript compilation passes with updated interface

## 2. Update Stream Method Implementation

- [x] 2.1 Update `stream()` method to send `userInputText` in request body instead of `content`
- [x] 2.2 Verify `Accept: text/event-stream` header is explicitly set in fetch request
- [x] 2.3 Verify `Content-Type: application/json` header is present in fetch request
- [x] 2.4 Update JSDoc comments to reflect the new request format

## 3. Update Method Signature

- [x] 3.1 Change `stream()` method signature from `stream(content: string, ...)` to accept `AiChatRequest` object
- [x] 3.2 Update internal request body construction to use the `AiChatRequest` object
- [x] 3.3 Maintain backward compatibility by accepting string parameter and converting to object internally

## 4. Verify Authentication Flow

- [x] 4.1 Confirm `getAccessToken()` is called before making the request
- [x] 4.2 Confirm `formatAuthToken()` is used to ensure Bearer prefix
- [x] 4.3 Verify Authorization header is included in the fetch request
- [x] 4.4 Verify token validation logic (empty/null check) is present

## 5. Verify Error Handling

- [x] 5.1 Confirm 401/403 errors trigger "登录已过期，请重新登录" message
- [x] 5.2 Confirm 429 errors trigger "请求过于频繁，请稍后再试" message
- [x] 5.3 Verify error response parsing attempts to extract error message from JSON
- [x] 5.4 Verify logging statements are present for debugging (token, URL, errors)

## 6. Verify SSE Response Parsing

- [x] 6.1 Confirm SSE data lines are parsed correctly (lines starting with "data: ")
- [x] 6.2 Confirm JSON parsing of SSE event objects
- [x] 6.3 Verify `onToken` callback is invoked for token events
- [x] 6.4 Verify `onDone` callback is invoked for done events
- [x] 6.5 Verify `onError` callback is invoked for error events
- [x] 6.6 Verify malformed JSON is handled gracefully with error logging

## 7. Testing and Verification

- [x] 7.1 Test with backend `/api/llm/stream` endpoint using valid authentication
- [x] 7.2 Test error scenarios (401, 403, 429 responses)
- [x] 7.3 Test SSE streaming with multiple token events
- [x] 7.4 Verify UI components using `aiApi.stream()` still work correctly
- [x] 7.5 Test with optional `commodityId` parameter

## 8. Documentation Updates

- [x] 8.1 Update inline comments in `src/api/ai.ts` to reflect new request format
- [x] 8.2 Update JSDoc for `stream()` method with new parameter structure
- [x] 8.3 Verify existing documentation in `docs/AI流式接口使用说明.md` is still accurate
