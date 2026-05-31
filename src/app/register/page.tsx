'use client'

import { useActionState } from 'react'
import { registerClient, type AuthState } from '@/actions/auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const initialState: AuthState = {
  error: '',
  success: false,
  role: ''
}

function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerClient, initialState)
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || ''

  useEffect(() => {
    if (state?.success) {
      if (state.role === 'ADMIN') router.push('/admin')
      if (state.role === 'CLIENT') router.push('/client')
    }
  }, [state, router])

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
      <h2 className="text-center mb-4" style={{ fontSize: '2rem', color: 'var(--accent-color)' }}>Crear Cuenta</h2>
      
      {state?.error && (
        <div className="mb-4" style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', color: 'var(--danger-color)', borderRadius: '8px' }}>
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="input-group">
          <label htmlFor="name">Nombre Completo</label>
          <input type="text" id="name" name="name" className="input-control" required placeholder="Juan Pérez" />
        </div>

        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" className="input-control" required placeholder="tu@email.com" />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" className="input-control" required placeholder="••••••••" />
        </div>

        <div className="input-group">
          <label htmlFor="vendorCode">Código de Vendedor (Obligatorio)</label>
          <input type="text" id="vendorCode" name="vendorCode" className="input-control" defaultValue={code} placeholder="Ej. VEND-123" />
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>Si eres el dueño del sistema y no hay usuarios, déjalo en blanco para crear el Administrador.</small>
        </div>

        <button type="submit" className="btn btn-primary mt-4" disabled={pending}>
          {pending ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p className="text-center text-muted mt-4" style={{ fontSize: '0.9rem' }}>
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-primary" style={{ fontWeight: 600 }}>
          Inicia Sesión
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <Suspense fallback={<div>Cargando...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  )
}
