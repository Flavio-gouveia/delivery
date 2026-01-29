'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft } from 'lucide-react'

export default function NewCategory() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(0)

  const [formData, setFormData] = useState({
    name: ''
  })

  useEffect(() => {
    async function fetchNextSortOrder() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/admin/login')
          return
        }

        const { data: categories } = await supabase
          .from('categories')
          .select('sort_order')
          .eq('store_id', user.id)
          .order('sort_order', { ascending: false })
          .limit(1)

        const nextOrder = (categories?.[0]?.sort_order || -1) + 1
        setSortOrder(nextOrder)
      } catch (error) {
        console.error('Error fetching sort order:', error)
      }
    }

    fetchNextSortOrder()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('categories')
        .insert({
          store_id: user.id,
          name: formData.name,
          sort_order: sortOrder
        })

      if (error) throw error

      router.push('/admin/categorias')
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Erro ao criar categoria')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin/categorias" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
              Voltar para Categorias
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Categoria</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Lanches"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Ordem de exibição:</strong> {sortOrder + 1}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                As categorias serão exibidas nesta ordem no cardápio.
              </p>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Link
                href="/admin/categorias"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Salvando...' : 'Salvar Categoria'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
