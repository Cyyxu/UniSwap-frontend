import ReactDOM from 'react-dom/client'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { registerSW } from './utils/registerSW'
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ErrorBoundary>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </ErrorBoundary>
  // </React.StrictMode>,
)

