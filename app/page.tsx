import Link from 'next/link'
import { ArrowRight, Store, Smartphone, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <Store className="text-primary-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Delivery SaaS</h1>
            </div>
            <Link 
              href="/admin/login"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Painel Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistema de Pedidos
            <span className="text-primary-600"> Delivery</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma white-label para lanchonetes. Crie seu cardápio digital, 
            receba pedidos via WhatsApp e gerencie seu negócio de forma simples.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/admin/login"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Começar Agora
              <ArrowRight size={20} />
            </Link>
            <div className="bg-white px-8 py-4 rounded-lg border border-gray-200 text-gray-700">
              Demo: <span className="font-mono">/demo-loja</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cardápio Digital
            </h3>
            <p className="text-gray-600">
              Interface mobile-first para seus clientes navegarem facilmente no cardápio.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pedidos via WhatsApp
            </h3>
            <p className="text-gray-600">
              Receba pedidos automaticamente formatados no WhatsApp da sua loja.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="text-orange-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Painel Admin
            </h3>
            <p className="text-gray-600">
              Gerencie produtos, categorias e configurações da sua loja facilmente.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cadastre-se</h3>
              <p className="text-gray-600 text-sm">
                Crie sua conta no painel admin
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Configure</h3>
              <p className="text-gray-600 text-sm">
                Adicione produtos e categorias
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compartilhe</h3>
              <p className="text-gray-600 text-sm">
                Envie seu link de cardápio para clientes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Receba Pedidos</h3>
              <p className="text-gray-600 text-sm">
                Aceite pedidos diretamente no WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-primary-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar sua lanchonete?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Comece agora mesmo a receber pedidos online. 
            Cadastre-se e tenha seu cardápio digital em minutos.
          </p>
          <Link 
            href="/admin/login"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2 text-lg"
          >
            Criar Minha Loja
            <ArrowRight size={20} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Store className="text-primary-400" size={24} />
              <span className="text-xl font-bold">Delivery SaaS</span>
            </div>
            <p className="text-gray-400">
              Plataforma de pedidos delivery para lanchonetes
            </p>
            <p className="text-gray-500 text-sm mt-4">
              © 2024 Delivery SaaS. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
