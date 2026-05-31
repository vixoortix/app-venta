'use server'

import { prisma } from '@/lib/prisma'
import { setSession, destroySession } from '@/lib/auth'
import { hash, compare } from 'bcryptjs'
import { redirect } from 'next/navigation'

export type AuthState = { error?: string; success?: boolean; role?: string };

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email y contraseña requeridos' }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { error: 'Credenciales inválidas' }

  const isValid = await compare(password, user.password)
  if (!isValid) return { error: 'Credenciales inválidas' }

  await setSession({
    id: user.id,
    role: user.role,
    name: user.name,
    vendorId: user.vendorId
  })

  return { success: true, role: user.role }
}

export async function registerClient(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const vendorCode = formData.get('vendorCode') as string

  if (!name || !email || !password) return { error: 'Todos los campos son obligatorios' }

  // Check if it's the first user
  const userCount = await prisma.user.count()
  
  if (userCount === 0) {
    // Create ADMIN
    const hashedPassword = await hash(password, 10)
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    await setSession({ id: admin.id, role: admin.role, name: admin.name })
    return { success: true, role: admin.role }
  }

  // Registering a CLIENT requires a vendor code
  if (!vendorCode) return { error: 'Código de Vendedor es requerido' }

  const vendor = await prisma.user.findUnique({ where: { vendorCode } })
  if (!vendor || vendor.role !== 'VENDOR') {
    return { error: 'Código de Vendedor inválido' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: 'El email ya está registrado' }

  const hashedPassword = await hash(password, 10)
  const client = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'CLIENT',
      vendorId: vendor.id
    }
  })

  await setSession({ id: client.id, role: client.role, name: client.name, vendorId: client.vendorId })
  return { success: true, role: client.role }
}

export async function logout() {
  await destroySession()
  redirect('/login')
}
