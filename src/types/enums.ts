/**
 * 字典类型枚举
 * 与后端 DictEnum.DictTypeEnum 保持一致
 */
export enum DictTypeEnum {
  /** 用户角色 */
  USER_ROLE = 'USER_ROLE',
  
  /** 商品状态 */
  COMMODITY_STATUS = 'COMMODITY_STATUS',
  
  /** 商品新旧程度 */
  COMMODITY_DEGREE = 'COMMODITY_DEGREE',
  
  /** 订单状态 */
  ORDER_STATUS = 'ORDER_STATUS',
  
  /** 支付状态 */
  PAYMENT_STATUS = 'PAYMENT_STATUS',
  
  /** 帖子审核状态 */
  POST_REVIEW_STATUS = 'POST_REVIEW_STATUS',
  
  /** AI服务类型 */
  AI_SERVICE_TYPE = 'AI_SERVICE_TYPE',
  
  /** 消息类型 */
  MESSAGE_TYPE = 'MESSAGE_TYPE',
  
  /** 性别 */
  GENDER = 'GENDER',
  
  /** 商品分类 */
  COMMODITY_TYPE = 'COMMODITY_TYPE',
  
  /** 举报类型 */
  REPORT_TYPE = 'REPORT_TYPE',
  
  /** 通知类型 */
  NOTICE_TYPE = 'NOTICE_TYPE',
  
  /** 评分等级 */
  SCORE_LEVEL = 'SCORE_LEVEL',
  
  /** Redis缓存配置 */
  REDIS_CONFIG = 'REDIS_CONFIG',
  
  /** AI推荐配置 */
  AI_RECOMMEND_CONFIG = 'AI_RECOMMEND_CONFIG',
  
  /** 文件上传类型 */
  UPLOAD_FILE_TYPE = 'UPLOAD_FILE_TYPE',
  
  /** 排序方式 */
  SORT_ORDER = 'SORT_ORDER',
  
  /** 排序字段 */
  SORT_FIELD = 'SORT_FIELD',
}

/**
 * 字典项接口
 */
export interface SystemDict {
  code: string
  name: string
}
