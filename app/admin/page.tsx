'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Store } from '@/types'
import { Package, PlusCircle, Settings, LogOut, Store as StoreIcon, Tag } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStore() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/admin/login')
          return
        }

        const { data: storeData, error } = await supabase
          .from('stores')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error || !storeData) {
          console.error('Store not found:', error)
          return
        }

        setStore(storeData)
      } catch (error) {
        console.error('Error fetching store:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStore()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <StoreIcon className="text-primary-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
                {store && (
                  <p className="text-sm text-gray-600">{store.name}</p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {store ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/admin/produtos"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Package className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Produtos</h3>
                  <p className="text-sm text-gray-600">Gerenciar produtos do cardápio</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/admin/categorias"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Tag className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Categorias</h3>
                  <p className="text-sm text-gray-600">Organizar categorias do menu</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/admin/extras"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <PlusCircle className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Adicionais</h3>
                  <p className="text-sm text-gray-600">Configurar itens adicionais</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/admin/configuracoes"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Settings className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
                  <p className="text-sm text-gray-600">Dados da loja e WhatsApp</p>
                </div>
              </div>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Loja</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loja:</span>
                  <span className="font-medium">{store.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slug:</span>
                  <span className="font-medium text-sm">/{store.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    store.is_open 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {store.is_open ? 'Aberta' : 'Fechada'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de entrega:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(store.delivery_fee)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Link do Cardápio</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 break-all">
                    {typeof window !== 'undefined' 
                      ? `${window.location.origin}/${store.slug}`
                      : `https://seusite.com/${store.slug}`
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    const url = typeof window !== 'undefined' 
                      ? `${window.location.origin}/${store.slug}`
                      : `https://seusite.com/${store.slug}`
                    navigator.clipboard.writeText(url)
                  }}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Copiar Link
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loja não encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              Configure sua loja para começar a usar o sistema.
            </p>
            <Link 
              href="/admin/configuracoes"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
            >
              Configurar Loja
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
