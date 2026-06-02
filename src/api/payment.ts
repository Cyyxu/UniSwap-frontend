import { getAccessToken } from '../utils/auth'
import { useAuthStore } from '../store/authStore'

/**
 * 支付方式枚举
 */
export enum PaymentMethod {
  WALLET = 'WALLET',   // 钱包支付
  ALIPAY = 'ALIPAY',   // 支付宝支付
}

/**
 * 支付状态枚举
 */
export enum PaymentStatus {
  PENDING = 'PENDING',       // 待支付
  SUCCESS = 'SUCCESS',       // 支付成功
  FAILED = 'FAILED',         // 支付失败
  CANCELLED = 'CANCELLED',   // 已取消
}

/**
 * 立即购买请求
 */
export interface DirectBuyRequest {
  userId: number
  commodityId: number
  buyNumber: number
  receiverName: string     // 收货人姓名 (必填)
  receiverPhone: string    // 收货人电话 (必填)
  receiverAddress: string  // 收货地址 (必填)
  remark?: string         // 订单备注 (可选)
}

/**
 * 购物车结算请求
 */
export interface CartCheckoutRequest {
  cartItemIds: number[]  // 购物车项ID列表
  paymentMethod: string  // "WALLET" 或 "ALIPAY"
  payPassword?: string   // 钱包支付时必填
}

/**
 * 订单详情结果
 */
export interface OrderDetailResult {
  success: boolean
  message?: string
  data: {
    id: number
    orderNo: string
    userId: number
    commodityId: number
    buyNumber: number
    paymentAmount: number
    payStatus: number
    remark?: string
    createdAt: string
    updatedAt: string
  }
}

/**
 * 订单创建结果
 */
export interface OrderCreateResult {
  success: boolean
  message?: string
  data: {
    orderNo: string
    orders?: Array<{ orderNo: string }>
  }
}

/**
 * 支付流程处理类
 */
export class PaymentFlow {
  private baseUrl = '/uniswap/api'

  /**
   * 商品立即购买流程
   */
  async buyNow(
    commodityId: number, 
    quantity: number, 
    receiverInfo: {
      receiverName: string
      receiverPhone: string
      receiverAddress: string
      remark?: string
    }
  ): Promise<void> {
    try {
      console.log('正在创建订单...')
      
      // 获取用户ID
      const userId = this.getUserId()
      if (!userId) {
        throw new Error('用户未登录，请先登录')
      }
      
      // 1. 创建订单，获取订单ID
      const orderResponse = await this.createOrder({
        userId,
        commodityId,
        buyNumber: quantity,
        receiverName: receiverInfo.receiverName,
        receiverPhone: receiverInfo.receiverPhone,
        receiverAddress: receiverInfo.receiverAddress,
        remark: receiverInfo.remark
      })

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || '创建订单失败')
      }

      const orderId = orderResponse.data.orderNo // 这里实际是订单ID
      console.log('订单创建成功，订单ID:', orderId)

      // 2. 获取订单详情，拿到订单号
      console.log('正在获取订单详情...')
      const orderDetail = await this.getOrderDetail(orderId)
      
      if (!orderDetail.success) {
        throw new Error(orderDetail.message || '获取订单详情失败')
      }

      const orderNo = orderDetail.data.orderNo
      console.log('获取订单号成功:', orderNo)

