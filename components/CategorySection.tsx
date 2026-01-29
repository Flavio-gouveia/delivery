import { Category, Product } from '@/types'
import ProductCard from './ProductCard'

interface CategorySectionProps {
  category: Category
  products: Product[]
  storeSlug: string
}

export default function CategorySection({ category, products, storeSlug }: CategorySectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 sticky top-16 bg-gray-50 py-2">
        {category.name}
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-500">Nenhum produto nesta categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeSlug={storeSlug}
            />
          ))}
        </div>
      )}
    </section>
  )
}
