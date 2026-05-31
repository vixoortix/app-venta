'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { sendMessage, type ChatState } from '@/actions/chat'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Message = {
  id: number;
  content: string | null;
  imageUrl: string | null;
  createdAt: Date;
  senderId: number;
}

export default function ChatBox({ messages, currentUserId, receiverId, receiverName }: { messages: Message[], currentUserId: number, receiverId: number, receiverName: string }) {
  const [state, formAction, pending] = useActionState(sendMessage, { error: '', success: false } as ChatState)
  const [base64Image, setBase64Image] = useState<string>('')
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Polling every 5 seconds to get new messages
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)
    return () => clearInterval(interval)
  }, [router])

  useEffect(() => {
    if (state?.success) {
      setBase64Image('')
      ;(document.getElementById('chat-form') as HTMLFormElement)?.reset()
    }
  }, [state])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBase64Image(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="glass-panel flex flex-col" style={{ height: '600px', maxWidth: '800px', margin: '0 auto', padding: '0' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.5)' }}>
        <h3 className="text-primary m-0">Chat con {receiverName}</h3>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        {messages.length === 0 && <p className="text-muted text-center">No hay mensajes aún.</p>}
        {messages.map(msg => {
          const isMe = msg.senderId === currentUserId
          return (
            <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <div style={{
                background: isMe ? 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' : 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '12px',
                borderBottomRightRadius: isMe ? '2px' : '12px',
                borderBottomLeftRadius: !isMe ? '2px' : '12px',
              }}>
                {msg.content && <p style={{ marginBottom: msg.imageUrl ? '0.5rem' : '0' }}>{msg.content}</p>}
                {msg.imageUrl && (
                  <Image src={msg.imageUrl} alt="Comprobante" width={250} height={250} style={{ borderRadius: '8px', objectFit: 'contain', background: '#000' }} />
                )}
              </div>
              <small className="text-muted" style={{ display: 'block', textAlign: isMe ? 'right' : 'left', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </small>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.5)' }}>
        {state?.error && <div className="text-danger mb-2" style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{state.error}</div>}
        
        {base64Image && (
          <div className="mb-2 flex items-center justify-between" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-color)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <span className="text-success" style={{ color: 'var(--success-color)', fontSize: '0.875rem' }}>✓ Imagen adjunta</span>
            <button type="button" onClick={() => setBase64Image('')} className="text-danger" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}>Quitar</button>
          </div>
        )}

        <form id="chat-form" action={formAction} className="flex gap-2 items-center">
          <input type="hidden" name="receiverId" value={receiverId} />
          <input type="hidden" name="imageUrl" value={base64Image} />
          
          <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.75rem' }} title="Adjuntar comprobante">
            📷
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>
          
          <input type="text" name="content" className="input-control flex-1" placeholder="Escribe un mensaje..." style={{ marginBottom: 0 }} />
          
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}
