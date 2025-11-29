import { Select } from 'antd'
import { useSystemDict, DictUtils } from '../hooks/useSystemDict'
import { DictTypeEnum } from '../types/enums'

/**
 * 字典使用示例组件
 */
export const DictUsageExample = () => {
  // 方式1: 使用 Hook 获取字典数据
  const { dictList: degreeList, loading: degreeLoading } = useSystemDict(DictTypeEnum.COMMODITY_DEGREE)
  const { dictList: statusList, loading: statusLoading } = useSystemDict(DictTypeEnum.COMMODITY_STATUS)

  // 示例：根据 code 显示 name
  const displayName = DictUtils.getNameByCode(degreeList, '全新')
  console.log('商品新旧程度:', displayName) // 输出: 全新

  return (
    <div>
      {/* 示例1: 商品新旧程度下拉框 */}
      <Select
        placeholder="请选择商品新旧程度"
        loading={degreeLoading}
        style={{ width: 200 }}
      >
        {degreeList.map(item => (
          <Select.Option key={item.code} value={item.code}>
            {item.name}
          </Select.Option>
        ))}
      </Select>

      {/* 示例2: 商品状态下拉框 */}
      <Select
        placeholder="请选择商品状态"
        loading={statusLoading}
        style={{ width: 200, marginLeft: 16 }}
      >
        {statusList.map(item => (
          <Select.Option key={item.code} value={item.code}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

/**
 * 直接调用 API 的示例
 */
export const DirectApiExample = async () => {
  const { systemApi } = await import('../api/system')
  
  // 获取商品新旧程度字典
  const degreeList = await systemApi.getDictByType(DictTypeEnum.COMMODITY_DEGREE)
  console.log('商品新旧程度列表:', degreeList)
  // 输出: [
  //   { code: "全新", name: "全新" },
  //   { code: "几乎全新", name: "几乎全新" },
  //   ...
  // ]

  // 获取订单状态字典
  const orderStatusList = await systemApi.getDictByType(DictTypeEnum.ORDER_STATUS)
  console.log('订单状态列表:', orderStatusList)
  // 输出: [
  //   { code: "0", name: "待支付" },
  //   { code: "1", name: "已支付" },
  //   ...
  // ]
}
