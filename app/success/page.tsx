import Link from 'next/link'

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl border border-border bg-card p-10 text-center md:p-16">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">[ payment received ]</p>
        <h1 className="mt-7 text-balance text-4xl font-light tracking-tight md:text-5xl">Thank you for building with us.</h1>
        <p className="mt-6 leading-7 text-muted-foreground">Your payment was received. We&apos;ll send the next steps to the email used at checkout.</p>
        {sessionId && <p className="mt-8 break-all font-mono text-xs text-muted-foreground">Reference: {sessionId}</p>}
        <Link href="/" className="mt-10 inline-flex bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85">Return to Ginicci</Link>
      </div>
    </main>
  )
}
