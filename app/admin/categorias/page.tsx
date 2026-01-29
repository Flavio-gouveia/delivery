'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Category } from '@/types'
import { Plus, Edit, Trash2, Tag, ArrowUp, ArrowDown } from 'lucide-react'

export default function AdminCategories() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/admin/login')
          return
        }

        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('store_id', user.id)
          .order('sort_order', { ascending: true })

        if (error) throw error
        if (data) setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [router])

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Os produtos nesta categoria não serão excluídos.')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error

      setCategories(prev => prev.filter(c => c.id !== categoryId))
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Erro ao excluir categoria')
    }
  }

  const moveCategory = async (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newCategories.length) return

    // Swap positions
    const temp = newCategories[index].sort_order
    newCategories[index].sort_order = newCategories[targetIndex].sort_order
    newCategories[targetIndex].sort_order = temp

    // Reorder array
    const [movedCategory] = newCategories.splice(index, 1)
    newCategories.splice(targetIndex, 0, movedCategory)

    setCategories(newCategories)

    // Update in database
    try {
      const { error: error1 } = await supabase
        .from('categories')
        .update({ sort_order: newCategories[index].sort_order })
        .eq('id', newCategories[index].id)

      const { error: error2 } = await supabase
        .from('categories')
        .update({ sort_order: newCategories[targetIndex].sort_order })
        .eq('id', newCategories[targetIndex].id)

      if (error1 || error2) throw error1 || error2
    } catch (error) {
      console.error('Error reordering categories:', error)
      // Revert on error
      setCategories(categories)
    }
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
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                ← Voltar
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsReordering(!isReordering)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isReordering
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isReordering ? 'Reordenando' : 'Reordenar'}
              </button>
              
              <Link 
                href="/admin/categorias/nova"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Categoria
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma categoria encontrada</h3>
            <p className="mt-2 text-gray-600">Comece adicionando sua primeira categoria.</p>
            <Link 
              href="/admin/categorias/nova"
              className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
            >
              Adicionar Categoria
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordem
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                            <Tag className="text-primary-600" size={20} />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isReordering && (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => moveCategory(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                onClick={() => moveCategory(index, 'down')}
                                disabled={index === categories.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowDown size={16} />
                              </button>
                            </div>
                          )}
                          <span className="text-sm text-gray-900">
                            {category.sort_order + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/categorias/${category.id}/editar`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
