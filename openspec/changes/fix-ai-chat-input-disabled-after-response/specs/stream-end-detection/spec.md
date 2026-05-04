## ADDED Requirements

### Requirement: Detect backend stream end marker
The system SHALL detect when the backend SSE stream has ended by recognizing the JSON response containing `errorCode` field.

#### Scenario: Stream ends with success marker
- **WHEN** the SSE stream receives a line containing `{"errorCode":0,"errorMsg":"操作成功",...}`
- **THEN** the system SHALL call the `onDone()` callback immediately
- **AND** the system SHALL exit the stream processing loop
- **AND** the loading state SHALL be set to false

#### Scenario: Stream ends with error marker
- **WHEN** the SSE stream receives a line containing `{"errorCode":<non-zero>,...}`
- **THEN** the system SHALL call the `onDone()` callback
- **AND** the system SHALL exit the stream processing loop

### Requirement: Call completion callback on stream end
The system SHALL invoke the `onDone()` callback when the stream processing completes, ensuring the UI loading state is cleared.

#### Scenario: Completion callback clears loading state
- **WHEN** `onDone()` callback is invoked
- **THEN** the `aiLoading` state SHALL be set to false
- **AND** the input field SHALL become enabled
- **AND** the user SHALL be able to send new messages

#### Scenario: Completion callback is called exactly once
- **WHEN** the stream ends normally
- **THEN** the `onDone()` callback SHALL be called exactly once
- **AND** no duplicate state updates SHALL occur

### Requirement: Exit stream loop immediately after detection
The system SHALL exit the stream processing loop immediately after detecting the end marker to prevent processing additional data.

#### Scenario: No data processed after end marker
- **WHEN** the end marker is detected
- **THEN** the system SHALL call `onDone()` and return from the processing function
- **AND** no subsequent data lines SHALL be processed
- **AND** the loop SHALL not continue iterating

### Requirement: Log stream end detection for debugging
The system SHALL log when the stream end marker is detected to aid in debugging and monitoring.

#### Scenario: End marker detection is logged
- **WHEN** the end marker `{"errorCode":0,...}` is detected
- **THEN** the system SHALL log a message containing "[Stream] 收到结束标记"
- **AND** the log SHALL include the parsed end marker object
