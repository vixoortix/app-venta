import Link from 'next/link';

export default function Home() {
  return (
    <main className="container animate-fade-in flex flex-col items-center justify-center gap-4" style={{ minHeight: '80vh' }}>
      <div className="glass-panel text-center" style={{ padding: '4rem', maxWidth: '800px', width: '100%' }}>
        <h1 className="mb-2" style={{ fontSize: '3rem', fontWeight: 700, background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Sistema de Ventas Premium
        </h1>
        <p className="text-muted mb-4" style={{ fontSize: '1.25rem' }}>
          Gestiona clientes, catálogos, pedidos y haz seguimiento de pagos con facilidad.
          Una herramienta completa para administradores y vendedores.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link href="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="btn btn-secondary">
            Registrarse
          </Link>
        </div>
      </div>
      
      <div className="flex gap-4 mt-4 w-full" style={{ maxWidth: '800px' }}>
        <div className="glass-panel text-center flex-col items-center w-full" style={{ padding: '2rem' }}>
          <h3 className="mb-2" style={{ color: 'var(--accent-color)' }}>Para Vendedores</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Gestiona tu propio catálogo de productos y haz seguimiento de tus clientes usando tu código QR personal.
          </p>
        </div>
        <div className="glass-panel text-center flex-col items-center w-full" style={{ padding: '2rem' }}>
          <h3 className="mb-2" style={{ color: 'var(--primary-color)' }}>Para Clientes</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Realiza pedidos, chatea con tu vendedor para coordinar el pago, y adjunta tus comprobantes fácilmente.
          </p>
        </div>
      </div>
    </main>
  );
}
