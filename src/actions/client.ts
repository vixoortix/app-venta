'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export type ClientState = { error?: string; success?: boolean; };

export async function placeOrder(prevState: ClientState, formData: FormData): Promise<ClientState> {
  const session = await getSession()
  if (!session || session.role !== 'CLIENT') return { error: 'No autorizado' }

  const vendorId = session.vendorId
  if (!vendorId) return { error: 'Cliente no tiene vendedor asignado' }

  const fullName = formData.get('fullName') as string
  const idNumber = formData.get('idNumber') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const paymentMethod = formData.get('paymentMethod') as string
  const cartJson = formData.get('cart') as string

  if (!fullName || !idNumber || !phone || !address || !paymentMethod || !cartJson) {
    return { error: 'Todos los campos y el carrito son requeridos' }
  }

  let cart = []
  try {
    cart = JSON.parse(cartJson)
  } catch (e) {
    return { error: 'Carrito inválido' }
  }

  if (cart.length === 0) return { error: 'El carrito está vacío' }

  const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

  await prisma.order.create({
    data: {
      total,
      status: 'PENDING',
      clientId: session.id,
      vendorId,
      fullName,
      idNumber,
      phone,
      address,
      paymentMethod,
      items: {
        create: cart.map((item: any) => ({
          quantity: item.quantity,
          price: item.price,
          productId: item.productId
        }))
      }
    }
  })

  revalidatePath('/client')
  return { success: true }
}
