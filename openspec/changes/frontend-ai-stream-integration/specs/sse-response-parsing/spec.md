## ADDED Requirements

### Requirement: Parse SSE data lines correctly
The client SHALL parse Server-Sent Events (SSE) responses by reading lines prefixed with `data: ` and extracting the JSON payload.

#### Scenario: Receiving a token event
- **WHEN** the SSE stream sends a line like `data: {"type":"token","content":"Hello"}`
- **THEN** the client SHALL parse the JSON and extract the token content

#### Scenario: Receiving a done event
- **WHEN** the SSE stream sends a line like `data: {"type":"done","messageId":123}`
- **THEN** the client SHALL parse the JSON and extract the message ID

#### Scenario: Receiving an error event
- **WHEN** the SSE stream sends a line like `data: {"type":"error","message":"Rate limit exceeded"}`
- **THEN** the client SHALL parse the JSON and extract the error message

### Requirement: Handle streaming response with ReadableStream
The client SHALL use the Fetch API's `response.body.getReader()` to process the SSE stream incrementally.

#### Scenario: Reading stream chunks
- **WHEN** the server sends SSE data in multiple chunks
- **THEN** the client SHALL read each chunk using `reader.read()` and decode it with `TextDecoder`

#### Scenario: Stream completion
- **WHEN** the server closes the SSE connection
- **THEN** the `reader.read()` SHALL return `{ done: true }` and the client SHALL exit the read loop

### Requirement: Invoke callbacks based on event type
The client SHALL invoke the appropriate callback function based on the SSE event type received.

#### Scenario: Token event triggers onToken callback
- **WHEN** an SSE event with `type: "token"` is received
- **THEN** the `onToken(content)` callback SHALL be invoked with the token content

#### Scenario: Done event triggers onDone callback
- **WHEN** an SSE event with `type: "done"` is received
- **THEN** the `onDone(messageId)` callback SHALL be invoked with the message ID

#### Scenario: Error event triggers onError callback
- **WHEN** an SSE event with `type: "error"` is received
- **THEN** the `onError(message)` callback SHALL be invoked with the error message

### Requirement: Handle malformed SSE data gracefully
The client SHALL handle parsing errors without crashing the stream processing.

#### Scenario: Invalid JSON in SSE data
- **WHEN** an SSE data line contains invalid JSON
- **THEN** the client SHALL log the error and continue processing subsequent events

#### Scenario: Missing required fields
- **WHEN** an SSE event is missing required fields (e.g., `content` for token event)
- **THEN** the client SHALL skip that event and continue processing
