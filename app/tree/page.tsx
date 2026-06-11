"use client"

import { useState, useRef, useCallback } from "react"
import { getTricksByBranch, branchColor, branchLabel, levels, isLevelPassed, type Branch } from "@/lib/tricks"

type NodeType = "foundation" | "branch" | "core"
type TrickNode = {
  id: string; label: string; sublabel?: string
  x: number; y: number; type: NodeType; prereqs: string[]; branch?: Branch
}

// Branch view uses its own simple centered layout per branch
// Full tree uses the wide layout with pan/zoom

const BRANCHES: Branch[] = ["draaien","balans","springen","obstakels","flips","scoop","stances","transition"]

// Core skills per branch
const BRANCH_CORES: Record<Exclude<Branch, "foundation">, { id: string; label: string; sublabel?: string }[]> = {
  draaien:    [{ id: "rotatie", label: "Rotatie" }, { id: "contrarotatie", label: "Contra-rotatie" }],
  balans:     [{ id: "voor-achter", label: "Voor-Achter" }, { id: "tip-hielen", label: "Tip-Hielen" }, { id: "hoog-laag", label: "Hoog-Laag" }],
  springen:   [{ id: "sprong", label: "Sprong" }, { id: "ollie", label: "Ollie" }],
  obstakels:  [{ id: "grind", label: "Grind" }, { id: "slide", label: "Slide" }],
  flips:      [{ id: "kickflip", label: "Kickflip" }, { id: "heelflip", label: "Heelflip" }],
  scoop:      [{ id: "scoop-core", label: "Scoop" }],
  stances:    [{ id: "nollie", label: "Nollie" }, { id: "switch", label: "Switch" }, { id: "fakie", label: "Fakie" }],
  transition: [{ id: "trans-core", label: "Transition skills" }],
}

const FOUNDATIONS = [
  { id: "stilstaand", label: "Basishouding", sublabel: "stilstaand" },
  { id: "rijdend",    label: "Basishouding", sublabel: "rijdend" },
  { id: "rolhouding", label: "Rolhouding" },
  { id: "durven",     label: "Durven" },
]

// Full tree layout
const PAD = 30
const FW = 900 + PAD * 2
const FH = 540
function fy(y: number) { return FH - y - PAD }
const TRUNK_Y_VAL = 140
const TRUNK_X = 450 + PAD
const typeRadius: Record<NodeType, number> = { foundation: 22, branch: 18, core: 13 }

