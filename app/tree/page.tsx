"use client"

import { useState } from "react"

type NodeType = "foundation" | "basic" | "inter" | "adv"

type TrickNode = {
  id: string
  label: string
  x: number
  y: number
  type: NodeType
  prereqs: string[]
}

type Edge = [string, string]

const H = 500

function fy(y: number) {
  return H - y
}

const UNLOCKED = new Set([
  "balance",
  "board-control",
  "riding",
  "ollie",
  "kickturn",
  "pop-shuvit",
])

const simpleNodes: TrickNode[] = [
  { id: "balance",       label: "Balance",       x: 340, y: 40,  type: "foundation", prereqs: [] },
  { id: "board-control", label: "Board Control",  x: 180, y: 130, type: "foundation", prereqs: ["balance"] },
  { id: "transition",    label: "Transition",     x: 500, y: 130, type: "foundation", prereqs: ["balance"] },
  { id: "riding",        label: "Riding",         x: 100, y: 230, type: "basic",      prereqs: ["board-control"] },
  { id: "ollie",         label: "Ollie",          x: 260, y: 230, type: "basic",      prereqs: ["board-control", "riding"] },
  { id: "pump",          label: "Pumping",        x: 440, y: 230, type: "basic",      prereqs: ["transition"] },
  { id: "manual",        label: "Manual",         x: 580, y: 230, type: "basic",      prereqs: ["balance", "riding"] },
  { id: "kickturn",      label: "Kickturn",       x: 60,  y: 330, type: "basic",      prereqs: ["riding"] },
  { id: "pop-shuvit",    label: "Pop Shuvit",     x: 180, y: 330, type: "inter",      prereqs: ["ollie"] },
  { id: "kickflip",      label: "Kickflip",       x: 300, y: 330, type: "inter",      prereqs: ["ollie"] },
  { id: "heelflip",      label: "Heelflip",       x: 400, y: 330, type: "inter",      prereqs: ["ollie"] },
  { id: "drop-in",       label: "Drop In",        x: 460, y: 330, type: "basic",      prereqs: ["pump"] },
  { id: "nose-manual",   label: "Nose Manual",    x: 580, y: 330, type: "inter",      prereqs: ["manual"] },
  { id: "rock-fakie",    label: "Rock to Fakie",  x: 60,  y: 430, type: "inter",      prereqs: ["kickturn"] },
  { id: "axl-stall",     label: "Axl Stall",      x: 160, y: 430, type: "inter",      prereqs: ["kickturn"] },
  { id: "varial-kf",     label: "Varial KF",      x: 240, y: 430, type: "adv",        prereqs: ["pop-shuvit", "kickflip"] },
  { id: "roll-in",       label: "Roll In",        x: 460, y: 430, type: "inter",      prereqs: ["drop-in"] },
  { id: "ollie-manual",  label: "Ollie → Manual", x: 580, y: 430, type: "adv",        prereqs: ["nose-manual", "ollie"] },
]

const simpleEdges: Edge[] = [
  ["balance", "board-control"], ["balance", "transition"],
  ["board-control", "riding"], ["board-control", "ollie"],
  ["transition", "pump"], ["transition", "manual"],
  ["riding", "kickturn"],
  ["ollie", "pop-shuvit"], ["ollie", "kickflip"], ["ollie", "heelflip"],
  ["pump", "drop-in"],
  ["manual", "nose-manual"],
  ["kickturn", "rock-fakie"], ["kickturn", "axl-stall"],
  ["pop-shuvit", "varial-kf"], ["kickflip", "varial-kf"],
  ["drop-in", "roll-in"],
  ["nose-manual", "ollie-manual"],
]

const typeColor: Record<NodeType, string> = {
  foundation: "#BA7517",
  basic: "#1D9E75",
  inter: "#185FA5",
  adv: "#993556",
}

const typeLabel: Record<NodeType, string> = {
  foundation: "Foundation",
  basic: "Basic",
  inter: "Intermediate",
  adv: "Advanced",
}

function nodeRadius(type: NodeType) {
  if (type === "foundation") return 22
  if (type === "adv") return 14
  return 17
}

