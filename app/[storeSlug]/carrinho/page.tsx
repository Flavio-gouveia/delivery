'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { Store } from '@/types'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart, updateQuantity, removeItem, storeSlug } = useCart()
  const [store, setStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!storeSlug) {
      router.push('/')
      return
    }

    async function fetchStore() {
      try {
        const response = await fetch(`/api/store/${storeSlug}`)
        if (response.ok) {
          const storeData = await response.json()
          setStore(storeData)
        }
      } catch (error) {
        console.error('Error fetching store:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStore()
  }, [storeSlug, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loja não encontrada</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link 
              href={`/${storeSlug}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Voltar ao cardápio
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione itens deliciosos ao seu carrinho!
            </p>
            <Link 
              href={`/${storeSlug}`}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
            >
              Ver Cardápio
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const subtotal = items.reduce((total, item) => {
    const itemTotal = item.product.price * item.quantity
    const extrasTotal = item.extras.reduce(
      (extraTotal, extra) => extraTotal + extra.price * item.quantity,
      0
    )
    return total + itemTotal + extrasTotal
  }, 0)

  const total = getTotalPrice(store.delivery_fee)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href={`/${storeSlug}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Voltar ao cardápio
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Seu Carrinho</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.product.id}-${JSON.stringify(item.extras.map(e => e.id))}`} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex gap-4">
                {item.product.image_url ? (
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">Sem img</span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  
                  {item.extras.length > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      {item.extras.map(extra => extra.name).join(', ')}
                    </div>
                  )}

                  {item.observation && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      Obs: {item.observation}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary-600">
                        {formatPrice(
                          (item.product.price + item.extras.reduce((sum, extra) => sum + extra.price, 0)) * item.quantity
                        )}
                      </span>
                      
                      <button
                        onClick={() => removeItem(item.product)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Taxa de entrega</span>
              <span>{formatPrice(store.delivery_fee)}</span>
            </div>
            
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => clearCart()}
              className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpar Carrinho
            </button>
            
            <Link 
              href={`/${storeSlug}/checkout`}
              className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
            >
              Finalizar Pedido
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
