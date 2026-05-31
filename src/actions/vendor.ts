'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export type VendorState = { error?: string; success?: boolean; };

export async function createProduct(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'VENDOR') return { error: 'No autorizado' }

  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const description = formData.get('description') as string

  if (!name || isNaN(price)) return { error: 'Nombre y precio válidos requeridos' }

  await prisma.product.create({
    data: {
      name,
      price,
      description,
      vendorId: session.id
    }
  })

  revalidatePath('/vendor')
  return { success: true }
}

export async function deleteProduct(productId: number) {
  const session = await getSession()
  if (!session || session.role !== 'VENDOR') return { error: 'No autorizado' }

  await prisma.product.deleteMany({ 
    where: { id: productId, vendorId: session.id } 
  })
  
  revalidatePath('/vendor')
}

export async function markOrderPaid(orderId: number) {
  const session = await getSession()
  if (!session || session.role !== 'VENDOR') return { error: 'No autorizado' }

  await prisma.order.updateMany({
    where: { id: orderId, vendorId: session.id },
    data: { status: 'PAID' }
  })
  
  revalidatePath('/vendor')
}
