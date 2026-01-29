import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Product, Store, Extra } from '@/types'
import { formatPrice } from '@/lib/utils'
import ProductExtras from '@/components/ProductExtras'
import AddToCartButton from '@/components/AddToCartButton'

interface PageProps {
  params: {
    storeSlug: string
    productId: string
  }
}

async function getProduct(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (*)
    `)
    .eq('id', productId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
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

async function getExtras(storeId: string): Promise<Extra[]> {
  const { data } = await supabase
    .from('extras')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  return data || []
}

async function getProductExtras(productId: string): Promise<string[]> {
  const { data } = await supabase
    .from('product_extras')
    .select('extra_id')
    .eq('product_id', productId)

  return data?.map(item => item.extra_id) || []
}

export default async function ProductPage({ params }: PageProps) {
  const [product, store, allExtras] = await Promise.all([
    getProduct(params.productId),
    getStore(params.storeSlug),
    getExtras('') // We'll get this after we have the store
  ])

  if (!product || !store) {
    notFound()
  }

  const extras = await getExtras(store.id)
  const productExtraIds = await getProductExtras(params.productId)
  const availableExtras = extras.filter(extra => productExtraIds.includes(extra.id))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href={`/${params.storeSlug}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Voltar ao cardápio
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {product.image_url ? (
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Sem imagem</span>
            </div>
          )}

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            <p className="text-2xl font-bold text-primary-600 mb-4">
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <p className="text-gray-600 mb-6">
                {product.description}
              </p>
            )}

            {availableExtras.length > 0 && (
              <ProductExtras extras={availableExtras} />
            )}

            <AddToCartButton 
              product={product}
              storeSlug={params.storeSlug}
              availableExtras={availableExtras}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
