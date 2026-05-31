'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hash } from 'bcryptjs'
import QRCode from 'qrcode'
import { revalidatePath } from 'next/cache'

export async function createVendor(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'No autorizado' }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) return { error: 'Todos los campos son obligatorios' }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: 'El email ya está registrado' }

  const vendorCode = 'VEND-' + Math.random().toString(36).substring(2, 8).toUpperCase()
  
  const registerUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/register?code=${vendorCode}`
  const qrCodeUrl = await QRCode.toDataURL(registerUrl, {
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  })

  const hashedPassword = await hash(password, 10)
  
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'VENDOR',
      vendorCode,
      qrCodeUrl
    }
  })

  revalidatePath('/admin')
  return { success: true }
}