function buildPath(x1: number, y1: number, x2: number, y2: number) {
  const my = (y1 + y2) / 2
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`
}

export default function TrickTree() {
  const [view, setView] = useState<"simple" | "detail">("simple")
  const [unlocked, setUnlocked] = useState(new Set(UNLOCKED))
  const [tooltip, setTooltip] = useState<{ node: TrickNode; x: number; y: number } | null>(null)

  const posMap: Record<string, { x: number; y: number }> = {}
  simpleNodes.forEach((n) => {
    posMap[n.id] = { x: n.x, y: fy(n.y) }
  })

  function toggleNode(id: string) {
    setUnlocked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function isReady(node: TrickNode) {
    return !unlocked.has(node.id) && node.prereqs.length > 0 && node.prereqs.every((p) => unlocked.has(p))
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">Trick Tree</h1>
        <p className="text-zinc-400 text-sm">Tap any node to mark as unlocked</p>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* View toggle */}
        <div className="flex gap-2">
          {(["simple", "detail"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                view === v
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* SVG Tree */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-x-auto p-2 relative">
          <svg
            width="680"
            height={H}
            viewBox={`0 0 680 ${H}`}
            className="block"
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Edges */}
            {view === "simple"
              ? simpleEdges.map(([pid, cid], i) => {
                  const p = posMap[pid], c = posMap[cid]
                  if (!p || !c) return null
                  const isLit = unlocked.has(pid) && unlocked.has(cid)
                  return (
                    <path
                      key={i}
                      d={buildPath(p.x, p.y, c.x, c.y)}
                      fill="none"
                      stroke={isLit ? "#1D9E75" : "#3f3f46"}
                      strokeWidth={isLit ? 2 : 1}
                      strokeDasharray={isLit ? undefined : "4 3"}
                    />
                  )
                })
              : simpleNodes.flatMap((n) =>
                  n.prereqs.map((pid, i) => {
                    const p = posMap[pid], c = posMap[n.id]
                    if (!p || !c) return null
                    const isLit = unlocked.has(pid) && unlocked.has(n.id)
                    return (
                      <path
                        key={`${n.id}-${pid}-${i}`}
                        d={buildPath(p.x, p.y, c.x, c.y)}
                        fill="none"
                        stroke={isLit ? "#1D9E75" : "#3f3f46"}
                        strokeWidth={isLit ? 2 : 1}
                        strokeDasharray={isLit ? undefined : "4 3"}
                      />
                    )
                  })
                )}

            {/* Nodes */}
            {simpleNodes.map((n) => {
              const { x, y } = posMap[n.id]
              const isUnlocked = unlocked.has(n.id)
              const ready = isReady(n)
              const col = isUnlocked ? typeColor[n.type] : "#52525b"
              const r = nodeRadius(n.type)

              return (
                <g
                  key={n.id}
                  transform={`translate(${x},${y})`}
                  className="cursor-pointer"
                  onClick={() => toggleNode(n.id)}
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget.ownerSVGElement as SVGElement).getBoundingClientRect()
                    setTooltip({ node: n, x: x + rect.left, y: y + rect.top })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Ready ring */}
                  {ready && (
                    <circle
                      r={r + 5}
                      fill="none"
                      stroke="#BA7517"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  )}
                  <circle
                    r={r}
                    fill={col}
                    fillOpacity={isUnlocked ? 1 : 0.2}
                    stroke={col}
                    strokeWidth="1.5"
                  />
                  {isUnlocked && (
                    <text
                      y="1"
                      textAnchor="middle"
                      fontSize="9"
                      fill="white"
                      dominantBaseline="middle"
                    >
                      ✓
                    </text>
                  )}
                  <text
                    y={-(r + 8)}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#a1a1aa"
                  >
                    {n.label}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute z-10 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs pointer-events-none"
              style={{
                left: tooltip.x - 20,
                top: tooltip.y - 70,
              }}
            >
              <p className="font-semibold text-white">{tooltip.node.label}</p>
              <p className="text-zinc-400 mt-0.5">
                {typeLabel[tooltip.node.type]}
              </p>
              {tooltip.node.prereqs.length > 0 && (
                <p className="text-zinc-500 mt-0.5">
                  Requires:{" "}
                  {tooltip.node.prereqs
                    .map((pid) => simpleNodes.find((n) => n.id === pid)?.label ?? pid)
                    .join(", ")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 px-1">
          {(Object.entries(typeColor) as [NodeType, string][]).map(([type, col]) => (
            <div key={type} className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />
              {typeLabel[type]}
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 ring-1 ring-amber-500 ring-offset-1 ring-offset-zinc-900" />
            Ready to unlock
          </div>
        </div>
      </div>
    </main>
  )
}