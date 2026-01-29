'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Extra } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit, Trash2, PlusCircle } from 'lucide-react'

export default function AdminExtras() {
  const router = useRouter()
  const [extras, setExtras] = useState<Extra[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchExtras() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/admin/login')
          return
        }

        const { data, error } = await supabase
          .from('extras')
          .select('*')
          .eq('store_id', user.id)
          .order('name', { ascending: true })

        if (error) throw error
        if (data) setExtras(data)
      } catch (error) {
        console.error('Error fetching extras:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExtras()
  }, [router])

  const handleDelete = async (extraId: string) => {
    if (!confirm('Tem certeza que deseja excluir este adicional?')) return

    try {
      const { error } = await supabase
        .from('extras')
        .delete()
        .eq('id', extraId)

      if (error) throw error

      setExtras(prev => prev.filter(e => e.id !== extraId))
    } catch (error) {
      console.error('Error deleting extra:', error)
      alert('Erro ao excluir adicional')
    }
  }

  const toggleActive = async (extra: Extra) => {
    try {
      const { error } = await supabase
        .from('extras')
        .update({ is_active: !extra.is_active })
        .eq('id', extra.id)

      if (error) throw error

      setExtras(prev => 
        prev.map(e => e.id === extra.id ? { ...e, is_active: !e.is_active } : e)
      )
    } catch (error) {
      console.error('Error updating extra:', error)
      alert('Erro ao atualizar adicional')
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
              <h1 className="text-2xl font-bold text-gray-900">Adicionais</h1>
            </div>
            
            <Link 
              href="/admin/extras/novo"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Adicional
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {extras.length === 0 ? (
          <div className="text-center py-12">
            <PlusCircle className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum adicional encontrado</h3>
            <p className="mt-2 text-gray-600">Comece adicionando seu primeiro adicional.</p>
            <Link 
              href="/admin/extras/novo"
              className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
            >
              Adicionar Adicional
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adicional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {extras.map((extra) => (
                    <tr key={extra.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                            <PlusCircle className="text-orange-600" size={20} />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {extra.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(extra.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(extra)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            extra.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors`}
                        >
                          {extra.is_active ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/extras/${extra.id}/editar`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(extra.id)}
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
