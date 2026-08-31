export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <span
            className="inline-block h-2 w-2 rounded-full bg-primary"
            aria-hidden="true"
          />
          Ginicci
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ginicci. Built for meaningful growth.
        </p>

        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            LinkedIn
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            X
          </a>
          <a href="#about" className="transition-colors hover:text-foreground">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
