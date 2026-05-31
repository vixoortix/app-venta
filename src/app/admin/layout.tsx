import { getSession } from '@/lib/auth'
import { logout } from '@/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="glass-panel" style={{ borderRadius: 0, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--primary-color)', fontSize: '1.25rem' }}>Panel de Administrador</h1>
        <div className="flex items-center gap-4">
          <span className="text-muted">Hola, {session.name}</span>
          <form action={logout}>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Salir</button>
          </form>
        </div>
      </header>
      <main className="container flex-1 mt-4">
        {children}
      </main>
    </div>
  )
}
