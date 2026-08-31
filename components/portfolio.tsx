import { ArrowUpRight } from 'lucide-react'

const ventures = [
  {
    name: 'Northstar',
    category: 'Personal & business growth',
    description:
      'A focused growth platform that turns ambition into clear priorities, better decisions, and meaningful momentum.',
    year: '2018',
    status: 'Scaling',
  },
  {
    name: 'Cartha',
    category: 'Fintech',
    description:
      'Embedded treasury and payments tooling for the next generation of vertical software.',
    year: '2020',
    status: 'Scaling',
  },
  {
    name: 'Lumen Health',
    category: 'Digital health',
    description:
      'Care coordination software connecting clinicians, patients, and payers in one workflow.',
    year: '2021',
    status: 'Growth',
  },
  {
    name: 'Formwork',
    category: 'Developer tools',
    description:
      'Infrastructure-as-code collaboration for teams shipping cloud systems at scale.',
    year: '2022',
    status: 'Early',
  },
  {
    name: 'Verano',
    category: 'Climate',
    description:
      'A measurement platform helping enterprises track and retire verified carbon removals.',
    year: '2023',
    status: 'Early',
  },
  {
    name: 'Atelier',
    category: 'Creative AI',
    description:
      'Generative design tooling that keeps brand systems consistent across every surface.',
    year: '2024',
    status: 'Incubating',
  },
]

export function Portfolio() {
  return (
    <section id="ventures" className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              [ 02 ] &nbsp; The Ginicci universe
            </p>
            <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Products for the life you&apos;re building.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Northstar is Ginicci&apos;s first product: a growing system designed to help people and businesses find direction and keep moving.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {ventures.map((v) => (
            <a
              key={v.name}
              href="#contact"
              className="group flex flex-col justify-between gap-10 bg-background p-6 transition-colors hover:bg-muted"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-base font-semibold text-primary">
                  {v.name.charAt(0)}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>

              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  <span>{v.category}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  {v.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  <span>Est. {v.year}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-primary">{v.status}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
