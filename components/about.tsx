const principles = [
  {
    title: 'Clarify',
    body: 'We begin with the real problem, creating the clarity people and teams need before they can grow.',
  },
  {
    title: 'Build',
    body: 'We shape simple, useful systems that turn insight into action across everyday life and work.',
  },
  {
    title: 'Grow',
    body: 'We design for lasting momentum — products that compound into stronger habits, teams, and businesses.',
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
            A studio built for meaningful growth.
          </h2>
        </div>

        <div className="md:col-span-7">
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Ginicci is a product studio creating tools for personal and business growth. We turn clear thinking into useful products — beginning with Northstar, a focused system for finding direction and making progress.
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
