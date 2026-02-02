import ReactDOM from 'react-dom/client'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { registerSW } from './utils/registerSW'
import { setAccessToken } from './utils/auth'
import { useAuthStore } from './store/authStore'
import axios from 'axios'
import './index.css'

// 注册 Service Worker
registerSW({
  onOfflineReady: () => {
    message.success('应用已可离线使用')
  },
  onNeedRefresh: () => {
    message.info('发现新版本，请刷新页面')
  },
})

// 闲鱼黄主题配置
const xyTheme = {
  token: {
    colorPrimary: '#FF6B00',
    colorLink: '#FF6B00',
    colorLinkHover: '#FF9500',
    colorLinkActive: '#FF6B00',
    borderRadius: 8,
  },
  components: {
    Button: {
      colorPrimary: '#FF6B00',
      colorPrimaryHover: '#FF9500',
      colorPrimaryActive: '#FF6B00',
      algorithm: true,
    },
    Menu: {
      colorItemTextSelected: '#FF6B00',
      colorItemBgSelected: '#FFF9E6',
    },
    Tabs: {
      colorPrimary: '#FF6B00',
      inkBarColor: '#FF6B00',
    },
    Switch: {
      colorPrimary: '#FF6B00',
    },
    Checkbox: {
      colorPrimary: '#FF6B00',
    },
    Radio: {
      colorPrimary: '#FF6B00',
    },
    Slider: {
      colorPrimary: '#FF6B00',
    },
    Progress: {
      colorInfo: '#FF6B00',
    },
    Rate: {
      colorFillContent: '#FFCC00',
    },
  },
}

/**
 * 应用初始化：尝试静默刷新 Token
 * 解决刷新页面后内存 Token 丢失的问题
 */
async function initApp() {
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  
  try {
    console.log('[App Init] 尝试静默刷新 Token...')
    
    // 获取 API 基础路径
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/uniswap'
    
    // 调用刷新接口（Cookie 会自动带上 Refresh Token）
    const response = await axios.post(
      `${baseURL}/api/user/refresh`,
      {},
      { 
        withCredentials: true,
        timeout: 5000 // 设置较短超时，避免阻塞太久
      }
    )
    
    // 🔍 打印完整响应结构，方便调试
    console.log('[App Init] 刷新接口完整响应:', response.data)
    
    // 根据后端返回结构提取 Token
    // 后端返回格式：{ errorCode: 0, data: { accessToken: 'xxx' } }
    let accessToken: string | null = null
    
    if (response.data?.errorCode === 0) {
      // 标准格式：Result<RefreshResponse>
      accessToken = response.data.data?.accessToken
      console.log('[App Init] 从 data.data.accessToken 提取:', accessToken ? '成功' : '失败')
    } else if (response.data?.accessToken) {
      // 兼容格式：直接返回 { accessToken: 'xxx' }
      accessToken = response.data.accessToken
      console.log('[App Init] 从 data.accessToken 提取:', accessToken ? '成功' : '失败')
    }
    
    if (accessToken && typeof accessToken === 'string' && accessToken.length > 0) {
      console.log('[App Init] ✅ 静默刷新成功，恢复登录态')
      console.log('[App Init] Token 前缀:', accessToken.substring(0, 20) + '...')
      
      // 同时更新内存变量和 Store
      setAccessToken(accessToken)
      useAuthStore.getState().setToken(accessToken)
    } else {
      console.warn('[App Init] ⚠️ 未返回有效 Token，响应数据:', response.data)
    }
  } catch (error: any) {
    console.log('[App Init] 静默刷新失败（未登录或登录已过期）')
    if (error.response) {
      console.log('[App Init] 错误状态码:', error.response.status)
      console.log('[App Init] 错误数据:', error.response.data)
    } else {
      console.log('[App Init] 错误信息:', error.message)
    }
    // 不做处理，让用户停留在当前页或被路由守卫拦截
  }
  
  // ⚠️ 关键：必须在 await 结束后才渲染应用
  // 这样能保证 App 渲染时的第一个请求一定能拿到 Token
  root.render(
    <ErrorBoundary>
      <ConfigProvider locale={zhCN} theme={xyTheme}>
        <App />
      </ConfigProvider>
    </ErrorBoundary>
  )
}

// 启动应用
initApp()

