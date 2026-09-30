export type NodeKind = 0 | 1 | 2 | 3

export interface NetworkNode {
  x: number
  y: number
  size: number
  kind: NodeKind
  cluster: number
}

export interface NetworkEdge {
  ax: number
  ay: number
  bx: number
  by: number
  cluster: number
  seed: number
}

export interface Agent {
  id: string
  name: string
  role: string
  tasks: readonly string[]
  x: number
  y: number
}

export const KIND_TASK = 0
export const KIND_HUB = 1
export const KIND_ORCHESTRATOR = 2
export const KIND_HUMAN = 3

/** Edges tagged with this cluster are always active (you ↔ orchestrator). */
export const CLUSTER_ALWAYS = 9

export const CYCLE_SECONDS = 240
export const TASKS_PER_AGENT = 16

export const HUMAN = { x: 0.18, y: 0.8 }
export const ORCHESTRATOR = { x: 0.42, y: 0.56 }

export const AGENTS: readonly Agent[] = [
  {
    id: "research",
    name: "Researcher",
    role: "Maps your market, competitors, and demand",
    tasks: ["Scanning competitor pricing", "Sizing local demand", "Reading customer reviews"],
    x: 0.32,
    y: 0.18,
  },
  {
    id: "strategy",
    name: "Strategist",
    role: "Turns findings into a ranked playbook",
    tasks: ["Ranking growth levers", "Drafting 30-day plan", "Picking the next move"],
    x: 0.72,
    y: 0.22,
  },
  {
    id: "critic",
    name: "Critic",
    role: "Stress-tests every recommendation",
    tasks: ["Checking plan against budget", "Flagging weak assumptions", "Verifying tool fit"],
    x: 0.84,
    y: 0.5,
  },
  {
    id: "sourcing",
    name: "Sourcing",
    role: "Finds products, providers, and prices",
    tasks: ["Comparing 12 suppliers", "Negotiating unit price", "Shortlisting providers"],
    x: 0.72,
    y: 0.78,
  },
  {
    id: "concierge",
    name: "Concierge",
    role: "Delivers the work end to end",
    tasks: ["Booking the specialist", "Coordinating delivery", "Confirming handoff"],
    x: 0.46,
    y: 0.9,
  },
  {
    id: "realestate",
    name: "Real estate",
    role: "Scouts spaces and deal terms",
    tasks: ["Screening listings", "Pulling comparables", "Scheduling a viewing"],
    x: 0.12,
    y: 0.4,
  },
]

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function buildGraph() {
  const rand = mulberry32(7)
  const nodes: NetworkNode[] = [
    { ...HUMAN, size: 0.03, kind: KIND_HUMAN, cluster: CLUSTER_ALWAYS },
    { ...ORCHESTRATOR, size: 0.016, kind: KIND_ORCHESTRATOR, cluster: CLUSTER_ALWAYS },
  ]
  const edges: NetworkEdge[] = [
    { ax: HUMAN.x, ay: HUMAN.y, bx: ORCHESTRATOR.x, by: ORCHESTRATOR.y, cluster: CLUSTER_ALWAYS, seed: 0.1 },
  ]

  AGENTS.forEach((agent, cluster) => {
    nodes.push({ x: agent.x, y: agent.y, size: 0.013, kind: KIND_HUB, cluster })
    edges.push({ ax: ORCHESTRATOR.x, ay: ORCHESTRATOR.y, bx: agent.x, by: agent.y, cluster, seed: rand() })

    const base = Math.atan2(agent.y - ORCHESTRATOR.y, agent.x - ORCHESTRATOR.x)
    for (let k = 0; k < TASKS_PER_AGENT; k++) {
      const angle = base + (rand() - 0.5) * 1.9
      const radius = 0.05 + rand() * 0.1
      const x = clamp(agent.x + Math.cos(angle) * radius * 0.85, 0.03, 0.97)
      const y = clamp(agent.y + Math.sin(angle) * radius, 0.03, 0.97)
      nodes.push({ x, y, size: 0.0055 + rand() * 0.003, kind: KIND_TASK, cluster })
      edges.push({ ax: agent.x, ay: agent.y, bx: x, by: y, cluster, seed: rand() })
    }
  })

  return { nodes, edges }
}

export const GRAPH = buildGraph()

const fract = (v: number) => v - Math.floor(v)
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** 0 → idle, 1 → working. Mirrors `working()` in the WGSL so labels match the pixels. */
export function workingLevel(cluster: number, time: number): number {
  if (cluster >= CLUSTER_ALWAYS) return 1
  const p = fract(time * 0.045 + cluster * 0.173)
  return smoothstep(0, 0.04, p) * (1 - smoothstep(0.34, 0.38, p))
}

export function currentTask(agent: Agent, time: number): string {
  return agent.tasks[Math.floor(time / 20) % agent.tasks.length]
}

/** Share of agents working at evenly spaced points across the cycle, for the timeline. */
export function activityProfile(samples: number): number[] {
  return Array.from({ length: samples }, (_, i) => {
    const t = (i / samples) * CYCLE_SECONDS
    const total = AGENTS.reduce((sum, _agent, c) => sum + workingLevel(c, t), 0)
    return total / AGENTS.length
  })
}

export interface NetworkClock {
  time: number
  speed: number
  playing: boolean
  visible: boolean
}

export function advanceClock(clock: NetworkClock, dt: number) {
  if (clock.playing && clock.visible) {
    clock.time = (clock.time + dt * clock.speed) % CYCLE_SECONDS
  }
}
