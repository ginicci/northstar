"use client"

import { Pause, Play, Sparkles } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { AGENTS, CYCLE_SECONDS, activityProfile, currentTask, type NetworkClock } from "@/lib/agent-network"
import { startCanvasNetwork } from "./render-canvas"

const speeds = [1, 4, 10, 20]

export function AgentNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const clockRef = useRef<NetworkClock>({ time: 67, speed: 1, playing: true, visible: true })
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [time, setTime] = useState(67)
  const [renderer, setRenderer] = useState<"WebGPU" | "Canvas">("Canvas")
  const activity = useMemo(() => activityProfile(72), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let dispose = () => {}
    let cancelled = false
    const start = async () => {
      try {
        const { startWebGpuNetwork } = await import("./render-webgpu")
        const cleanup = await startWebGpuNetwork(canvas, clockRef.current)
        if (cancelled) cleanup()
        else {
          dispose = cleanup
          setRenderer("WebGPU")
        }
      } catch {
        if (!cancelled) dispose = startCanvasNetwork(canvas, clockRef.current)
      }
    }
    void start()

    const interval = window.setInterval(() => setTime(clockRef.current.time), 500)
    return () => {
      cancelled = true
      window.clearInterval(interval)
      dispose()
    }
  }, [])

  useEffect(() => {
    clockRef.current.playing = playing
  }, [playing])

  useEffect(() => {
    clockRef.current.speed = speed
  }, [speed])

  const activeAgent = AGENTS[Math.floor(time / 20) % AGENTS.length]
  const date = new Date(Date.UTC(2026, 4, 9) + time * 1000)
  const timestamp = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }).format(date)

  return (
    <section id="vgpu" className="border-y border-border bg-[#0b0a08]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">VGPU / Live operating layer</p>
            <h2 className="mt-4 max-w-3xl text-balance font-serif text-5xl font-bold tracking-tight md:text-6xl">Watch your next move take shape.</h2>
          </div>
          <p className="max-w-sm leading-relaxed text-muted-foreground">Every signal moves through a focused team of agents, with you at the center of the decision.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0b0a08] shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full border border-accent/50 bg-accent/10 text-accent"><Sparkles className="size-4" aria-hidden /></span>
              <div>
                <p className="font-mono text-xs text-white/60">{timestamp} UTC</p>
                <p className="font-mono text-xs text-white/50">{AGENTS.length * 16 + 2} agents · 5 working</p>
              </div>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/45">{renderer}</span>
          </div>

          <div className="relative aspect-[4/5] min-h-[390px] sm:aspect-[16/10] lg:aspect-[16/9]">
            <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-label="Animated network of Northstar agents" />
            <div className="pointer-events-none absolute left-[13%] top-[73%] rounded bg-black/70 px-2 py-1 font-mono text-xs text-white/90 shadow-lg backdrop-blur">you</div>
            <div className="pointer-events-none absolute left-[37%] top-[52%] rounded bg-black/70 px-2 py-1 font-mono text-xs text-white/90 shadow-lg backdrop-blur">orchestrator</div>
            <div className="pointer-events-none absolute left-[26%] top-[18%] hidden max-w-48 rounded bg-black/70 px-2 py-1 font-mono text-xs text-white/90 shadow-lg backdrop-blur sm:block">{activeAgent.name} · {currentTask(activeAgent, time)}</div>
            <div className="pointer-events-none absolute bottom-5 right-5 rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-[10px] text-white/50 backdrop-blur">{playing ? "Live" : "Paused"}</div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-5">
            <svg className="h-12 w-full" viewBox="0 0 720 48" preserveAspectRatio="none" aria-label="Agent activity over time" role="img">
              <path d={`M 0 46 ${activity.map((value, index) => `L ${(index / (activity.length - 1)) * 720} ${46 - value * 39}`).join(" ")} L 720 48 L 0 48 Z`} fill="rgba(245, 194, 87, 0.18)" />
              <path d={`M 0 46 ${activity.map((value, index) => `L ${(index / (activity.length - 1)) * 720} ${46 - value * 39}`).join(" ")}`} fill="none" stroke="rgba(245, 194, 87, 0.85)" strokeWidth="1.25" />
              <line x1={(time / CYCLE_SECONDS) * 720} x2={(time / CYCLE_SECONDS) * 720} y1="0" y2="48" stroke="rgba(255,255,255,.85)" strokeWidth="2" />
            </svg>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => setPlaying((value) => !value)} className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent" aria-label={playing ? "Pause visualization" : "Play visualization"}>
                {playing ? <Pause className="size-4 fill-current" aria-hidden /> : <Play className="size-4 fill-current" aria-hidden />}
              </button>
              <div className="flex overflow-hidden rounded-lg border border-white/10 p-1" aria-label="Animation speed">
                {speeds.map((value) => <button key={value} type="button" onClick={() => setSpeed(value)} className={`min-w-12 rounded-md px-3 py-2 font-mono text-xs transition ${speed === value ? "bg-white/10 text-white" : "text-white/45 hover:text-white"}`}>x{value}</button>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
