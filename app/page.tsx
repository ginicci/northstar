import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Stats } from '@/components/stats'
import { About } from '@/components/about'
import { Portfolio } from '@/components/portfolio'
import { Leadership } from '@/components/leadership'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-dvh scroll-smooth">
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <About />
        <Portfolio />
        <Leadership />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}
