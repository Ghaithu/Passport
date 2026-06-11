"use client"

import { useState, useRef } from "react"
import { getTricksByBranch, branchColor, branchLabel, levels, isLevelPassed, type Branch } from "@/lib/tricks"

type NodeType = "foundation" | "branch" | "core"
type TrickNode = {
  id: string; label: string; sublabel?: string
  x: number; y: number; type: NodeType; prereqs: string[]; branch?: Branch
}

const W = 900
const H = 520
function fy(y: number) { return H - y }

const ALL_NODES: TrickNode[] = [
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

const BRANCHES: Branch[] = ["draaien","balans","springen","obstakels","flips","scoop","stances","transition"]
const TRUNK_Y_VAL = 130
const TRUNK_X = 450
const typeRadius: Record<NodeType, number> = { foundation: 22, branch: 18, core: 13 }

function buildPath(x1: number, y1: number, x2: number, y2: number) {
  const my = (y1 + y2) / 2
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`
}

function TreeSVG({ nodes, selectedBranch, unlocked, onNodeClick }: {
  nodes: TrickNode[]; selectedBranch: Branch | null
  unlocked: Set<string>; onNodeClick: (n: TrickNode) => void
}) {
  const posMap: Record<string, { x: number; y: number }> = {}
  nodes.forEach(n => { posMap[n.id] = { x: n.x, y: fy(n.y) } })
  const TRUNK_Y = fy(TRUNK_Y_VAL)
  const foundations = nodes.filter(n => n.type === "foundation")
  const branches = nodes.filter(n => n.type === "branch")
  const cores = nodes.filter(n => n.type === "core")

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
      {foundations.map(n => {
        const p = posMap[n.id]; if (!p) return null
        const lit = unlocked.has(n.id)
        return <path key={`ft-${n.id}`} d={buildPath(p.x, p.y - typeRadius.foundation, TRUNK_X, TRUNK_Y)} fill="none" stroke={lit ? "#BA7517" : "#3f3f46"} strokeWidth={lit ? 2 : 1} strokeDasharray={lit ? undefined : "4 3"} />
      })}
      {branches.map(n => {
        const c = posMap[n.id]; if (!c) return null
        const col = n.branch ? branchColor[n.branch] : "#3f3f46"
        const isSelected = n.branch && selectedBranch === n.branch
        return <path key={`tb-${n.id}`} d={buildPath(TRUNK_X, TRUNK_Y, c.x, c.y + typeRadius.branch)} fill="none" stroke={col} strokeWidth={isSelected ? 3 : 1.5} strokeOpacity={isSelected ? 1 : 0.4} />
      })}
      {cores.map(n => {
        const c = posMap[n.id]; const parentId = n.prereqs[0]; const p = posMap[parentId]
        if (!p || !c) return null
        const parentNode = nodes.find(nd => nd.id === parentId)
        const col = parentNode?.branch ? branchColor[parentNode.branch] : "#3f3f46"
        const isSelected = parentNode?.branch && selectedBranch === parentNode.branch
        return <path key={`bc-${n.id}`} d={buildPath(p.x, p.y - typeRadius.branch, c.x, c.y + typeRadius.core)} fill="none" stroke={col} strokeWidth={isSelected ? 2 : 1} strokeOpacity={isSelected ? 1 : 0.3} />
      })}
      <circle cx={TRUNK_X} cy={TRUNK_Y} r={4} fill="#52525b" />
      {nodes.map(n => {
        const pos = posMap[n.id]; if (!pos) return null
        const { x, y } = pos
        const col = n.branch ? (selectedBranch === n.branch ? branchColor[n.branch] : branchColor[n.branch] + "80") : (unlocked.has(n.id) ? "#BA7517" : "#52525b")
        const r = typeRadius[n.type]
        const isSelected = n.branch && selectedBranch === n.branch
        return (
          <g key={n.id} transform={`translate(${x},${y})`} onClick={() => onNodeClick(n)} style={{ cursor: "pointer" }}>
            {isSelected && <circle r={r + 6} fill="none" stroke={branchColor[n.branch!]} strokeWidth="2" opacity={0.5} />}
            <circle r={r} fill={col} fillOpacity={n.branch ? (isSelected ? 1 : 0.6) : (unlocked.has(n.id) ? 1 : 0.18)} stroke={col} strokeWidth={1.5} />
            {unlocked.has(n.id) && !n.branch && <text y="1" textAnchor="middle" fontSize="8" fill="white" dominantBaseline="middle">✓</text>}
            <text y={-(r + 7)} textAnchor="middle" fontSize="9" fill="#a1a1aa">{n.label}</text>
            {n.sublabel && <text y={-(r + 17)} textAnchor="middle" fontSize="9" fill="#a1a1aa">{n.sublabel}</text>}
          </g>
        )
      })}
    </svg>
  )
}

export default function TrickTree() {
  const [mode, setMode] = useState<"branch" | "full">("branch")
  const [activeBranch, setActiveBranch] = useState<Branch>("draaien")
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set(["stilstaand", "rijdend"]))

  // pan + zoom — contained inside the tree box only
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const isPinching = useRef(false)
  const lastDist = useRef(0)
  const lastPan = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function resetView() { setPan({ x: 0, y: 0 }); setScale(1) }

  function handleNodeClick(node: TrickNode) {
    if (node.branch) setSelectedBranch(prev => prev === node.branch ? null : node.branch!)
    else setUnlocked(prev => { const n = new Set(prev); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n })
  }

  // Touch: pinch zoom + single finger pan, only fires inside the tree container
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault()
      isPinching.current = true
      lastDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
    } else if (e.touches.length === 1) {
      isDragging.current = true
      lastPan.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && isPinching.current) {
      e.preventDefault()
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      const delta = dist / lastDist.current
      lastDist.current = dist
      setScale(prev => Math.min(Math.max(prev * delta, 0.4), 3))
    } else if (e.touches.length === 1 && isDragging.current && !isPinching.current) {
      e.preventDefault()
      const dx = e.touches[0].clientX - lastPan.current.x
      const dy = e.touches[0].clientY - lastPan.current.y
      lastPan.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }))
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) isPinching.current = false
    if (e.touches.length === 0) isDragging.current = false
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setScale(prev => Math.min(Math.max(prev * (e.deltaY > 0 ? 0.9 : 1.1), 0.4), 3))
  }

  function onMouseDown(e: React.MouseEvent) { isDragging.current = true; lastPan.current = { x: e.clientX, y: e.clientY } }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return
    const dx = e.clientX - lastPan.current.x; const dy = e.clientY - lastPan.current.y
    lastPan.current = { x: e.clientX, y: e.clientY }
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }))
  }
  function onMouseUp() { isDragging.current = false }

  const branchNodes = ALL_NODES.filter(n => n.type === "foundation" || n.id === activeBranch || n.prereqs.includes(activeBranch))
  const selectedTricks = selectedBranch ? getTricksByBranch(selectedBranch) : []
  const tricksByLevel = selectedTricks.reduce((acc, t) => { if (!acc[t.level]) acc[t.level] = []; acc[t.level].push(t); return acc }, {} as Record<number, typeof selectedTricks>)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-2 py-4 space-y-3">

        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            {(["branch","full"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); resetView() }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === m ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}
              >{m === "branch" ? "Branch" : "Full Tree"}</button>
            ))}
          </div>
          {mode === "full" && (
            <button onClick={resetView} className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-400 hover:text-white">Reset</button>
          )}
        </div>

        {/* Branch pills */}
        {mode === "branch" && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {BRANCHES.map(b => (
              <button key={b} onClick={() => { setActiveBranch(b); setSelectedBranch(null) }}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={activeBranch === b
                  ? { background: branchColor[b], borderColor: branchColor[b], color: "#000" }
                  : { borderColor: branchColor[b] + "60", color: branchColor[b] }
                }
              >{branchLabel[b]}</button>
            ))}
          </div>
        )}

        <div className="flex gap-4 items-start">
          {/* Tree container — zoom/pan is ONLY active inside here */}
          <div className="flex-1 min-w-0">
            {mode === "branch" ? (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                <TreeSVG nodes={branchNodes} selectedBranch={activeBranch} unlocked={unlocked}
                  onNodeClick={n => { if (n.branch) setSelectedBranch(prev => prev === n.branch ? null : n.branch!); else setUnlocked(prev => { const nx = new Set(prev); nx.has(n.id) ? nx.delete(n.id) : nx.add(n.id); return nx }) }}
                />
              </div>
            ) : (
              <div
                ref={containerRef}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden cursor-grab active:cursor-grabbing select-none"
                style={{ height: H, position: "relative" }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  width: W, height: H,
                  willChange: "transform"
                }}>
                  <TreeSVG nodes={ALL_NODES} selectedBranch={selectedBranch} unlocked={unlocked} onNodeClick={handleNodeClick} />
                </div>
                <div className="absolute bottom-2 right-3 text-xs text-zinc-600 pointer-events-none">
                  Pinch / scroll to zoom · drag to pan
                </div>
              </div>
            )}
          </div>

          {/* Side panel */}
          {selectedBranch && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden sticky top-4">
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between" style={{ borderLeftWidth: 3, borderLeftColor: branchColor[selectedBranch] }}>
                  <div>
                    <h3 className="font-bold text-sm">{branchLabel[selectedBranch]}</h3>
                    <p className="text-zinc-500 text-xs">{selectedTricks.length} tricks</p>
                  </div>
                  <button onClick={() => setSelectedBranch(null)} className="text-zinc-500 hover:text-white text-xl leading-none">×</button>
                </div>
                <div className="overflow-y-auto max-h-[65vh]">
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
                          <div key={trick.id} className="px-4 py-2 border-b border-zinc-800/40 flex items-center gap-2">
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

        <div className="flex flex-wrap gap-4 px-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2.5 h-2.5 rounded-full bg-amber-600" />Foundation</div>
          <div className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" />Branch</div>
          <div className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2.5 h-2.5 rounded-full bg-green-500" />Core skill</div>
        </div>
      </div>
    </main>
  )
}