const team = [
  { name: 'Amara Okafor', role: 'Founder & Chief Executive', initials: 'AO' },
  { name: 'Daniel Reyes', role: 'Managing Partner', initials: 'DR' },
  { name: 'Sofia Lindqvist', role: 'Head of Product', initials: 'SL' },
  { name: 'Marcus Chen', role: 'Head of Engineering', initials: 'MC' },
]

export function Leadership() {
  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            [ 03 ] &nbsp; Leadership
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            A small team with a clear direction.
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            We are builders, operators, and believers in steady progress — working closely with the people and teams using our products.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 md:col-span-8">
          {team.map((member) => (
            <div key={member.name} className="bg-card p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary font-mono text-sm font-semibold text-secondary-foreground">
                {member.initials}
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
