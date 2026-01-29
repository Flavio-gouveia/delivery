import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product, Extra } from '@/types'

interface CartStore {
  items: CartItem[]
  storeSlug: string | null
  addItem: (product: Product, extras: Extra[], observation?: string) => void
  removeItem: (product: Product) => void
  updateQuantity: (product: Product, quantity: number) => void
  clearCart: () => void
  setStoreSlug: (slug: string) => void
  getTotalItems: () => number
  getTotalPrice: (deliveryFee: number) => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      storeSlug: null,

      addItem: (product: Product, extras: Extra[], observation?: string) => {
        const { items } = get()
        const existingItem = items.find(
          (item) =>
            item.product.id === product.id &&
            JSON.stringify(item.extras.map((e) => e.id)) ===
              JSON.stringify(extras.map((e) => e.id)) &&
            item.observation === observation
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id &&
              JSON.stringify(item.extras.map((e) => e.id)) ===
                JSON.stringify(extras.map((e) => e.id)) &&
              item.observation === observation
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({
            items: [...items, { product, quantity: 1, extras, observation }],
          })
        }
      },

      removeItem: (product: Product) => {
        const { items } = get()
        set({
          items: items.filter((item) => item.product.id !== product.id),
        })
      },

      updateQuantity: (product: Product, quantity: number) => {
        const { items } = get()
        if (quantity === 0) {
          get().removeItem(product)
        } else {
          set({
            items: items.map((item) =>
              item.product.id === product.id ? { ...item, quantity } : item
            ),
          })
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      setStoreSlug: (slug: string) => {
        set({ storeSlug: slug, items: [] })
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: (deliveryFee: number) => {
        const { items } = get()
        const subtotal = items.reduce((total, item) => {
          const itemTotal = item.product.price * item.quantity
          const extrasTotal = item.extras.reduce(
            (extraTotal, extra) => extraTotal + extra.price * item.quantity,
            0
          )
          return total + itemTotal + extrasTotal
        }, 0)
        return subtotal + deliveryFee
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
