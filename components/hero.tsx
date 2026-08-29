import { ArrowUpRight } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft warm glow, top-center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] [background:radial-gradient(60%_80%_at_50%_-10%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-24 md:pb-40 md:pt-36">
        <p className="mb-10 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
          <span className="h-px w-10 bg-primary" aria-hidden="true" />
          Product studio &amp; holding company
        </p>

        <h1 className="max-w-4xl text-balance text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem]">
          We build the software companies of{' '}
          <span className="text-primary">tomorrow.</span>
        </h1>

        <p className="mt-8 max-w-xl text-pretty text-lg font-light leading-relaxed text-muted-foreground">
          Ginicci designs, funds, and scales product ventures from the first
          line of code to lasting businesses. One studio, a portfolio of ideas
          worth building.
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#ventures"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explore our ventures
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Partner with us
          </a>
        </div>
      </div>
    </section>
  )
}
