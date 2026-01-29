import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  storeSlug: string
}

export default function ProductCard({ product, storeSlug }: ProductCardProps) {
  return (
    <Link 
      href={`/${storeSlug}/produto/${product.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4 p-4">
        {product.image_url ? (
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-sm">Sem imagem</span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
