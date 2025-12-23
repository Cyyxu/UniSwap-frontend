import { create } from 'zustand'

export interface CartItem {
  commodityId: number
  commodityName: string
  commodityAvatar?: string
  price: number
  quantity: number
  selected: boolean
}

interface CartState {
  items: CartItem[]
  totalCount: number
  totalAmount: number
  selectedCount: number
  selectedAmount: number
  addItem: (item: Omit<CartItem, 'quantity' | 'selected'>, quantity?: number) => void
  removeItem: (commodityId: number) => void
  updateQuantity: (commodityId: number, quantity: number) => void
  toggleSelected: (commodityId: number) => void
  setAllSelected: (selected: boolean) => void
  clear: () => void
  clearSelected: () => void
}

const STORAGE_KEY = 'cart'

const getStoredItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const persistItems = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const calc = (items: CartItem[]) => {
  const totalCount = items.reduce((sum, it) => sum + it.quantity, 0)
  const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0)
  const selectedItems = items.filter((it) => it.selected)
  const selectedCount = selectedItems.reduce((sum, it) => sum + it.quantity, 0)
  const selectedAmount = selectedItems.reduce((sum, it) => sum + it.price * it.quantity, 0)
  return { totalCount, totalAmount, selectedCount, selectedAmount }
}

export const useCartStore = create<CartState>((set, get) => {
  const initialItems = getStoredItems()
  const initialCalc = calc(initialItems)

  return {
    items: initialItems,
    ...initialCalc,

    addItem: (item, quantity = 1) => {
      const items = [...get().items]
      const existing = items.find((it) => it.commodityId === item.commodityId)
      if (existing) {
        existing.quantity += quantity
      } else {
        items.push({ ...item, quantity, selected: true })
      }
      persistItems(items)
      set({ items, ...calc(items) })
    },

    removeItem: (commodityId) => {
      const items = get().items.filter((it) => it.commodityId !== commodityId)
      persistItems(items)
      set({ items, ...calc(items) })
    },

    updateQuantity: (commodityId, quantity) => {
      const nextQty = Math.max(1, Number(quantity) || 1)
      const items = [...get().items]
      const target = items.find((it) => it.commodityId === commodityId)
      if (!target) return
      target.quantity = nextQty
      persistItems(items)
      set({ items, ...calc(items) })
    },

    toggleSelected: (commodityId) => {
      const items = [...get().items]
      const target = items.find((it) => it.commodityId === commodityId)
      if (!target) return
      target.selected = !target.selected
      persistItems(items)
      set({ items, ...calc(items) })
    },

    setAllSelected: (selected) => {
      const items = get().items.map((it) => ({ ...it, selected }))
      persistItems(items)
      set({ items, ...calc(items) })
    },

    clear: () => {
      persistItems([])
      set({ items: [], ...calc([]) })
    },

    clearSelected: () => {
      const items = get().items.filter((it) => !it.selected)
      persistItems(items)
      set({ items, ...calc(items) })
    },
  }
})