      // 3. 跳转到支付宝支付
      this.redirectToAlipay(orderNo)
    } catch (error: any) {
      console.error('购买失败:', error)
      throw error
    }
  }

  /**
   * 购物车结算流程
   */
  async checkoutCart(cartItemIds: number[], paymentMethod: string = 'ALIPAY', payPassword?: string): Promise<void> {
    try {
      console.log('正在结算购物车...')
      
      const orderResponse = await this.createBatchOrders({
        cartItemIds,
        paymentMethod,
        payPassword
      })

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || '结算失败')
      }

      // 如果只有一个订单，直接跳转支付
      const orders = orderResponse.data.orders || []
      if (orders.length === 1) {
        if (paymentMethod === 'ALIPAY') {
          this.redirectToAlipay(orders[0].orderNo)
        }
      } else if (orders.length > 1) {
        // 多个订单，跳转到订单列表让用户逐个支付
        alert('订单创建成功，请到订单页面完成支付')
        window.location.href = '/orders'
      } else {
        // 使用单个订单号
        if (paymentMethod === 'ALIPAY') {
          this.redirectToAlipay(orderResponse.data.orderNo)
        }
      }
    } catch (error: any) {
      console.error('结算失败:', error)
      throw error
    }
  }

  /**
   * 跳转到支付宝支付
   */
  redirectToAlipay(orderNo: string): void {
    console.log('正在跳转到支付宝支付，订单号:', orderNo)
    // 使用正确的支付宝接口路径，无需认证
    window.location.href = `${this.baseUrl}/alipay/aliPayOrder?orderSn=${orderNo}`
  }

  /**
   * 创建订单
   */
  private async createOrder(orderData: DirectBuyRequest): Promise<OrderCreateResult> {
    const token = this.getToken()
    console.log('[PaymentFlow] 创建订单 - Token:', token ? `${token.substring(0, 10)}...` : '无Token')
    console.log('[PaymentFlow] 创建订单 - Token长度:', token ? token.length : 0)
    console.log('[PaymentFlow] 创建订单 - 请求数据:', orderData)
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
    console.log('[PaymentFlow] 创建订单 - 请求头:', {
      'Content-Type': headers['Content-Type'],
      'Authorization': headers['Authorization'].substring(0, 20) + '...'
    })
    
    const response = await fetch(`${this.baseUrl}/order/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    })

    console.log('[PaymentFlow] 创建订单 - 响应状态:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[PaymentFlow] 创建订单失败 - 错误响应:', errorText)
      
      // 特殊处理401错误
      if (response.status === 401) {
        console.error('[PaymentFlow] 认证失败 - Token可能已过期或无效')
        console.error('[PaymentFlow] 当前Token:', token ? `${token.substring(0, 20)}...` : '无Token')
        throw new Error('登录已过期，请重新登录')
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('[PaymentFlow] 创建订单响应:', result)
    
    // 检查后端统一响应格式
    if (result.errorCode !== 0) {
      console.error('[PaymentFlow] 创建订单失败 - 业务错误:', result.errorMsg)
      throw new Error(result.errorMsg || '创建订单失败')
    }
    
    // 获取订单ID
    const orderId = result.data
    console.log('[PaymentFlow] 解析得到订单ID:', orderId)
    
    if (!orderId) {
      throw new Error('创建订单成功但未返回订单ID')
    }
    
    // 返回统一格式
    return {
      success: true,
      data: {
        orderNo: orderId.toString() // 这里实际是订单ID
      }
    }
  }

  /**
   * 批量创建订单
   */
  private async createBatchOrders(orderData: CartCheckoutRequest): Promise<OrderCreateResult> {
    const response = await fetch(`${this.baseUrl}/payment/cart-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * 获取token
   */
  private getToken(): string {
    // 方法1: 从内存获取
    let token = getAccessToken()
    console.log('[PaymentFlow] 获取Token - 方法1 getAccessToken():', token ? `${token.substring(0, 10)}...` : '空')
    
    // 方法2: 从 authStore 获取
    if (!token) {
      try {
        const authState = useAuthStore.getState()
        token = authState.token || ''
        console.log('[PaymentFlow] 获取Token - 方法2 authStore:', token ? `${token.substring(0, 10)}...` : '空')
      } catch (error) {
        console.warn('[PaymentFlow] 获取Token - authStore 获取失败:', error)
      }
    }
    
    // 方法3: 从 localStorage 获取（备用）
    if (!token) {
      token = localStorage.getItem('accessToken') || localStorage.getItem('token') || ''
      console.log('[PaymentFlow] 获取Token - 方法3 localStorage:', token ? `${token.substring(0, 10)}...` : '空')
    }
    
    console.log('[PaymentFlow] 最终Token:', token ? '有效' : '无效')
    return token
  }

  /**
   * 获取订单详情
   */
  private async getOrderDetail(orderId: string): Promise<OrderDetailResult> {
    const token = this.getToken()
    console.log('[PaymentFlow] 获取订单详情 - 订单ID:', orderId)
    
    const response = await fetch(`${this.baseUrl}/order/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ id: Number(orderId) })
    })

    console.log('[PaymentFlow] 获取订单详情 - 响应状态:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[PaymentFlow] 获取订单详情失败 - 错误响应:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('[PaymentFlow] 订单详情响应:', result)
    
    // 检查后端统一响应格式
    if (result.errorCode !== 0) {
      console.error('[PaymentFlow] 获取订单详情失败 - 业务错误:', result.errorMsg)
      throw new Error(result.errorMsg || '获取订单详情失败')
    }
    
    // 返回统一格式
    return {
      success: true,
      data: result.data
    }
  }

  /**
   * 获取用户ID
   */
  private getUserId(): number | null {
    try {
      // 方法1: 从 authStore 获取用户信息
      const authState = useAuthStore.getState()
      if (authState.user?.id) {
        console.log('[PaymentFlow] 获取用户ID - authStore:', authState.user.id)
        return authState.user.id
      }
      
      // 方法2: 从 localStorage 获取用户信息（备用）
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user?.id) {
          console.log('[PaymentFlow] 获取用户ID - localStorage:', user.id)
          return user.id
        }
      }
      
      console.warn('[PaymentFlow] 无法获取用户ID')
      return null
    } catch (error) {
      console.error('[PaymentFlow] 获取用户ID失败:', error)
      return null
    }
  }
}

/**
 * 支付状态轮询检查器
 */
export class PaymentStatusChecker {
  private baseUrl = '/uniswap/api'
  private pollingInterval: number | null = null

  /**
   * 开始轮询支付状态
   */
  startPolling(orderNo: string, callback: (status: string, data?: any) => void): void {
    console.log('开始轮询支付状态:', orderNo)
    
    this.pollingInterval = setInterval(async () => {
      try {
        const status = await this.checkPaymentStatus(orderNo)
        if (status && status.orderStatus === 'PAID') {
          this.stopPolling()
          callback('success', status)
        }
      } catch (error) {
        console.error('查询支付状态失败:', error)
      }
    }, 3000) // 每3秒查询一次

    // 30秒后停止轮询
    setTimeout(() => {
      this.stopPolling()
      callback('timeout')
    }, 30000)
  }

  /**
   * 停止轮询
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }

  /**
   * 查询支付状态
   */
  private async checkPaymentStatus(orderNo: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/order/status?orderNo=${orderNo}`, {
      headers: {
        'Authorization': 'Bearer ' + this.getToken()
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return result.success ? result.data : null
  }

  /**
   * 获取token
   */
  private getToken(): string {
    return getAccessToken() || ''
  }
}

// 导出单例实例
export const paymentFlow = new PaymentFlow()
export const paymentStatusChecker = new PaymentStatusChecker()
