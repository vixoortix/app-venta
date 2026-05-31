import { prisma } from '@/lib/prisma'
import { createVendor } from '@/actions/admin'
import Image from 'next/image'

export default async function AdminPage() {
  const vendors = await prisma.user.findMany({
    where: { role: 'VENDOR' },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
        <h2 className="mb-4 text-primary">Vendedores Registrados</h2>
        {vendors.length === 0 ? (
          <p className="text-muted">No hay vendedores registrados aún.</p>
        ) : (
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {vendors.map((vendor: any) => (
              <div key={vendor.id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(30, 41, 59, 0.4)' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>{vendor.name}</h3>
                <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Email: {vendor.email}</p>
                <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                  Código: <strong style={{ color: 'var(--accent-color)' }}>{vendor.vendorCode}</strong>
                </p>
                {vendor.qrCodeUrl && (
                  <div className="flex justify-center mt-4">
                    <Image src={vendor.qrCodeUrl} alt="QR de Registro" width={150} height={150} style={{ borderRadius: '8px' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '500px' }}>
        <h2 className="mb-4 text-accent" style={{ color: 'var(--accent-color)' }}>Crear Nuevo Vendedor</h2>
        <form action={async (formData) => { 'use server'; await createVendor(formData); }} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="name">Nombre del Vendedor</label>
            <input type="text" id="name" name="name" className="input-control" required />
          </div>
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" className="input-control" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña Asignada</label>
            <input type="password" id="password" name="password" className="input-control" required />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Registrar Vendedor
          </button>
        </form>
      </div>
    </div>
  )
}
