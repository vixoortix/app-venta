import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createProduct, deleteProduct, markOrderPaid } from '@/actions/vendor'
import Image from 'next/image'
import Link from 'next/link'

export default async function VendorPage() {
  const session = await getSession()
  const vendorId = session.id

  const vendor = await prisma.user.findUnique({ where: { id: vendorId } })
  const products = await prisma.product.findMany({ where: { vendorId } })
  const pendingOrders = await prisma.order.findMany({
    where: { vendorId, status: 'PENDING' },
    include: { client: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Información del Vendedor */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-primary mb-2">Mi Código QR</h2>
          <p className="text-muted">Comparte este código para que tus clientes se registren.</p>
          <p className="mt-2 text-accent" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{vendor?.vendorCode}</p>
        </div>
        {vendor?.qrCodeUrl && (
          <Image src={vendor.qrCodeUrl} alt="QR Code" width={120} height={120} style={{ borderRadius: '8px' }} />
        )}
      </div>

      <div className="flex gap-4 w-full flex-col md:flex-row" style={{ flexWrap: 'wrap' }}>
        {/* Gestión de Productos */}
        <div className="glass-panel flex-1" style={{ padding: '2rem', minWidth: '300px' }}>
          <h3 className="text-accent mb-4">Añadir Producto</h3>
          <form action={async (formData) => { 'use server'; await createProduct(formData); }} className="flex flex-col gap-4">
            <div className="input-group">
              <label>Nombre del Producto</label>
              <input type="text" name="name" className="input-control" required />
            </div>
            <div className="input-group">
              <label>Precio ($)</label>
              <input type="number" step="0.01" name="price" className="input-control" required />
            </div>
            <div className="input-group">
              <label>Descripción</label>
              <input type="text" name="description" className="input-control" />
            </div>
            <button type="submit" className="btn btn-primary">Guardar Producto</button>
          </form>

          <h3 className="text-primary mt-4 mb-2">Mi Catálogo</h3>
          {products.length === 0 ? <p className="text-muted">No tienes productos.</p> : (
            <ul className="flex flex-col gap-2">
              {products.map((p: any) => (
                <li key={p.id} className="flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span>{p.name} - ${p.price}</span>
                  <form action={async () => {
                    'use server'
                    await deleteProduct(p.id)
                  }}>
                    <button type="submit" className="text-danger" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}>
                      Eliminar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Módulo de Deudores */}
        <div className="glass-panel flex-1" style={{ padding: '2rem', minWidth: '300px' }}>
          <h3 className="text-danger mb-4" style={{ color: 'var(--danger-color)' }}>Deudores (Pedidos Pendientes)</h3>
          {pendingOrders.length === 0 ? (
            <p className="text-muted">No tienes clientes con deudas pendientes.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {pendingOrders.map((order: any) => (
                <div key={order.id} style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--danger-color)', padding: '1rem', borderRadius: '8px' }}>
                  <div className="flex justify-between items-center mb-2">
                    <strong style={{ color: 'var(--text-main)' }}>{order.fullName}</strong>
                    <span className="text-accent">${order.total.toFixed(2)}</span>
                  </div>
                  <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>Método: {order.paymentMethod}</p>
                  
                  {order.creditDate ? (
                    <p className="mb-2" style={{ fontSize: '0.875rem', color: '#fbbf24' }}>
                      Fecha de pago acordada: {new Date(order.creditDate).toLocaleDateString()}
                    </p>
                  ) : (
                    <form action={async (formData) => {
                      'use server'
                      const { setCreditDate } = await import('@/actions/chat')
                      await setCreditDate(formData)
                    }} className="flex items-center gap-2 mb-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="date" name="creditDate" className="input-control" style={{ padding: '0.5rem', width: 'auto' }} required />
                      <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem' }}>Fijar Crédito</button>
                    </form>
                  )}

                  <div className="flex gap-2 mt-4">
                    <form action={async () => {
                      'use server'
                      await markOrderPaid(order.id)
                    }}>
                      <button className="btn" style={{ background: 'var(--success-color)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Marcar como Pagado
                      </button>
                    </form>
                    <Link href={`/vendor/chat/${order.clientId}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                      Abrir Chat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
