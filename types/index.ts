export interface Store {
  id: string
  name: string
  slug: string
  whatsapp_number: string
  delivery_fee: number
  is_open: boolean
  created_at: string
}

export interface Category {
  id: string
  store_id: string
  name: string
  sort_order: number
}

export interface Product {
  id: string
  store_id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string
  is_active: boolean
  categories?: Category
  product_extras?: ProductExtra[]
}

export interface Extra {
  id: string
  store_id: string
  name: string
  price: number
  is_active: boolean
}

export interface ProductExtra {
  product_id: string
  extra_id: string
  extra?: Extra
}

export interface CartItem {
  product: Product
  quantity: number
  extras: Extra[]
  observation?: string
}

export interface Order {
  id: string
  store_id: string
  items_json: CartItem[]
  total: number
  customer_name: string
  phone: string
  address: string
  payment_method: string
  change?: number
  final_observation?: string
  created_at: string
}

export interface CheckoutData {
  customer_name: string
  phone: string
  address: string
  payment_method: 'pix' | 'credit' | 'money'
  change?: number
  final_observation?: string
}
