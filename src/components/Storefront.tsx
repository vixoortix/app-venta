'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { placeOrder, type ClientState } from '@/actions/client'

type Product = { id: number, name: string, price: number, description: string | null }
type CartItem = Product & { quantity: number }

export default function Storefront({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [state, formAction, pending] = useActionState(placeOrder, { error: '', success: false } as ClientState)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (state?.success) {
    return (
      <div className="glass-panel text-center" style={{ padding: '4rem' }}>
        <h2 className="text-success mb-2" style={{ color: 'var(--success-color)' }}>¡Pedido Realizado con Éxito!</h2>
        <p className="text-muted">Tu pedido ha sido enviado al vendedor.</p>
        <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>
          Hacer otro pedido
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="glass-panel flex-1" style={{ padding: '2rem' }}>
        <h2 className="mb-4 text-primary">Catálogo de Productos</h2>
        <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {products.map(product => (
            <div key={product.id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(30, 41, 59, 0.4)' }}>
              <h3 className="mb-1">{product.name}</h3>
              <p className="text-accent mb-2" style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
              <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>{product.description}</p>
              <button className="btn btn-secondary w-full" onClick={() => addToCart(product)}>
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel flex-1" style={{ padding: '2rem', maxWidth: '400px' }}>
        <h2 className="mb-4 text-accent">Tu Pedido</h2>
        
        {cart.length === 0 ? (
          <p className="text-muted">El carrito está vacío.</p>
        ) : (
          <div className="mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>{item.quantity} x ${item.price.toFixed(2)}</div>
                </div>
                <button className="text-danger" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }} onClick={() => removeFromCart(item.id)}>Quitar</button>
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <strong style={{ fontSize: '1.2rem' }}>Total:</strong>
              <strong className="text-accent" style={{ fontSize: '1.2rem' }}>${total.toFixed(2)}</strong>
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <form action={formAction} className="flex flex-col gap-4 mt-4 animate-fade-in">
            <input type="hidden" name="cart" value={JSON.stringify(cart.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })))} />
            
            {state?.error && (
              <div style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)', borderRadius: '8px', fontSize: '0.875rem' }}>
                {state.error}
              </div>
            )}

            <div className="input-group">
              <label>Nombre Completo</label>
              <input type="text" name="fullName" className="input-control" required />
            </div>
            <div className="input-group">
              <label>Cédula de Identidad</label>
              <input type="text" name="idNumber" className="input-control" required />
            </div>
            <div className="input-group">
              <label>Teléfono</label>
              <input type="tel" name="phone" className="input-control" required />
            </div>
            <div className="input-group">
              <label>Dirección de Entrega</label>
              <input type="text" name="address" className="input-control" required />
            </div>
            <div className="input-group">
              <label>Método de Pago</label>
              <select name="paymentMethod" className="input-control" required>
                <option value="Dolares Efectivo">Dólares Efectivo</option>
                <option value="Bolivares Efectivo">Bolívares Efectivo</option>
                <option value="Pago Movil">Pago Móvil</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
