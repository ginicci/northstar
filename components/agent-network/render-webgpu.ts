import { CLUSTER_ALWAYS, GRAPH, advanceClock, type NetworkClock } from "@/lib/agent-network"

const f = (v: number) => v.toFixed(5)

const NODE_COUNT = GRAPH.nodes.length
const EDGE_COUNT = GRAPH.edges.length

const NODE_DATA = `var<private> NODES: array<vec4f, ${NODE_COUNT}> = array<vec4f, ${NODE_COUNT}>(${GRAPH.nodes
  .map((n) => `vec4f(${f(n.x)}, ${f(n.y)}, ${f(n.size)}, ${f(n.kind * 16 + n.cluster)})`)
  .join(", ")});`

const EDGE_DATA = `var<private> EDGES: array<vec4f, ${EDGE_COUNT}> = array<vec4f, ${EDGE_COUNT}>(${GRAPH.edges
  .map((e) => `vec4f(${f(e.ax)}, ${f(e.ay)}, ${f(e.bx)}, ${f(e.by)})`)
  .join(", ")});
var<private> EDGE_META: array<vec2f, ${EDGE_COUNT}> = array<vec2f, ${EDGE_COUNT}>(${GRAPH.edges
  .map((e) => `vec2f(${f(e.cluster)}, ${f(e.seed)})`)
  .join(", ")});`

const PRELUDE = `
struct Params { time: f32, aspect: f32, px: f32, dpr: f32 }
@group(0) @binding(0) var<uniform> params: Params;

const GOLD = vec3f(0.96, 0.76, 0.34);
const IVORY = vec3f(0.95, 0.92, 0.84);
const SIGNAL = vec3f(0.36, 0.84, 0.78);

fn hash(x: f32) -> f32 { return fract(sin(x * 12.9898) * 43758.5453); }

fn working(cluster: f32, t: f32) -> f32 {
  if (cluster >= ${f(CLUSTER_ALWAYS)}) { return 1.0; }
  let p = fract(t * 0.045 + cluster * 0.173);
  return smoothstep(0.0, 0.04, p) * (1.0 - smoothstep(0.34, 0.38, p));
}

fn toClip(p: vec2f) -> vec4f {
  return vec4f((p.x / params.aspect) * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
}
`

const EDGE_SHADER = `${PRELUDE}
${EDGE_DATA}

struct EdgeOut {
  @builtin(position) position: vec4f,
  @location(0) along: f32,
  @location(1) side: f32,
  @location(2) @interpolate(flat) level: f32,
  @location(3) @interpolate(flat) head: f32,
}

@vertex fn vs_main(@builtin(vertex_index) v: u32, @builtin(instance_index) i: u32) -> EdgeOut {
  var quad = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
    vec2f(-1.0, -1.0), vec2f(1.0, 1.0), vec2f(-1.0, 1.0)
  );
  let e = EDGES[i];
  let meta = EDGE_META[i];
  let a = vec2f(e.x * params.aspect, e.y);
  let b = vec2f(e.z * params.aspect, e.w);
  let dir = normalize(b - a);
  let normal = vec2f(-dir.y, dir.x);
  let corner = quad[v];
  let t = corner.x * 0.5 + 0.5;
  let halfWidth = 1.6 * params.dpr * params.px;

  var out: EdgeOut;
  out.position = toClip(mix(a, b, t) + normal * corner.y * halfWidth);
  out.along = t;
  out.side = corner.y;
  out.level = working(meta.x, params.time);
  out.head = fract(params.time * 0.35 + meta.y);
  return out;
}

@fragment fn fs_main(in: EdgeOut) -> @location(0) vec4f {
  let fade = 1.0 - abs(in.side);
  let base = mix(IVORY * 0.07, GOLD * 0.2, in.level);
  let d = (in.along - in.head) * 12.0;
  let pulse = exp(-d * d) * in.level;
  let color = (base + SIGNAL * pulse * 0.9) * fade * fade;
  return vec4f(color, 1.0);
}
`