const FULL_NODES: TrickNode[] = [
  { id: "stilstaand",    label: "Basishouding", sublabel: "stilstaand", x: 160+PAD, y: 40,  type: "foundation", prereqs: [] },
  { id: "rijdend",       label: "Basishouding", sublabel: "rijdend",    x: 340+PAD, y: 40,  type: "foundation", prereqs: [] },
  { id: "rolhouding",    label: "Rolhouding",                           x: 560+PAD, y: 40,  type: "foundation", prereqs: [] },
  { id: "durven",        label: "Durven",                               x: 740+PAD, y: 40,  type: "foundation", prereqs: [] },
  { id: "draaien",       label: "Draaien",                              x: 55+PAD,  y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "draaien" },
  { id: "balans",        label: "Balans /", sublabel: "Zwaartepunt",    x: 165+PAD, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "balans" },
  { id: "springen",      label: "Springen",                             x: 280+PAD, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "springen" },
  { id: "obstakels",     label: "Obstakels",                            x: 400+PAD, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "obstakels" },
  { id: "flips",         label: "Flips",                                x: 515+PAD, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "flips" },
  { id: "scoop",         label: "Scoop",                                x: 625+PAD, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "scoop" },
  { id: "stances",       label: "Stances",                              x: 735+PAD, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "stances" },
  { id: "transition",    label: "Transition",                           x: 845+PAD, y: 220, type: "branch", prereqs: ["stilstaand","rijdend","rolhouding","durven"], branch: "transition" },
  { id: "rotatie",       label: "Rotatie",                              x: 35+PAD,  y: 390, type: "core", prereqs: ["draaien"] },
  { id: "contrarotatie", label: "Contra-", sublabel: "rotatie",         x: 100+PAD, y: 390, type: "core", prereqs: ["draaien"] },
  { id: "voor-achter",   label: "Voor-Achter",                          x: 148+PAD, y: 390, type: "core", prereqs: ["balans"] },
  { id: "tip-hielen",    label: "Tip-Hielen",                           x: 208+PAD, y: 390, type: "core", prereqs: ["balans"] },
  { id: "hoog-laag",     label: "Hoog-Laag",                            x: 178+PAD, y: 465, type: "core", prereqs: ["balans"] },
  { id: "sprong",        label: "Sprong",                               x: 258+PAD, y: 390, type: "core", prereqs: ["springen"] },
  { id: "ollie",         label: "Ollie",                                x: 318+PAD, y: 390, type: "core", prereqs: ["springen"] },
  { id: "grind",         label: "Grind",                                x: 375+PAD, y: 390, type: "core", prereqs: ["obstakels"] },
  { id: "slide",         label: "Slide",                                x: 435+PAD, y: 390, type: "core", prereqs: ["obstakels"] },
  { id: "kickflip",      label: "Kickflip",                             x: 492+PAD, y: 390, type: "core", prereqs: ["flips"] },
  { id: "heelflip",      label: "Heelflip",                             x: 552+PAD, y: 390, type: "core", prereqs: ["flips"] },
  { id: "scoop-core",    label: "Scoop",                                x: 625+PAD, y: 390, type: "core", prereqs: ["scoop"] },
  { id: "nollie",        label: "Nollie",                               x: 698+PAD, y: 390, type: "core", prereqs: ["stances"] },
  { id: "switch",        label: "Switch",                               x: 758+PAD, y: 390, type: "core", prereqs: ["stances"] },
  { id: "fakie",         label: "Fakie",                                x: 728+PAD, y: 465, type: "core", prereqs: ["stances"] },
  { id: "trans-core",    label: "Transition", sublabel: "skills",       x: 845+PAD, y: 390, type: "core", prereqs: ["transition"] },
]

