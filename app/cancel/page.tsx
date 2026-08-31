import Link from 'next/link'

export default function CancelPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl border border-border bg-card p-10 text-center md:p-16">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">[ checkout canceled ]</p>
        <h1 className="mt-7 text-balance text-4xl font-light tracking-tight md:text-5xl">No problem. Take your time.</h1>
        <p className="mt-6 leading-7 text-muted-foreground">Nothing was charged. You can return to the products whenever you&apos;re ready.</p>
        <Link href="/#products" className="mt-10 inline-flex border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent">View products</Link>
      </div>
    </main>
  )
}
