# 系统字典使用指南

## 概述

前端使用枚举类型与后端字典系统对接，实现前后端数据字典的统一管理。

## 文件结构

```
src/
├── types/
│   └── enums.ts              # 字典类型枚举定义
├── api/
│   └── system.ts             # 系统字典 API
├── hooks/
│   └── useSystemDict.ts      # 字典 Hook 和工具类
└── examples/
    └── DictUsageExample.tsx  # 使用示例
```

## 核心文件

### 1. 枚举定义 (`types/enums.ts`)

```typescript
export enum DictTypeEnum {
  USER_ROLE = 'USER_ROLE',
  COMMODITY_STATUS = 'COMMODITY_STATUS',
  COMMODITY_DEGREE = 'COMMODITY_DEGREE',
  // ... 其他枚举
}

export interface SystemDict {
  code: string
  name: string
}
```

### 2. API 接口 (`api/system.ts`)

```typescript
export const systemApi = {
  getDictByType: (type: DictTypeEnum): Promise<SystemDict[]> => {
    return api.get(`/system?type=${type}`)
  },
}
```

### 3. Hook (`hooks/useSystemDict.ts`)

```typescript
export const useSystemDict = (type: DictTypeEnum) => {
  const { dictList, loading } = useSystemDict(DictTypeEnum.COMMODITY_DEGREE)
  // ...
}
```

## 使用方式

### 方式1: 使用 Hook（推荐）

```tsx
import { useSystemDict } from '@/hooks/useSystemDict'
import { DictTypeEnum } from '@/types/enums'
import { Select } from 'antd'

const MyComponent = () => {
  const { dictList, loading } = useSystemDict(DictTypeEnum.COMMODITY_DEGREE)

  return (
    <Select loading={loading}>
      {dictList.map(item => (
        <Select.Option key={item.code} value={item.code}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  )
}
```

### 方式2: 直接调用 API

```typescript
import { systemApi } from '@/api/system'
import { DictTypeEnum } from '@/types/enums'

const fetchDict = async () => {
  const list = await systemApi.getDictByType(DictTypeEnum.ORDER_STATUS)
  console.log(list)
  // [{ code: "0", name: "待支付" }, ...]
}
```

### 方式3: 使用工具类

```typescript
import { DictUtils } from '@/hooks/useSystemDict'

// 根据 code 获取 name
const name = DictUtils.getNameByCode(dictList, '0')  // "待支付"

// 根据 name 获取 code
const code = DictUtils.getCodeByName(dictList, '待支付')  // "0"

// 检查 code 是否有效
const isValid = DictUtils.isValidCode(dictList, '0')  // true
```

## 常用场景

### 1. 下拉选择框

```tsx
<Select placeholder="请选择商品新旧程度">
  {degreeList.map(item => (
    <Select.Option key={item.code} value={item.code}>
      {item.name}
    </Select.Option>
  ))}
</Select>
```

### 2. 状态显示

```tsx
const { dictList: statusList } = useSystemDict(DictTypeEnum.ORDER_STATUS)

// 显示订单状态
<Tag>{DictUtils.getNameByCode(statusList, order.status)}</Tag>
```

### 3. 表单验证

```tsx
const validateDegree = (value: string) => {
  if (!DictUtils.isValidCode(degreeList, value)) {
    return Promise.reject('请选择有效的新旧程度')
  }
  return Promise.resolve()
}
```

### 4. 表格列渲染

```tsx
{
  title: '商品状态',
  dataIndex: 'status',
  render: (status: string) => DictUtils.getNameByCode(statusList, status)
}
```

## 可用的字典类型

| 枚举值 | 说明 | 示例数据 |
|--------|------|----------|
| `USER_ROLE` | 用户角色 | user, admin, ban |
| `COMMODITY_STATUS` | 商品状态 | 0-未上架, 1-已上架, 2-已下架, 3-已售出 |
| `COMMODITY_DEGREE` | 商品新旧程度 | 全新, 几乎全新, 轻微使用痕迹... |
| `ORDER_STATUS` | 订单状态 | 0-待支付, 1-已支付, 2-已取消... |
| `PAYMENT_STATUS` | 支付状态 | 0-未支付, 1-已支付, 2-支付失败, 3-已退款 |
| `POST_REVIEW_STATUS` | 帖子审核状态 | 0-待审核, 1-审核通过, 2-审核不通过 |
| `GENDER` | 性别 | 0-女, 1-男, 2-保密 |
| `COMMODITY_TYPE` | 商品分类 | 1-数码产品, 2-图书教材... |
| `SORT_ORDER` | 排序方式 | ascend, descend |
| `SORT_FIELD` | 排序字段 | createTime, price, viewNum... |

更多字典类型请查看 `types/enums.ts`

## 优势

1. **类型安全**: 使用 TypeScript 枚举，编译时检查
2. **统一管理**: 字典数据在后端统一维护
3. **自动同步**: 后端修改后前端自动获取最新数据
4. **易于使用**: 提供 Hook 和工具类，开箱即用
5. **性能优化**: Hook 自动缓存，避免重复请求

## 注意事项

1. 枚举值必须与后端 `DictEnum.DictTypeEnum` 保持一致
2. 使用 Hook 时会自动发起请求，注意组件生命周期
3. 字典数据建议在应用启动时预加载常用字典
4. 可以配合 React Query 或 SWR 实现更好的缓存策略
