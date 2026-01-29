import { Store } from '@/types'
import { formatPrice } from '@/lib/utils'

interface MenuHeaderProps {
  store: Store
}

export default function MenuHeader({ store }: MenuHeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                store.is_open 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {store.is_open ? 'Aberto' : 'Fechado'}
              </span>
              <span className="text-sm text-gray-600">
                Taxa: {formatPrice(store.delivery_fee)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
