import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { AgentNetwork } from '@/components/agent-network/agent-network'
import { Stats } from '@/components/stats'
import { About } from '@/components/about'
import { Portfolio } from '@/components/portfolio'
import { Pricing } from '@/components/pricing'
import { Leadership } from '@/components/leadership'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-dvh scroll-smooth">
      <SiteHeader />
      <main>
        <Hero />
        <AgentNetwork />
        <Stats />
        <About />
        <Portfolio />
        <Pricing />
        <Leadership />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}
