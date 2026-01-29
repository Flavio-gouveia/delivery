'use client'

import { useState } from 'react'
import { Extra } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductExtrasProps {
  extras: Extra[]
}

export default function ProductExtras({ extras }: ProductExtrasProps) {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])

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

  const extrasTotal = selectedExtras.reduce((total, extra) => total + extra.price, 0)

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Adicionais
      </h3>
      
      <div className="space-y-2">
        {extras.map((extra) => (
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
              {formatPrice(extra.price)}
            </span>
          </label>
        ))}
      </div>

      {extrasTotal > 0 && (
        <div className="mt-3 text-right">
          <span className="text-sm text-gray-600">Total dos adicionais: </span>
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(extrasTotal)}
          </span>
        </div>
      )}
    </div>
  )
}
