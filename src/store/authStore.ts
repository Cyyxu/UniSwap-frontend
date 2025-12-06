import { create } from 'zustand'

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

export const useAuthStore = create<AuthState>((set) => ({
  token: normalizeToken(localStorage.getItem('token')),
  user: getStoredUser(),
  setToken: (token: string) => {
    const normalized = normalizeToken(token)
    if (normalized) {
      localStorage.setItem('token', normalized)
      set({ token: normalized })
    } else {
      localStorage.removeItem('token')
      set({ token: null })
    }
  },
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },
}))
