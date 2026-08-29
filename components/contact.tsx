import { ArrowUpRight } from 'lucide-react'

const channels = [
  { label: 'General', value: 'hello@ginicci.com' },
  { label: 'Partnerships', value: 'ventures@ginicci.com' },
  { label: 'Press', value: 'press@ginicci.com' },
]

export function Contact() {
  return (
    <section id="contact" className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground/60">
              [ 04 ] &nbsp; Contact
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Have an idea worth building?
            </h2>
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-primary-foreground/70">
              We partner with exceptional founders and operators. Tell us what
              you&apos;re working on — we read every message.
            </p>
            <a
              href="mailto:hello@ginicci.com"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-medium text-primary transition-opacity hover:opacity-90"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="md:col-span-5">
            <div className="divide-y divide-primary-foreground/15 border-y border-primary-foreground/15">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={`mailto:${c.value}`}
                  className="flex items-center justify-between py-4 transition-opacity hover:opacity-80"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-primary-foreground/60">
                    {c.label}
                  </span>
                  <span className="text-sm">{c.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