function buildPath(x1: number, y1: number, x2: number, y2: number) {
  const my = (y1 + y2) / 2
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`
}

// Focused single-branch SVG — fully self-contained and centered
function BranchFocusView({ branch, unlocked, onNodeClick, onBranchClick, selectedBranch }: {
  branch: Branch
  unlocked: Set<string>
  onNodeClick: (id: string) => void
  onBranchClick: (b: Branch) => void
  selectedBranch: Branch | null
}) {
  const cores = BRANCH_CORES[branch as Exclude<Branch, "foundation">]
  const col = branchColor[branch]
  const W = 340
  const H = 320
  const cx = W / 2

  // Layout: foundations at bottom, branch in middle, cores at top
  const foundY = H - 40
  const branchY = H / 2
  const coreY = 60
  const trunkY = branchY + 30

  // Space foundations evenly
  const fSpacing = W / (FOUNDATIONS.length + 1)
  const fPositions = FOUNDATIONS.map((_, i) => (i + 1) * fSpacing)

  // Space cores evenly
  const cSpacing = W / (cores.length + 1)
  const cPositions = cores.map((_, i) => (i + 1) * cSpacing)

  const isSelected = selectedBranch === branch

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="block">
      {/* Foundation → trunk lines */}
      {fPositions.map((fx, i) => {
        const lit = unlocked.has(FOUNDATIONS[i].id)
        return <path key={`ft-${i}`} d={buildPath(fx, foundY - 20, cx, trunkY)} fill="none" stroke={lit ? "#BA7517" : "#3f3f46"} strokeWidth={lit ? 2 : 1} strokeDasharray={lit ? undefined : "4 3"} />
      })}

      {/* Branch → core lines */}
      {cPositions.map((corex, i) => (
        <path key={`bc-${i}`} d={buildPath(cx, branchY - 20, corex, coreY + 13)} fill="none" stroke={col} strokeWidth={isSelected ? 2 : 1} strokeOpacity={isSelected ? 1 : 0.5} />
      ))}

      {/* Trunk dot */}
      <circle cx={cx} cy={trunkY} r={3} fill="#52525b" />

      {/* Foundation nodes */}
      {FOUNDATIONS.map((f, i) => {
        const lit = unlocked.has(f.id)
        return (
          <g key={f.id} transform={`translate(${fPositions[i]}, ${foundY})`}
            onClick={() => onNodeClick(f.id)} style={{ cursor: "pointer" }}>
            <circle r={18} fill={lit ? "#BA7517" : "#52525b"} fillOpacity={lit ? 1 : 0.2} stroke={lit ? "#BA7517" : "#52525b"} strokeWidth={1.5} />
            {lit && <text y="1" textAnchor="middle" fontSize="8" fill="white" dominantBaseline="middle">✓</text>}
            <text y={-26} textAnchor="middle" fontSize="8" fill="#a1a1aa">{f.label}</text>
            {f.sublabel && <text y={-16} textAnchor="middle" fontSize="8" fill="#a1a1aa">{f.sublabel}</text>}
          </g>
        )
      })}

      {/* Branch node */}
      <g transform={`translate(${cx}, ${branchY})`} onClick={() => onBranchClick(branch)} style={{ cursor: "pointer" }}>
        {isSelected && <circle r={26} fill="none" stroke={col} strokeWidth="2" opacity={0.4} />}
        <circle r={22} fill={col} fillOpacity={isSelected ? 1 : 0.7} stroke={col} strokeWidth={1.5} />
        <text y="1" textAnchor="middle" fontSize="10" fill="white" dominantBaseline="middle" fontWeight="bold">
          {branchLabel[branch]}
        </text>
      </g>

      {/* Core nodes */}
      {cores.map((core, i) => (
        <g key={core.id} transform={`translate(${cPositions[i]}, ${coreY})`} style={{ cursor: "default" }}>
          <circle r={13} fill={col} fillOpacity={0.25} stroke={col} strokeWidth={1.5} />
          <text y={-20} textAnchor="middle" fontSize="9" fill="#a1a1aa">{core.label}</text>
          {core.sublabel && <text y={-10} textAnchor="middle" fontSize="9" fill="#a1a1aa">{core.sublabel}</text>}
        </g>
      ))}
    </svg>
  )
}

function FullTreeSVG({ selectedBranch, unlocked, onNodeClick }: {
  selectedBranch: Branch | null; unlocked: Set<string>; onNodeClick: (n: TrickNode) => void
}) {
  const posMap: Record<string, { x: number; y: number }> = {}
  FULL_NODES.forEach(n => { posMap[n.id] = { x: n.x, y: fy(n.y) } })
  const TRUNK_Y = fy(TRUNK_Y_VAL)
  const foundations = FULL_NODES.filter(n => n.type === "foundation")
  const branches = FULL_NODES.filter(n => n.type === "branch")
  const cores = FULL_NODES.filter(n => n.type === "core")

  return (
    <svg width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`} className="block">
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
        const c = posMap[n.id]; const p = posMap[n.prereqs[0]]
        if (!p || !c) return null
        const parentNode = FULL_NODES.find(nd => nd.id === n.prereqs[0])
        const col = parentNode?.branch ? branchColor[parentNode.branch] : "#3f3f46"
        const isSelected = parentNode?.branch && selectedBranch === parentNode.branch
        return <path key={`bc-${n.id}`} d={buildPath(p.x, p.y - typeRadius.branch, c.x, c.y + typeRadius.core)} fill="none" stroke={col} strokeWidth={isSelected ? 2 : 1} strokeOpacity={isSelected ? 1 : 0.3} />
      })}
      <circle cx={TRUNK_X} cy={TRUNK_Y} r={4} fill="#52525b" />
      {FULL_NODES.map(n => {
        const pos = posMap[n.id]; if (!pos) return null
        const { x, y } = pos
        const col = n.branch ? (selectedBranch === n.branch ? branchColor[n.branch] : branchColor[n.branch] + "80") : (unlocked.has(n.id) ? "#BA7517" : "#52525b")
        const r = typeRadius[n.type]
        const isSelected = n.branch && selectedBranch === n.branch
        return (
          <g key={n.id} transform={`translate(${x},${y})`} onClick={() => onNodeClick(n)} style={{ cursor: "pointer" }}>
            {isSelected && <circle r={r + 6} fill="none" stroke={n.branch ? branchColor[n.branch] : "#fff"} strokeWidth="2" opacity={0.5} />}
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
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)

  const isPinching = useRef(false)
  const lastDist = useRef(0)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const panStart = useRef({ x: 0, y: 0 })

  function resetView() { setPan({ x: 0, y: 0 }); setScale(1) }

  function handleFullNodeClick(node: TrickNode) {
    if (node.branch) setSelectedBranch(prev => prev === node.branch ? null : node.branch!)
    else setUnlocked(prev => { const n = new Set(prev); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n })
  }

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault(); isPinching.current = true; dragStart.current = null
      lastDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
    } else if (e.touches.length === 1 && !isPinching.current) {
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      panStart.current = { ...pan }
    }
  }, [pan])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 2 && isPinching.current) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      const dampened = 1 + (dist / lastDist.current - 1) * 0.7
      lastDist.current = dist
      setScale(prev => Math.min(Math.max(prev * dampened, 0.35), 3))
    } else if (e.touches.length === 1 && dragStart.current && !isPinching.current) {
      const dx = (e.touches[0].clientX - dragStart.current.x) * 0.85
      const dy = (e.touches[0].clientY - dragStart.current.y) * 0.85
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy })
    }
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) isPinching.current = false
    if (e.touches.length === 0) dragStart.current = null
  }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(prev => Math.min(Math.max(prev * (e.deltaY > 0 ? 0.92 : 1.08), 0.35), 3))
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY }; panStart.current = { ...pan }
  }, [pan])
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStart.current) return
    setPan({ x: panStart.current.x + (e.clientX - dragStart.current.x), y: panStart.current.y + (e.clientY - dragStart.current.y) })
  }, [])
  const onMouseUp = useCallback(() => { dragStart.current = null }, [])

  const selectedTricks = selectedBranch ? getTricksByBranch(selectedBranch) : []
  const tricksByLevel = selectedTricks.reduce((acc, t) => {
    if (!acc[t.level]) acc[t.level] = []; acc[t.level].push(t); return acc
  }, {} as Record<number, typeof selectedTricks>)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-3 py-4 space-y-3">

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
          <div className="flex-1 min-w-0">
            {mode === "branch" ? (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                <BranchFocusView
                  branch={activeBranch}
                  unlocked={unlocked}
                  onNodeClick={id => setUnlocked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })}
                  onBranchClick={b => setSelectedBranch(prev => prev === b ? null : b)}
                  selectedBranch={selectedBranch}
                />
              </div>
            ) : (
              <div
                className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden select-none relative"
                style={{ height: FH, touchAction: "none", cursor: dragStart.current ? "grabbing" : "grab" }}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove}
                onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0, width: FW, height: FH,
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                  transformOrigin: "center center", willChange: "transform"
                }}>
                  <FullTreeSVG selectedBranch={selectedBranch} unlocked={unlocked} onNodeClick={handleFullNodeClick} />
                </div>
                <div className="absolute bottom-2 right-3 text-xs text-zinc-600 pointer-events-none">Pinch · scroll · drag</div>
              </div>
            )}
          </div>

          {/* Side panel */}
          {selectedBranch && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden sticky top-4">
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between"
                  style={{ borderLeftWidth: 3, borderLeftColor: branchColor[selectedBranch] }}>
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
          <div className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2.5 h-2.5 rounded-full" style={{ background: branchColor[activeBranch] }} />Branch</div>
          <div className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2.5 h-2.5 rounded-full bg-green-500" />Core skill</div>
        </div>
      </div>
    </main>
  )
}