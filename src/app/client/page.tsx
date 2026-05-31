import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Storefront from '@/components/Storefront'

export default async function ClientPage() {
  const session = await getSession()
  const vendorId = session.vendorId

  const products = await prisma.product.findMany({ where: { vendorId } })

  return (
    <div className="flex flex-col gap-4">
      <Storefront products={products} />
    </div>
  )
}
