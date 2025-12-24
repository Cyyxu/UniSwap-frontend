import { create } from 'zustand'
import { cartApi, CartItem, CartVO } from '../api/cart'

interface CartState {
  items: CartItem[]
  loading: boolean
  totalQuantity: number
  totalAmount: number
  discountAmount: number
  finalAmount: number
  fetchCart: () => Promise<void>
  addItem: (commodityId: number, quantity?: number) => Promise<void>
  removeItem: (id: number) => Promise<void>
  removeBatch: (ids: number[]) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  toggleSelected: (id: number) => Promise<void>
  setAllSelected: (selected: boolean) => Promise<void>
  clearSelected: () => Promise<void>
  reset: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  totalQuantity: 0,
  totalAmount: 0,
  discountAmount: 0,
  finalAmount: 0,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const res = (await cartApi.getList()) as unknown as CartVO
      set({
        items: res.items || [],
        totalQuantity: res.totalQuantity || 0,
        totalAmount: res.totalAmount || 0,
        discountAmount: res.discountAmount || 0,
        finalAmount: res.finalAmount || 0,
        loading: false,
      })
    } catch (error) {
      console.error('加载购物车失败', error)
      set({ loading: false })
    }
  },

  addItem: async (commodityId, quantity = 1) => {
    try {
      await cartApi.add({ commodityId, quantity })
      await get().fetchCart()
    } catch (error) {
      console.error('添加购物车失败', error)
      throw error
    }
  },

  removeItem: async (id) => {
    try {
      await cartApi.remove([id])
      await get().fetchCart()
    } catch (error) {
      console.error('删除购物车项失败', error)
      throw error
    }
  },

  removeBatch: async (ids) => {
    try {
      await cartApi.remove(ids)
      await get().fetchCart()
    } catch (error) {
      console.error('批量删除失败', error)
      throw error
    }
  },

  updateQuantity: async (id, quantity) => {
    const nextQty = Math.max(1, Number(quantity) || 1)
    try {
      await cartApi.update({ id, quantity: nextQty })
      await get().fetchCart()
    } catch (error) {
      console.error('更新数量失败', error)
      throw error
    }
  },

  toggleSelected: async (id) => {
    const item = get().items.find((it) => it.id === id)
    if (!item) return
    try {
      await cartApi.update({ id, selected: !item.selected })
      await get().fetchCart()
    } catch (error) {
      console.error('更新选中状态失败', error)
      throw error
    }
  },

  setAllSelected: async (selected) => {
    try {
      await cartApi.selectAll(selected)
      await get().fetchCart()
    } catch (error) {
      console.error('全选操作失败', error)
      throw error
    }
  },

  clearSelected: async () => {
    try {
      const selectedIds = get()
        .items.filter((it) => it.selected)
        .map((it) => it.id)
      if (selectedIds.length > 0) {
        await cartApi.remove(selectedIds)
        await get().fetchCart()
      }
    } catch (error) {
      console.error('删除已选失败', error)
      throw error
    }
  },

  reset: () => {
    set({
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
    })
  },
}))
