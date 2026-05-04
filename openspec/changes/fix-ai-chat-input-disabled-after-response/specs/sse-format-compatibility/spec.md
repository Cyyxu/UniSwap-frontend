## ADDED Requirements

### Requirement: Support uppercase event type names
The system SHALL recognize SSE events with uppercase type field values (`MESSAGE`, `DONE`, `ERROR`).

#### Scenario: Process MESSAGE event with uppercase type
- **WHEN** the SSE stream receives `{"type":"MESSAGE","content":"text"}`
- **THEN** the system SHALL call `onMessage("text")`
- **AND** the message content SHALL be displayed in the UI

#### Scenario: Process DONE event with uppercase type
- **WHEN** the SSE stream receives `{"type":"DONE","messageId":123}`
- **THEN** the system SHALL call `onDone(123)`
- **AND** the loading state SHALL be cleared

#### Scenario: Process ERROR event with uppercase type
- **WHEN** the SSE stream receives `{"type":"ERROR","content":"error message"}`
- **THEN** the system SHALL call `onError("error message")`
- **AND** the error SHALL be displayed to the user

### Requirement: Support lowercase event type names
The system SHALL recognize SSE events with lowercase type field values (`token`, `done`, `error`).

#### Scenario: Process token event with lowercase type
- **WHEN** the SSE stream receives `{"type":"token","content":"text"}`
- **THEN** the system SHALL call `onMessage("text")`
- **AND** the message content SHALL be displayed in the UI

#### Scenario: Process done event with lowercase type
- **WHEN** the SSE stream receives `{"type":"done","messageId":123}`
- **THEN** the system SHALL call `onDone(123)`
- **AND** the loading state SHALL be cleared

#### Scenario: Process error event with lowercase type
- **WHEN** the SSE stream receives `{"type":"error","message":"error message"}`
- **THEN** the system SHALL call `onError("error message")`
- **AND** the error SHALL be displayed to the user

### Requirement: Handle error message field variations
The system SHALL support both `content` and `message` fields for error events.

#### Scenario: Error with content field
- **WHEN** the SSE stream receives `{"type":"error","content":"error text"}`
- **THEN** the system SHALL extract the error from the `content` field
- **AND** call `onError("error text")`

#### Scenario: Error with message field
- **WHEN** the SSE stream receives `{"type":"error","message":"error text"}`
- **THEN** the system SHALL extract the error from the `message` field
- **AND** call `onError("error text")`

#### Scenario: Error with both fields prefers message
- **WHEN** the SSE stream receives `{"type":"error","message":"msg","content":"cnt"}`
- **THEN** the system SHALL use the `message` field value
- **AND** call `onError("msg")`

### Requirement: Maintain backward compatibility with existing formats
The system SHALL continue to support all previously working SSE event formats without breaking existing functionality.

#### Scenario: Plain text format still works
- **WHEN** the SSE stream receives plain text like `data:你好`
- **THEN** the system SHALL call `onMessage("你好")`
- **AND** the text SHALL be displayed correctly

#### Scenario: Mixed format stream is handled
- **WHEN** the SSE stream contains both JSON and plain text events
- **THEN** the system SHALL process each event according to its format
- **AND** all messages SHALL be displayed correctly
