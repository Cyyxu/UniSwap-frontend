// src/utils/auth.ts
// Token 内存管理模块 - 不使用 localStorage 存储敏感信息

// 内存变量，刷新页面后会清空
let _accessToken: string = '';

/**
 * 获取 Access Token
 */
export const getAccessToken = (): string => _accessToken;

/**
 * 设置 Access Token
 */
export const setAccessToken = (token: string): void => {
  _accessToken = token;
};

/**
 * 清除 Access Token (登出时调用)
 */
export const clearAccessToken = (): void => {
  _accessToken = '';
};

/**
 * 检查是否有 Token
 */
export const hasAccessToken = (): boolean => {
  return !!_accessToken;
};
