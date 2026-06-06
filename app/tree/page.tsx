"use client"

import { useState } from "react"
import { getTricksByBranch, branchColor, branchLabel, levels, isLevelPassed, type Branch } from "@/lib/tricks"

type NodeType = "foundation" | "branch" | "core"

type TrickNode = {
  id: string
  label: string
  sublabel?: string
  x: number
  y: number
  type: NodeType
  prereqs: string[]
  branch?: Branch
}

const W = 900
const H = 520
function fy(y: number) { return H - y }

const nodes: TrickNode[] = [
  { id: "stilstaand",    label: "Basishouding", sublabel: "stilstaand", x: 160, y: 40,  type: "foundation", prereqs: [] },
  { id: "rijdend",       label: "Basishouding", sublabel: "rijdend",    x: 340, y: 40,  type: "foundation", prereqs: [] },
  { id: "rolhouding",    label: "Rolhouding",                           x: 560, y: 40,  type: "foundation", prereqs: [] },
  { id: "durven",        label: "Durven",                               x: 740, y: 40,  type: "foundation", prereqs: [] },

  { id: "draaien",       label: "Draaien",                              x: 55,  y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "draaien" },
  { id: "balans",        label: "Balans /", sublabel: "Zwaartepunt",    x: 165, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "balans" },
  { id: "springen",      label: "Springen",                             x: 280, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "springen" },
  { id: "obstakels",     label: "Obstakels",                            x: 400, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "obstakels" },
  { id: "flips",         label: "Flips",                                x: 515, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "flips" },
  { id: "scoop",         label: "Scoop",                                x: 625, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "scoop" },
  { id: "stances",       label: "Stances",                              x: 735, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "stances" },
  { id: "transition",    label: "Transition",                           x: 845, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "transition" },

  { id: "rotatie",       label: "Rotatie",                              x: 25,  y: 390, type: "core", prereqs: ["draaien"] },
  { id: "contrarotatie", label: "Contra-", sublabel: "rotatie",         x: 90,  y: 390, type: "core", prereqs: ["draaien"] },
  { id: "voor-achter",   label: "Voor-Achter",                          x: 140, y: 390, type: "core", prereqs: ["balans"] },
  { id: "tip-hielen",    label: "Tip-Hielen",                           x: 200, y: 390, type: "core", prereqs: ["balans"] },
  { id: "hoog-laag",     label: "Hoog-Laag",                            x: 170, y: 470, type: "core", prereqs: ["balans"] },
  { id: "sprong",        label: "Sprong",                               x: 250, y: 390, type: "core", prereqs: ["springen"] },
  { id: "ollie",         label: "Ollie",                                x: 315, y: 390, type: "core", prereqs: ["springen"] },
  { id: "grind",         label: "Grind",                                x: 370, y: 390, type: "core", prereqs: ["obstakels"] },
  { id: "slide",         label: "Slide",                                x: 435, y: 390, type: "core", prereqs: ["obstakels"] },
  { id: "kickflip",      label: "Kickflip",                             x: 490, y: 390, type: "core", prereqs: ["flips"] },
  { id: "heelflip",      label: "Heelflip",                             x: 555, y: 390, type: "core", prereqs: ["flips"] },
  { id: "scoop-core",    label: "Scoop",                                x: 625, y: 390, type: "core", prereqs: ["scoop"] },
  { id: "nollie",        label: "Nollie",                               x: 695, y: 390, type: "core", prereqs: ["stances"] },
  { id: "switch",        label: "Switch",                               x: 755, y: 390, type: "core", prereqs: ["stances"] },
  { id: "fakie",         label: "Fakie",                                x: 725, y: 470, type: "core", prereqs: ["stances"] },
  { id: "trans-core",    label: "Transition", sublabel: "skills",       x: 845, y: 390, type: "core", prereqs: ["transition"] },
]

const TRUNK_Y_VAL = 130
const TRUNK_X = 450

const typeRadius: Record<NodeType, number> = {
  foundation: 22,
  branch: 18,
  core: 13,
}

