const stats = [
  { value: '2016', label: 'Founded' },
  { value: '11', label: 'Ventures launched' },
  { value: '$140M', label: 'Capital deployed' },
  { value: '4M+', label: 'People reached' },
]

export function Stats() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 py-8 md:py-10">
            <div className="text-3xl font-semibold tracking-tight md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
