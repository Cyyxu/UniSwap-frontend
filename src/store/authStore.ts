import { create } from 'zustand'
import { getAccessToken, setAccessToken, clearAccessToken } from '../utils/auth'

interface User {
  id: number
  userAccount: string
  userName: string
  userAvatar: string
  userRole: string
}

interface AuthState {
  token: string | null
  user: User | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const normalizeToken = (token: string | null) => {
  if (!token) return null
  // 后端有时会返回已包含 Bearer 的 token，这里统一去掉前缀，避免重复拼接
  return token.replace(/^Bearer\s+/i, '')
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) as User : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // token 现在只用于状态同步，实际值存在内存中
  token: getAccessToken() || null,
  user: getStoredUser(),
  
  setToken: (token: string) => {
    const normalized = normalizeToken(token)
    if (normalized) {
      // 存入内存而非 localStorage
      setAccessToken(normalized)
      set({ token: normalized })
    } else {
      clearAccessToken()
      set({ token: null })
    }
  },
  
  setUser: (user: User) => {
    // 用户信息可以存 localStorage（非敏感信息）
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
  
  logout: () => {
    // 清除内存中的 token
    clearAccessToken()
    // 清除 localStorage 中的用户信息
    localStorage.removeItem('user')
    // 清除旧的 token（兼容性）
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },
  
  isAuthenticated: () => {
    return !!getAccessToken()
  },
}))