const NODE_SHADER = `${PRELUDE}
${NODE_DATA}

struct NodeOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) @interpolate(flat) kind: u32,
  @location(2) @interpolate(flat) energy: f32,
}

@vertex fn vs_main(@builtin(vertex_index) v: u32, @builtin(instance_index) i: u32) -> NodeOut {
  var quad = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
    vec2f(-1.0, -1.0), vec2f(1.0, 1.0), vec2f(-1.0, 1.0)
  );
  let n = NODES[i];
  let meta = u32(n.w + 0.5);
  let kind = meta / 16u;
  let cluster = f32(meta % 16u);
  let level = working(cluster, params.time);

  var energy = level;
  if (kind == 0u) {
    let seed = hash(f32(i) * 1.7);
    let flicker = step(0.45, hash(f32(i) * 3.1 + floor(params.time * 1.3 + seed * 3.0)));
    energy = level * flicker;
  } else if (kind == 2u) {
    energy = 0.7 + 0.3 * sin(params.time * 2.0);
  }

  let radius = n.z * (1.0 + 0.3 * energy);
  var extent = radius * 3.2;
  if (kind == 3u) { extent = radius * 3.0; }

  let corner = quad[v];
  var out: NodeOut;
  out.position = toClip(vec2f(n.x * params.aspect, n.y) + corner * extent);
  out.uv = corner * (extent / radius);
  out.kind = kind;
  out.energy = energy;
  return out;
}

@fragment fn fs_main(in: NodeOut) -> @location(0) vec4f {
  let d = length(in.uv);
  var color = mix(IVORY * 0.5, SIGNAL, in.energy);
  if (in.kind == 1u) { color = GOLD; }
  if (in.kind == 2u) { color = IVORY; }
  if (in.kind == 3u) { color = GOLD; }

  let core = 1.0 - smoothstep(0.7, 1.0, d);
  let glow = exp(-d * d * 0.9) * (0.2 + 0.8 * in.energy);
  var light = color * (core * 0.95 + glow * 0.55);

  if (in.kind == 3u) {
    let ring = 1.0 - smoothstep(0.03, 0.09, abs(d - 1.0));
    let ripple = (0.5 + 0.5 * sin(d * 7.0 - params.time * 2.4)) * exp(-d * 0.9) * step(1.05, d);
    light = color * (ring * 0.9 + ripple * 0.28 + exp(-d * d * 0.35) * 0.25);
  }
  return vec4f(light, 1.0);
}
`

const BACKGROUND: [number, number, number, number] = [0.043, 0.039, 0.033, 1]

/** Renders the network with vgpu. Rejects when WebGPU is unavailable so the caller can fall back. */
export async function startWebGpuNetwork(canvas: HTMLCanvasElement, clock: NetworkClock) {
  const { init, surface, draw, frameLoop } = await import("vgpu")
  const gpu = await init()
  const canvasSurface = surface(gpu, canvas, { dpr: [1, 2] })

  const readParams = () => {
    const [texelX, texelY] = canvasSurface.texelSize
    return {
      params: {
        time: clock.time,
        aspect: texelY / texelX,
        px: texelY,
        dpr: Math.min(2, window.devicePixelRatio || 1),
      },
    }
  }

  const edges = draw(gpu, {
    label: "agent-edges",
    shader: EDGE_SHADER,
    vertices: 6,
    instances: EDGE_COUNT,
    blend: "additive",
    set: readParams(),
  })
  const nodes = draw(gpu, {
    label: "agent-nodes",
    shader: NODE_SHADER,
    vertices: 6,
    instances: NODE_COUNT,
    blend: "additive",
    set: readParams(),
  })

  let last = performance.now()
  const loop = frameLoop(gpu, (frame) => {
    const now = performance.now()
    advanceClock(clock, Math.min(0.1, (now - last) / 1000))
    last = now
    if (!clock.visible) return

    const params = readParams()
    edges.set(params)
    nodes.set(params)
    frame.pass({ target: canvasSurface, clear: BACKGROUND }, (pass) => {
      pass.draw(edges)
      pass.draw(nodes)
    })
  })

  return () => {
    loop.stop()
    gpu.dispose()
  }
}
