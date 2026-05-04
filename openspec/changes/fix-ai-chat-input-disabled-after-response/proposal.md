## Why

AI助手在回答完成后，输入框保持禁用状态，用户无法继续提问。这是因为Home页面的流式聊天函数没有正确识别后端返回的结束标记，导致loading状态未被清除。这严重影响了用户体验，使得用户必须刷新页面才能继续对话。

## What Changes

- 修复Home页面 `streamChat` 函数，使其能够识别后端的流结束标记 `{"errorCode":0,...}`
- 添加对多种SSE事件格式的兼容支持（大写/小写type字段）
- 确保在流结束时正确调用 `onDone()` 回调，清除loading状态
- 添加详细的调试日志，便于追踪流式数据处理过程

## Capabilities

### New Capabilities
- `stream-end-detection`: 检测并处理后端流式响应的结束标记，确保正确触发完成回调

### Modified Capabilities
- `sse-format-compatibility`: 扩展现有的SSE格式兼容性，支持更多事件类型变体（大写/小写）

## Impact

**受影响的文件：**
- `src/pages/Home/index.tsx` - 修改 `streamChat` 函数的SSE解析逻辑

**用户体验改进：**
- AI回答完成后，输入框立即恢复可用
- 用户可以连续进行多轮对话，无需刷新页面
- 错误情况下也能正确恢复输入框状态

**兼容性：**
- 向后兼容，支持所有现有的SSE格式
- 不影响AIChat页面（使用不同的API实现）
