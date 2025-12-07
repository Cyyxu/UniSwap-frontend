import { Component, ErrorInfo, ReactNode } from 'react'
import { Result, Button, Typography } from 'antd'
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons'

const { Paragraph, Text } = Typography

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * 全局错误边界组件
 * 捕获子组件树中的 JavaScript 错误并显示降级 UI
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })

    // 可以在这里上报错误到监控平台
    // reportError(error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isDev = import.meta.env.DEV

      return (
        <div style={{ padding: 24, minHeight: '100vh', background: '#f5f5f5' }}>
          <Result
            status="error"
            title="页面出错了"
            subTitle="抱歉，页面发生了一些错误。请尝试刷新页面或返回首页。"
            extra={[
              <Button
                key="retry"
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleRetry}
              >
                重试
              </Button>,
              <Button key="reload" onClick={this.handleReload}>
                刷新页面
              </Button>,
              <Button key="home" icon={<HomeOutlined />} onClick={this.handleGoHome}>
                返回首页
              </Button>,
            ]}
          >
            {isDev && this.state.error && (
              <div style={{ textAlign: 'left', marginTop: 24 }}>
                <Paragraph>
                  <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                    错误信息：
                  </Text>
                </Paragraph>
                <Paragraph>
                  <Text code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {this.state.error.toString()}
                  </Text>
                </Paragraph>
                {this.state.errorInfo && (
                  <>
                    <Paragraph>
                      <Text strong style={{ fontSize: 16 }}>
                        错误堆栈：
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <pre
                        style={{
                          fontSize: 12,
                          background: '#f6f6f6',
                          padding: 12,
                          borderRadius: 4,
                          overflow: 'auto',
                          maxHeight: 300,
                        }}
                      >
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </Paragraph>
                  </>
                )}
              </div>
            )}
          </Result>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
