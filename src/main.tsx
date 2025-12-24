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

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ErrorBoundary>
      <ConfigProvider locale={zhCN} theme={xyTheme}>
        <App />
      </ConfigProvider>
    </ErrorBoundary>
  // </React.StrictMode>,
)

