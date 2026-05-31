'use client'

import { useActionState } from 'react'
import { login, type AuthState } from '@/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const initialState: AuthState = {
  error: '',
  success: false,
  role: ''
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      if (state.role === 'ADMIN') router.push('/admin')
      if (state.role === 'VENDOR') router.push('/vendor')
      if (state.role === 'CLIENT') router.push('/client')
    }
  }, [state, router])

  return (
    <main className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Bienvenido</h2>
        
        {state?.error && (
          <div className="mb-4" style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', color: 'var(--danger-color)', borderRadius: '8px' }}>
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" className="input-control" required placeholder="tu@email.com" />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" className="input-control" required placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={pending}>
            {pending ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-muted mt-4" style={{ fontSize: '0.9rem' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary" style={{ fontWeight: 600 }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  )
}
