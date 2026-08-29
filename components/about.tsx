const principles = [
  {
    title: 'Build',
    body: 'We start companies in-house — pairing founders with senior product, design, and engineering from day one.',
  },
  {
    title: 'Back',
    body: 'We invest capital, infrastructure, and operating expertise into ideas with the potential to define a category.',
  },
  {
    title: 'Scale',
    body: 'We stay hands-on through the hardest years, turning early traction into durable, independent businesses.',
  },
]

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            [ 01 ] &nbsp; About Ginicci
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            A studio built to turn conviction into companies.
          </h2>
        </div>

        <div className="md:col-span-7">
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Ginicci is the parent company behind a portfolio of software
            ventures. We are not a fund and not an agency — we are operators who
            build alongside founders, sharing the risk and the craft required to
            make a product people rely on.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="bg-card p-6">
                <div className="text-lg font-semibold tracking-tight text-primary">
                  {p.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
