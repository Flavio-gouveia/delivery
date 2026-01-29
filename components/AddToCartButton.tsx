'use client'

import { useState } from 'react'
import { Product, Extra } from '@/types'
import { useCart } from '@/hooks/useCart'
import { Plus, Check } from 'lucide-react'

interface AddToCartButtonProps {
  product: Product
  storeSlug: string
  availableExtras: Extra[]
}

export default function AddToCartButton({ 
  product, 
  storeSlug, 
  availableExtras 
}: AddToCartButtonProps) {
  const [observation, setObservation] = useState('')
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])
  const [isAdded, setIsAdded] = useState(false)
  
  const { addItem, setStoreSlug } = useCart()

  const handleAddToCart = () => {
    setStoreSlug(storeSlug)
    addItem(product, selectedExtras, observation)
    setIsAdded(true)
    
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras(prev => {
      const isSelected = prev.some(e => e.id === extra.id)
      if (isSelected) {
        return prev.filter(e => e.id !== extra.id)
      } else {
        return [...prev, extra]
      }
    })
  }

  const calculateTotal = () => {
    const productTotal = product.price
    const extrasTotal = selectedExtras.reduce((total, extra) => total + extra.price, 0)
    return productTotal + extrasTotal
  }

  return (
    <div className="space-y-4">
      {availableExtras.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Adicionais
          </h3>
          <div className="space-y-2">
            {availableExtras.map((extra) => (
              <label
                key={extra.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedExtras.some(e => e.id === extra.id)}
                    onChange={() => toggleExtra(extra)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="font-medium text-gray-900">
                    {extra.name}
                  </span>
                </div>
                <span className="text-primary-600 font-semibold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(extra.price)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alguma observação?
        </label>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Ex: sem cebola, ponto da carne, etc."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <span className="text-sm text-gray-600">Total: </span>
          <span className="text-2xl font-bold text-primary-600">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(calculateTotal())}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          {isAdded ? (
            <>
              <Check size={20} />
              Adicionado!
            </>
          ) : (
            <>
              <Plus size={20} />
              Adicionar
            </>
          )}
        </button>
      </div>
    </div>
  )
}
