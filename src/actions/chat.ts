'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export type ChatState = { error?: string; success?: boolean; };

export async function sendMessage(prevState: ChatState, formData: FormData): Promise<ChatState> {
  const session = await getSession()
  if (!session) return { error: 'No autorizado' }

  const content = formData.get('content') as string
  const imageUrl = formData.get('imageUrl') as string
  const receiverIdStr = formData.get('receiverId') as string
  const receiverId = parseInt(receiverIdStr, 10)

  if ((!content || content.trim() === '') && !imageUrl) return { error: 'Mensaje vacío' }

  await prisma.chatMessage.create({
    data: {
      content: content || null,
      imageUrl: imageUrl || null,
      senderId: session.id,
      receiverId
    }
  })

  revalidatePath('/client/chat')
  revalidatePath(`/vendor/chat/${receiverId}`)
  revalidatePath(`/vendor/chat/${session.id}`)
  
  return { success: true }
}

export async function setCreditDate(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'VENDOR') return { error: 'No autorizado' }

  const orderId = parseInt(formData.get('orderId') as string, 10)
  const dateString = formData.get('creditDate') as string

  if (!orderId || !dateString) return { error: 'Faltan datos' }

  await prisma.order.updateMany({
    where: { id: orderId, vendorId: session.id },
    data: { creditDate: new Date(dateString) }
  })

  revalidatePath('/vendor')
  return { success: true }
}
