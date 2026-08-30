'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getProductPlan } from '@/lib/products'
import { appUrl, stripe } from '@/lib/stripe'

function safeUrl(value: FormDataEntryValue | null) {
  return typeof value === 'string' && value.startsWith('/') ? value : '/'
}

export async function createCheckoutSession(formData: FormData) {
  const productId = String(formData.get('productId') || '')
  const planId = String(formData.get('planId') || '')
  const returnPath = safeUrl(formData.get('returnPath'))
  const { product, plan } = getProductPlan(productId, planId)
  const origin = appUrl()
  const headersList = await headers()
  const forwardedHost = headersList.get('x-forwarded-host')
  const baseUrl = forwardedHost ? `https://${forwardedHost}` : origin
  const session = await stripe.checkout.sessions.create(
    {
      mode: plan.interval === 'one_time' ? 'payment' : 'subscription',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: plan.priceInCents,
          product_data: { name: product.name, description: product.description },
          ...(plan.interval === 'one_time' ? {} : { recurring: { interval: plan.interval } }),
        },
      }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${returnPath}`,
      allow_promotion_codes: true,
      metadata: { productId, planId },
      ...(plan.interval === 'one_time' ? {} : { subscription_data: { metadata: { productId, planId } } }),
      integration_identifier: `ginicci_checkout_${Math.random().toString(36).slice(2, 10)}`,
    },
    { idempotencyKey: `checkout_${productId}_${planId}_${crypto.randomUUID()}` },
  )
  if (!session.url) throw new Error('Stripe did not return a checkout URL')
  redirect(session.url)
}

export async function createPortalSession(formData: FormData) {
  const customerId = String(formData.get('customerId') || '')
  if (!customerId || !customerId.startsWith('cus_')) throw new Error('A valid Stripe customer is required')
  const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${appUrl()}/` })
  redirect(session.url)
}
