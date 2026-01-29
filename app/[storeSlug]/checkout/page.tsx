'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { formatPrice, formatWhatsAppMessage, generateWhatsAppLink } from '@/lib/utils'
import { Store, CheckoutData } from '@/types'
import { ArrowLeft, CreditCard, Smartphone, DollarSign } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart, storeSlug } = useCart()
  const [store, setStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<CheckoutData>({
    customer_name: '',
    phone: '',
    address: '',
    payment_method: 'pix',
    change: undefined,
    final_observation: ''
  })

  useEffect(() => {
    if (!storeSlug) {
      router.push('/')
      return
    }

    async function fetchStore() {
      try {
        const response = await fetch(`/api/store/${storeSlug}`)
        if (response.ok) {
          const storeData = await response.json()
          setStore(storeData)
        }
      } catch (error) {
        console.error('Error fetching store:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStore()
  }, [storeSlug, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'change' ? (value ? parseFloat(value) : undefined) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!store) return

    setIsSubmitting(true)

    try {
      const orderData = {
        storeName: store.name,
        customerName: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        items: items.map(item => ({
          quantity: item.quantity,
          productName: item.product.name,
          extras: item.extras.map(extra => ({
            name: extra.name,
            price: extra.price
          })),
          observation: item.observation,
          unitPrice: item.product.price
        })),
        deliveryFee: store.delivery_fee,
        total: getTotalPrice(store.delivery_fee),
        paymentMethod: formData.payment_method,
        change: formData.change
      }

      const message = formatWhatsAppMessage(orderData)
      const whatsappLink = generateWhatsAppLink(store.whatsapp_number, message)

      window.open(whatsappLink, '_blank')
      
      setTimeout(() => {
        clearCart()
        router.push(`/${storeSlug}?order=success`)
      }, 1000)

    } catch (error) {
      console.error('Error submitting order:', error)
    } finally {
      setIsSubmitting(false)
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

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loja não encontrada</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    router.push(`/${storeSlug}/carrinho`)
    return null
  }

  const total = getTotalPrice(store.delivery_fee)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href={`/${storeSlug}/carrinho`}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar ao carrinho
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Cliente</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço de entrega *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Rua das Flores, 123 - Apto 45 - Centro - São Paulo/SP"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Forma de Pagamento</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  value="pix"
                  checked={formData.payment_method === 'pix'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600"
                />
                <Smartphone className="text-primary-600" size={20} />
                <span className="font-medium">Pix</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  value="credit"
                  checked={formData.payment_method === 'credit'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600"
                />
                <CreditCard className="text-primary-600" size={20} />
                <span className="font-medium">Cartão de Crédito/Débito</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  value="money"
                  checked={formData.payment_method === 'money'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600"
                />
                <DollarSign className="text-primary-600" size={20} />
                <span className="font-medium">Dinheiro</span>
              </label>
            </div>

            {formData.payment_method === 'money' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Troco para quanto? (opcional)
                </label>
                <input
                  type="number"
                  name="change"
                  value={formData.change || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="50,00"
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações do Pedido</h2>
            <textarea
              name="final_observation"
              value={formData.final_observation}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Alguma observação adicional sobre o pedido?"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-2 mb-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.product.name}
                    {item.extras.length > 0 && (
                      <span className="text-gray-500">
                        {' '}+ {item.extras.map(e => e.name).join(', ')}
                      </span>
                    )}
                  </span>
                  <span>
                    {formatPrice(
                      (item.product.price + item.extras.reduce((sum, extra) => sum + extra.price, 0)) * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Taxa de entrega</span>
                <span>{formatPrice(store.delivery_fee)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processando...
              </>
            ) : (
              <>
                Enviar Pedido via WhatsApp
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
