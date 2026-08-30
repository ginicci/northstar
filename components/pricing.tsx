import { createCheckoutSession } from '@/app/actions/stripe'
import { formatPrice, PRODUCTS } from '@/lib/products'

export function Pricing() {
  return (
    <section id="products" className="border-t border-border py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-primary">[ products ]</p>
          <h2 className="text-balance text-3xl font-light tracking-tight md:text-5xl">Tools for the next chapter.</h2>
          <p className="mt-6 text-pretty text-lg font-light leading-relaxed text-muted-foreground">Explore the first products from the Ginicci studio. Built with care, made to compound.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {PRODUCTS.map((product) => (
            <article key={product.id} className="flex flex-col border border-border bg-card p-7 md:p-9">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{product.eyebrow}</p>
              <h3 className="mt-6 text-2xl font-light tracking-tight">{product.name}</h3>
              <p className="mt-4 min-h-14 text-sm leading-6 text-muted-foreground">{product.description}</p>
              <div className="mt-9 grid gap-2 border-t border-border pt-5 sm:grid-cols-3">
                {product.plans.map((plan) => (
                  <form key={plan.id} action={createCheckoutSession}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="planId" value={plan.id} />
                    <input type="hidden" name="returnPath" value="/#products" />
                    <button className="group flex w-full flex-col border border-border px-4 py-4 text-left transition-colors hover:border-primary hover:bg-accent" type="submit">
                      <span className="text-xs text-muted-foreground">{plan.label}</span>
                      <span className="mt-2 text-sm font-medium text-primary">{formatPrice(plan.priceInCents, plan.interval)}</span>
                      <span className="mt-3 text-xs text-muted-foreground transition-colors group-hover:text-foreground">Purchase →</span>
                    </button>
                  </form>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
