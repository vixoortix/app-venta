import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ChatBox from '@/components/ChatBox'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function VendorChatPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId: clientIdStr } = await params;
  const session = await getSession()
  const clientId = parseInt(clientIdStr, 10)

  if (!session || session.role !== 'VENDOR' || isNaN(clientId)) redirect('/vendor')

  const client = await prisma.user.findUnique({ where: { id: clientId, vendorId: session.id } })
  if (!client) redirect('/vendor')

  const messages = await prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId: session.id, receiverId: clientId },
        { senderId: clientId, receiverId: session.id }
      ]
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Link href="/vendor" className="btn btn-secondary">
          Volver al Panel
        </Link>
        <h2 className="text-center" style={{ margin: 0 }}>Chat con Cliente</h2>
      </div>

      <ChatBox 
        messages={messages} 
        currentUserId={session.id} 
        receiverId={client.id} 
        receiverName={client.name} 
      />
    </div>
  )
}
