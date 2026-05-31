import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ChatBox from '@/components/ChatBox'
import { redirect } from 'next/navigation'

export default async function ClientChatPage() {
  const session = await getSession()
  if (!session || !session.vendorId) redirect('/client')

  const vendor = await prisma.user.findUnique({ where: { id: session.vendorId } })
  if (!vendor) redirect('/client')

  const messages = await prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId: session.id, receiverId: session.vendorId },
        { senderId: session.vendorId, receiverId: session.id }
      ]
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 text-center">Chat con Soporte / Pagos</h2>
      <ChatBox 
        messages={messages} 
        currentUserId={session.id} 
        receiverId={vendor.id} 
        receiverName={vendor.name} 
      />
    </div>
  )
}
