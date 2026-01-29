'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart } from 'lucide-react'

export default function CartButton() {
  const { getTotalItems, storeSlug } = useCart()
  
  const totalItems = getTotalItems()

  if (!storeSlug || totalItems === 0) {
    return null
  }

  return (
    <Link 
      href={`/${storeSlug}/carrinho`}
      className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-colors z-50"
    >
      <div className="relative">
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
    </Link>
  )
}
