## Context

The backend has implemented a new streaming AI endpoint at `/api/llm/stream` that uses Server-Sent Events (SSE) for real-time AI responses. The current frontend implementation in `src/api/ai.ts` has a mismatch in the request/response contract:

**Current State:**
- Frontend sends `{ content: "..." }` in request body
- Backend expects `{ userInputText: "..." }` (UserAiMessageDTO)
- Frontend already has SSE parsing logic and authentication handling
- The `stream()` method uses Fetch API with ReadableStream for SSE

**Constraints:**
- Must maintain backward compatibility with existing UI components using `aiApi.stream()`
- Must preserve existing authentication flow using `getAccessToken()` and `formatAuthToken()`
- Must keep existing error handling and logging patterns
- TypeScript strict mode is enabled

**Stakeholders:**
- Frontend developers using the AI chat feature
- UI components that display streaming AI responses
- Backend team maintaining the `/api/llm/stream` endpoint

## Goals / Non-Goals

**Goals:**
- Update request body format to match backend's `UserAiMessageDTO` contract
- Ensure proper SSE content negotiation with `Accept: text/event-stream` header
- Maintain existing authentication and error handling patterns
- Update TypeScript types to reflect the new contract
- Preserve the existing callback-based API for UI components

**Non-Goals:**
- Changing the callback-based API signature (keep `onToken`, `onDone`, `onError`)
- Implementing automatic token refresh for streaming (documented limitation)
- Modifying the SSE event parsing logic (already correct)
- Changing the authentication mechanism (already uses `getAccessToken()`)
- Adding new features beyond contract alignment

## Decisions

### Decision 1: Update request body field name only
**Choice:** Change the request body from `{ content }` to `{ userInputText }` while keeping all other logic intact.

**Rationale:**
- Minimal change reduces risk of introducing bugs
- Existing SSE parsing, authentication, and error handling are already correct
- The backend endpoint contract only differs in the request field name

**Alternatives Considered:**
- Rewrite the entire streaming implementation: Rejected - unnecessary complexity
- Add a translation layer: Rejected - adds overhead without benefit

### Decision 2: Update TypeScript interface to match backend DTO
**Choice:** Rename `AiChatRequest.content` to `AiChatRequest.userInputText` and add optional fields like `commodityId`.

**Rationale:**
- Provides compile-time type safety
- Makes the frontend-backend contract explicit
- Allows IDE autocomplete for optional fields

**Alternatives Considered:**
- Keep generic interface: Rejected - loses type safety
- Create separate interface: Rejected - unnecessary duplication

### Decision 3: Keep callback-based API signature
**Choice:** Maintain the existing `stream(content, onToken, onDone, onError)` signature but change the internal request format.

**Rationale:**
- No breaking changes for existing UI components
- The callback pattern is already well-established in the codebase
- Internal implementation details can change without affecting consumers

**Alternatives Considered:**
- Change to Promise-based API: Rejected - breaking change for all consumers
- Add new method alongside old one: Rejected - creates confusion and maintenance burden

### Decision 4: Verify Accept header is present
**Choice:** Explicitly set `Accept: text/event-stream` in the fetch headers.

**Rationale:**
- Ensures proper content negotiation with the backend
- Prevents `HttpMediaTypeNotAcceptableException` errors
- Makes the SSE requirement explicit in code

**Alternatives Considered:**
- Rely on browser defaults: Rejected - browsers may send `*/*` or `application/json`
- Let backend handle any Accept header: Rejected - backend explicitly requires `text/event-stream`

## Risks / Trade-offs

**Risk:** Existing UI components may break if they rely on the old request format
→ **Mitigation:** The change is internal to `ai.ts`; the public API signature remains the same. Review all usages of `aiApi.stream()` to ensure they only pass the message content.

**Risk:** TypeScript interface change may cause compile errors in consuming code
→ **Mitigation:** The interface change is a simple field rename. TypeScript will catch any issues at compile time, making them easy to fix.

**Trade-off:** Not implementing automatic token refresh for streaming
→ **Acceptance:** This is a documented limitation. Streaming connections are long-lived and token refresh during an active stream is complex. Users will need to re-authenticate if the token expires during a stream.

**Risk:** Backend may change the SSE event format in the future
→ **Mitigation:** The SSE parsing logic is isolated in the `stream()` method. Future changes can be handled by updating the parsing logic without affecting the callback API.

## Migration Plan

**Deployment Steps:**
1. Update `AiChatRequest` interface in `src/api/ai.ts`
2. Update the `stream()` method to send `userInputText` instead of `content`
3. Verify `Accept: text/event-stream` header is present
4. Run TypeScript compiler to catch any type errors
5. Test with the backend `/api/llm/stream` endpoint
6. Deploy to production

**Rollback Strategy:**
- If issues arise, revert the single commit that changes the request format
- No database migrations or infrastructure changes required
- No breaking changes to the public API

**Testing:**
- Manual testing with Postman/curl to verify request format
- Integration testing with the backend endpoint
- UI testing to ensure streaming still works in components

## Open Questions

None - the change is straightforward and well-defined by the backend contract.
