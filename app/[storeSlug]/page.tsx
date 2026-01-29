import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Store, Category, Product } from '@/types'
import MenuHeader from '@/components/MenuHeader'
import CategorySection from '@/components/CategorySection'
import CartButton from '@/components/CartButton'

interface PageProps {
  params: {
    storeSlug: string
  }
}

async function getStore(storeSlug: string): Promise<Store | null> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', storeSlug)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

async function getCategories(storeId: string): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', storeId)
    .order('sort_order', { ascending: true })

  return data || []
}

async function getProducts(categoryId: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  return data || []
}

export default async function StorePage({ params }: PageProps) {
  const store = await getStore(params.storeSlug)

  if (!store) {
    notFound()
  }

  const categories = await getCategories(store.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader store={store} />
      
      <main className="pb-24">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum item no cardápio
              </h2>
              <p className="text-gray-500">
                Esta loja ainda não adicionou produtos ao cardápio.
              </p>
            </div>
          ) : (
            categories.map(async (category) => {
              const products = await getProducts(category.id)
              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  products={products}
                  storeSlug={params.storeSlug}
                />
              )
            })
          )}
        </div>
      </main>

      <CartButton />
    </div>
  )
}