export default function TrickTree() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set(["stilstaand", "rijdend"]))
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [hovered, setHovered] = useState<TrickNode | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  function toggle(id: string) {
    setUnlocked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleNodeClick(node: TrickNode) {
    if (node.branch) {
      setSelectedBranch(selectedBranch === node.branch ? null : node.branch)
    } else {
      toggle(node.id)
    }
  }

  function isUnlocked(id: string) { return unlocked.has(id) }
  function isReady(node: TrickNode) {
    return !isUnlocked(node.id) && node.prereqs.length > 0 && node.prereqs.every(p => isUnlocked(p))
  }

  const posMap: Record<string, { x: number; y: number }> = {}
  nodes.forEach(n => { posMap[n.id] = { x: n.x, y: fy(n.y) } })

  const TRUNK_Y = fy(TRUNK_Y_VAL)
  const foundations = nodes.filter(n => n.type === "foundation")
  const branches = nodes.filter(n => n.type === "branch")
  const cores = nodes.filter(n => n.type === "core")

  const selectedTricks = selectedBranch ? getTricksByBranch(selectedBranch) : []
  const tricksByLevel = selectedTricks.reduce((acc, trick) => {
    if (!acc[trick.level]) acc[trick.level] = []
    acc[trick.level].push(trick)
    return acc
  }, {} as Record<number, typeof selectedTricks>)

  function getNodeColor(node: TrickNode) {
    if (node.branch) {
      const isSelected = selectedBranch === node.branch
      const col = branchColor[node.branch]
      return isSelected ? col : col + "99"
    }
    if (isUnlocked(node.id)) return "#BA7517"
    return "#52525b"
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-2 py-6 flex gap-4">

        {/* Tree */}
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-x-auto p-2">
            <svg
              width={W} height={H} viewBox={`0 0 ${W} ${H}`}
              className="block"
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
              }}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Foundation → trunk */}
              {foundations.map(n => {
                const p = posMap[n.id]
                const lit = isUnlocked(n.id)
                return (
                  <path key={`ft-${n.id}`}
                    d={`M${p.x},${p.y - typeRadius.foundation} C${p.x},${TRUNK_Y + 40} ${TRUNK_X},${TRUNK_Y + 40} ${TRUNK_X},${TRUNK_Y}`}
                    fill="none" stroke={lit ? "#BA7517" : "#3f3f46"} strokeWidth={lit ? 2 : 1} strokeDasharray={lit ? undefined : "4 3"}
                  />
                )
              })}

              {/* Trunk → branch */}
              {branches.map(n => {
                const c = posMap[n.id]
                const col = n.branch ? branchColor[n.branch] : "#3f3f46"
                const isSelected = n.branch && selectedBranch === n.branch
                return (
                  <path key={`tb-${n.id}`}
                    d={`M${TRUNK_X},${TRUNK_Y} C${TRUNK_X},${c.y + 50} ${c.x},${c.y + 50} ${c.x},${c.y + typeRadius.branch}`}
                    fill="none"
                    stroke={col}
                    strokeWidth={isSelected ? 3 : 1.5}
                    strokeOpacity={isSelected ? 1 : 0.4}
                  />
                )
              })}

              {/* Branch → core */}
              {cores.map(n => {
                const c = posMap[n.id]
                const parentId = n.prereqs[0]
                const p = posMap[parentId]
                if (!p) return null
                const parentNode = nodes.find(nd => nd.id === parentId)
                const col = parentNode?.branch ? branchColor[parentNode.branch] : "#3f3f46"
                const isSelected = parentNode?.branch && selectedBranch === parentNode.branch
                return (
                  <path key={`bc-${n.id}`}
                    d={`M${p.x},${p.y - typeRadius.branch} C${p.x},${c.y + 30} ${c.x},${c.y + 30} ${c.x},${c.y + typeRadius.core}`}
                    fill="none"
                    stroke={col}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeOpacity={isSelected ? 1 : 0.3}
                  />
                )
              })}

              {/* Trunk dot */}
              <circle cx={TRUNK_X} cy={TRUNK_Y} r={4} fill="#52525b" />

              {/* Nodes */}
              {nodes.map(n => {
                const { x, y } = posMap[n.id]
                const ready = isReady(n)
                const col = getNodeColor(n)
                const r = typeRadius[n.type]
                const isSelected = n.branch && selectedBranch === n.branch

                return (
                  <g key={n.id} transform={`translate(${x},${y})`}
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {isSelected && <circle r={r + 6} fill="none" stroke={col} strokeWidth="2" opacity={0.5} />}
                    {ready && <circle r={r + 5} fill="none" stroke="#BA7517" strokeWidth="1.5" strokeDasharray="3 2" />}
                    <circle r={r} fill={col} fillOpacity={n.branch ? (isSelected ? 1 : 0.6) : (isUnlocked(n.id) ? 1 : 0.18)} stroke={col} strokeWidth={1.5} />
                    {isUnlocked(n.id) && !n.branch && (
                      <text y="1" textAnchor="middle" fontSize="8" fill="white" dominantBaseline="middle">✓</text>
                    )}
                    <text y={-(r + 7)} textAnchor="middle" fontSize="9" fill="#a1a1aa">{n.label}</text>
                    {n.sublabel && <text y={-(r + 17)} textAnchor="middle" fontSize="9" fill="#a1a1aa">{n.sublabel}</text>}
                  </g>
                )
              })}

              {/* Tooltip */}
              {hovered && mousePos.x > 0 && (
                <g transform={`translate(${Math.min(mousePos.x + 10, W - 160)},${Math.max(mousePos.y - 55, 5)})`}>
                  <rect x={0} y={0} width={150} height={hovered.branch ? 42 : 50} rx={6} fill="#18181b" stroke="#3f3f46" strokeWidth={1} />
                  <text x={8} y={16} fontSize={11} fill="white" fontWeight="bold">
                    {hovered.label}{hovered.sublabel ? ` ${hovered.sublabel}` : ""}
                  </text>
                  {hovered.branch ? (
                    <text x={8} y={32} fontSize={10} fill="#71717a">Klik om tricks te zien</text>
                  ) : (
                    <>
                      <text x={8} y={30} fontSize={10} fill="#71717a">
                        {hovered.type === "foundation" ? "Foundation" : "Core skill"}
                      </text>
                      <text x={8} y={44} fontSize={9} fill="#52525b">Klik om te unlocken</text>
                    </>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-1 mt-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />Foundation
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />Branch (klik voor tricks)
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />Core skill
            </div>
          </div>
        </div>

        {/* Side panel */}
        {selectedBranch && (
          <div className="w-72 flex-shrink-0">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden sticky top-6">
              {/* Panel header */}
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between"
                style={{ borderLeftWidth: 3, borderLeftColor: branchColor[selectedBranch] }}
              >
                <div>
                  <h3 className="font-bold text-sm">{branchLabel[selectedBranch]}</h3>
                  <p className="text-zinc-500 text-xs">{selectedTricks.length} tricks</p>
                </div>
                <button onClick={() => setSelectedBranch(null)} className="text-zinc-500 hover:text-white text-lg leading-none">×</button>
              </div>

              {/* Tricks grouped by level */}
              <div className="overflow-y-auto max-h-[70vh]">
                {Object.entries(tricksByLevel).map(([lvl, tricks]) => {
                  const levelData = levels.find(l => l.id === Number(lvl))!
                  const passed = isLevelPassed(levelData)
                  return (
                    <div key={lvl}>
                      <div className="px-4 py-2 bg-zinc-800/50 flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-300">Level {lvl}</span>
                        {passed && <span className="text-xs text-green-400">✓ Gehaald</span>}
                      </div>
                      {tricks.map(trick => (
                        <div key={trick.id} className="px-4 py-2.5 border-b border-zinc-800/40 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${trick.certified ? "bg-green-500" : "bg-zinc-600"}`} />
                          <span className={`text-xs ${trick.certified ? "text-white" : "text-zinc-400"}`}>{trick.name}</span>
                          {trick.certified && <span className="ml-auto text-xs text-green-500 font-bold">✓</span>}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}