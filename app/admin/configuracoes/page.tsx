'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Store } from '@/types'
import { ArrowLeft, Save, Store as StoreIcon } from 'lucide-react'

export default function AdminSettings() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [store, setStore] = useState<Store | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    whatsapp_number: '',
    delivery_fee: '',
    is_open: true
  })

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

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (storeData) {
          setStore(storeData)
          setFormData({
            name: storeData.name,
            slug: storeData.slug,
            whatsapp_number: storeData.whatsapp_number,
            delivery_fee: storeData.delivery_fee.toString(),
            is_open: storeData.is_open
          })
        }
      } catch (error) {
        console.error('Error fetching store:', error)
      }
    }

    fetchStore()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const storeData = {
        id: user.id,
        name: formData.name,
        slug: formData.slug,
        whatsapp_number: formData.whatsapp_number,
        delivery_fee: parseFloat(formData.delivery_fee),
        is_open: formData.is_open
      }

      if (store) {
        // Update existing store
        const { error } = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', user.id)

        if (error) throw error
      } else {
        // Create new store
        const { error } = await supabase
          .from('stores')
          .insert(storeData)

        if (error) throw error
      }

      alert('Configurações salvas com sucesso!')
      router.push('/admin')
    } catch (error) {
      console.error('Error saving store:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
              Voltar ao Painel
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <StoreIcon className="text-primary-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">Configurações da Loja</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Loja *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Lanchonete do João"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  pattern="[a-z0-9-]+"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="lanchonete-joao"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use apenas letras minúsculas, números e hífens.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp *
              </label>
              <input
                type="tel"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="5511987654321"
              />
              <p className="text-xs text-gray-500 mt-1">
                Apenas números, com DDD e 9 dígitos. Ex: 5511987654321
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Entrega *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  name="delivery_fee"
                  value={formData.delivery_fee}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="5.00"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_open"
                checked={formData.is_open}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Loja aberta para pedidos
              </label>
            </div>

            {formData.slug && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Link do seu cardápio:
                </h3>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-green-100 px-3 py-2 rounded">
                    {typeof window !== 'undefined' 
                      ? `${window.location.origin}/${formData.slug}`
                      : `https://seusite.com/${formData.slug}`
                    }
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined' 
                        ? `${window.location.origin}/${formData.slug}`
                        : `https://seusite.com/${formData.slug}`
                      navigator.clipboard.writeText(url)
                      alert('Link copiado!')
                    }}
                    className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t">
              <Link
                href="/admin"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} />
                {isLoading ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
