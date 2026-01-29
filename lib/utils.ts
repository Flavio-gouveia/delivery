import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export function formatWhatsAppMessage(orderData: {
  storeName: string
  customerName: string
  phone: string
  address: string
  items: Array<{
    quantity: number
    productName: string
    extras: Array<{ name: string; price: number }>
    observation?: string
    unitPrice: number
  }>
  deliveryFee: number
  total: number
  paymentMethod: string
  change?: number
}): string {
  const { storeName, customerName, phone, address, items, deliveryFee, total, paymentMethod, change } = orderData
  
  let message = `🍔 Pedido - ${storeName}\n\n`
  message += `👤 Cliente: ${customerName}\n`
  message += `📞 Telefone: ${phone}\n`
  message += `📍 Endereço: ${address}\n\n`
  
  message += `Itens:\n`
  items.forEach((item, index) => {
    message += `${item.quantity}x ${item.productName} - ${formatPrice(item.unitPrice)}\n`
    
    if (item.extras.length > 0) {
      item.extras.forEach(extra => {
        message += `  + ${extra.name} (${formatPrice(extra.price)})\n`
      })
    }
    
    if (item.observation) {
      message += `  Obs: ${item.observation}\n`
    }
  })
  
  message += `\n🚚 Taxa: ${formatPrice(deliveryFee)}\n`
  message += `💰 Total: ${formatPrice(total)}\n\n`
  
  message += `💳 Pagamento: ${paymentMethod === 'pix' ? 'Pix' : paymentMethod === 'credit' ? 'Cartão' : 'Dinheiro'}`
  if (paymentMethod === 'money' && change) {
    message += `\n🔄 Troco para: ${formatPrice(change)}`
  }
  
  message += `\n🕒 Data/Hora: ${new Date().toLocaleString('pt-BR')}`
  
  return encodeURIComponent(message)
}

export function generateWhatsAppLink(whatsappNumber: string, message: string): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${cleanNumber}?text=${message}`
}
