export type BillingInterval = 'one_time' | 'month' | 'year'

export interface ProductPlan {
  id: string
  label: string
  interval: BillingInterval
  priceInCents: number
  stripePriceId: string
}

export interface Product {
  id: string
  name: string
  eyebrow: string
  description: string
  plans: ProductPlan[]
}

export const PRODUCTS: Product[] = [
  {
    id: 'atelier-os',
    name: 'Atelier OS',
    eyebrow: 'Operations, reimagined',
    description: 'A calm, intelligent operating system for ambitious teams building what matters next.',
    plans: [
      { id: 'atelier-os-license', label: 'Studio license', interval: 'one_time', priceInCents: 240000, stripePriceId: 'price_1UALJPCps3bzBQVakGztP443' },
      { id: 'atelier-os-monthly', label: 'Monthly', interval: 'month', priceInCents: 24000, stripePriceId: 'price_1UALJPCps3bzBQVaRUYmpxT3' },
      { id: 'atelier-os-annual', label: 'Annual', interval: 'year', priceInCents: 240000, stripePriceId: 'price_1UALJPCps3bzBQVa1pnCcckU' },
    ],
  },
  {
    id: 'northstar-intelligence',
    name: 'Northstar Intelligence',
    eyebrow: 'Clarity at scale',
    description: 'Decision intelligence that turns complex signals into a clear direction for your business.',
    plans: [
      { id: 'northstar-intelligence-license', label: 'Enterprise license', interval: 'one_time', priceInCents: 480000, stripePriceId: 'price_1UALJPCps3bzBQVakmISmiAP' },
      { id: 'northstar-intelligence-monthly', label: 'Monthly', interval: 'month', priceInCents: 48000, stripePriceId: 'price_1UALJRCps3bzBQVaR6ViSoN2' },
      { id: 'northstar-intelligence-annual', label: 'Annual', interval: 'year', priceInCents: 480000, stripePriceId: 'price_1UALJRCps3bzBQVarC0fsLEh' },
    ],
  },
]

export function getProductPlan(productId: string, planId: string) {
  const product = PRODUCTS.find((item) => item.id === productId)
  const plan = product?.plans.find((item) => item.id === planId)
  if (!product || !plan) throw new Error('Invalid product or plan')
  return { product, plan }
}

export function formatPrice(cents: number, interval: BillingInterval) {
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100)
  return interval === 'month' ? `${price}/mo` : interval === 'year' ? `${price}/yr` : price
}
