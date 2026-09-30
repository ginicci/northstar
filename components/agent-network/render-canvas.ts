import {
  GRAPH,
  KIND_HUB,
  KIND_HUMAN,
  KIND_ORCHESTRATOR,
  advanceClock,
  workingLevel,
  type NetworkClock,
} from "@/lib/agent-network"

const GOLD = "245, 194, 87"
const IVORY = "242, 235, 214"
const SIGNAL = "92, 214, 199"

/** Canvas 2D renderer for browsers without WebGPU; draws the same graph with the same clock. */
export function startCanvasNetwork(canvas: HTMLCanvasElement, clock: NetworkClock) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return () => {}

  let width = 0
  let height = 0
  let dpr = 1
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1)
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
  }
  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)

  let frameId = 0
  let last = performance.now()
  const render = (now: number) => {
    advanceClock(clock, Math.min(0.1, (now - last) / 1000))
    last = now
    frameId = requestAnimationFrame(render)
    if (!clock.visible || width === 0) return

    const t = clock.time
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = "rgb(11, 10, 8)"
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = "lighter"
    ctx.lineWidth = 1

    for (const e of GRAPH.edges) {
      const level = workingLevel(e.cluster, t)
      const ax = e.ax * width
      const ay = e.ay * height
      const bx = e.bx * width
      const by = e.by * height
      ctx.strokeStyle = level > 0.05 ? `rgba(${GOLD}, ${0.12 + level * 0.18})` : `rgba(${IVORY}, 0.07)`
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.stroke()

      if (level > 0.05) {
        const head = (t * 0.35 + e.seed) % 1
        ctx.fillStyle = `rgba(${SIGNAL}, ${0.8 * level})`
        ctx.beginPath()
        ctx.arc(ax + (bx - ax) * head, ay + (by - ay) * head, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    GRAPH.nodes.forEach((n, i) => {
      const x = n.x * width
      const y = n.y * height
      const r = n.size * height
      const level = workingLevel(n.cluster, t)
      if (n.kind === KIND_HUMAN) {
        ctx.strokeStyle = `rgba(${GOLD}, 0.9)`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = `rgba(${GOLD}, 0.12)`
        ctx.beginPath()
        ctx.arc(x, y, r * 2.4, 0, Math.PI * 2)
        ctx.fill()
        return
      }
      const color = n.kind === KIND_HUB ? GOLD : n.kind === KIND_ORCHESTRATOR ? IVORY : level > 0.5 && (i + Math.floor(t * 1.3)) % 3 !== 0 ? SIGNAL : IVORY
      const alpha = n.kind === KIND_HUB || n.kind === KIND_ORCHESTRATOR ? 0.95 : 0.4 + level * 0.5
      ctx.fillStyle = `rgba(${color}, ${alpha * 0.18})`
      ctx.beginPath()
      ctx.arc(x, y, r * 2.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(${color}, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  frameId = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(frameId)
    observer.disconnect()
  }
}
