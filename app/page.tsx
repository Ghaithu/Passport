"use client"

import { useState } from "react"
import { levels, getLevelProgress, isLevelPassed, branchColor, branchLabel, type Level, type Trick, type Branch } from "@/lib/tricks"

export default function Home() {
  const [trickData, setTrickData] = useState(levels)
  const [activeLevel, setActiveLevel] = useState(1)
  const [coachMode, setCoachMode] = useState(false)
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null)

  const currentLevel = trickData.find(l => l.id === activeLevel)!
  const filteredTricks = activeBranch
    ? currentLevel.tricks.filter(t => t.branch === activeBranch)
    : currentLevel.tricks

  function toggleTrick(levelId: number, trickId: string) {
    if (!coachMode) return
    setTrickData(prev =>
      prev.map(level =>
        level.id === levelId
          ? {
              ...level,
              tricks: level.tricks.map(trick =>
                trick.id === trickId
                  ? {
                      ...trick,
                      certified: !trick.certified,
                      certifiedBy: !trick.certified ? "Coach Demo" : undefined,
                      certifiedAt: !trick.certified ? new Date().toLocaleDateString("nl-BE") : undefined,
                    }
                  : trick
              ),
            }
          : level
      )
    )
  }

  // Get unique branches in this level
  const branchesInLevel = Array.from(new Set(currentLevel.tricks.map(t => t.branch))) as Branch[]

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Coach mode toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setCoachMode(!coachMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              coachMode ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {coachMode ? "✓ Coach Mode" : "Coach Mode"}
          </button>
        </div>

        {/* Level tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {trickData.map(level => {
            const passed = isLevelPassed(level)
            const progress = getLevelProgress(level)
            return (
              <button
                key={level.id}
                onClick={() => { setActiveLevel(level.id); setActiveBranch(null) }}
                className={`flex-1 min-w-[60px] py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeLevel === level.id ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                <div>L{level.id}</div>
                <div className={`text-xs mt-0.5 ${activeLevel === level.id ? "text-zinc-600" : passed ? "text-green-400" : "text-zinc-500"}`}>
                  {passed ? "✓" : `${progress}%`}
                </div>
              </button>
            )
          })}
        </div>

        {/* Branch filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveBranch(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeBranch === null ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            Alle
          </button>
          {branchesInLevel.map(branch => (
            <button
              key={branch}
              onClick={() => setActiveBranch(activeBranch === branch ? null : branch)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                activeBranch === branch ? "text-black" : "bg-transparent text-zinc-400 hover:bg-zinc-800"
              }`}
              style={activeBranch === branch
                ? { background: branchColor[branch], borderColor: branchColor[branch] }
                : { borderColor: branchColor[branch] + "60" }
              }
            >
              {branchLabel[branch]}
            </button>
          ))}
        </div>

        {/* Level card */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
          <LevelHeader level={currentLevel} />
          <ul className="divide-y divide-zinc-800/60">
            {filteredTricks.map(trick => (
              <TrickRow
                key={trick.id}
                trick={trick}
                coachMode={coachMode}
                onToggle={() => toggleTrick(currentLevel.id, trick.id)}
                onBranchClick={() => setActiveBranch(activeBranch === trick.branch ? null : trick.branch)}
              />
            ))}
          </ul>
        </div>

        {coachMode && (
          <p className="text-center text-amber-400/70 text-sm">Tap een trick om te certificeren</p>
        )}
      </div>
    </main>
  )
}

function LevelHeader({ level }: { level: Level }) {
  const certified = level.tricks.filter(t => t.certified).length
  const progress = getLevelProgress(level)
  const passed = isLevelPassed(level)

  return (
    <div className="px-5 py-4 border-b border-zinc-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-bold text-lg">{level.name}</h2>
          <p className="text-zinc-400 text-sm">
            {certified}/{level.totalTricks} tricks ·{" "}
            {level.minRequired ? `min. ${level.minRequired}/${level.totalTricks}` : "100% vereist"}
          </p>
        </div>
        {passed && (
          <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full">
            ✓ GEHAALD
          </span>
        )}
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${passed ? "bg-green-500" : "bg-amber-500"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function TrickRow({ trick, coachMode, onToggle, onBranchClick }: {
  trick: Trick
  coachMode: boolean
  onToggle: () => void
  onBranchClick: () => void
}) {
  return (
    <li className={`flex items-center gap-3 px-4 py-3 transition-colors ${coachMode ? "cursor-pointer hover:bg-zinc-800/50" : ""}`}
      onClick={onToggle}
    >
      <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
        trick.certified ? "bg-green-500 border-green-500" : "border-zinc-600"
      }`}>
        {trick.certified && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${trick.certified ? "text-white" : "text-zinc-400"}`}>{trick.name}</p>
        {trick.certified && trick.certifiedBy && (
          <p className="text-xs text-green-500/70 mt-0.5">E-Stamp: {trick.certifiedBy} · {trick.certifiedAt}</p>
        )}
      </div>

      {/* Branch tag — clicking filters by branch */}
      <button
        onClick={e => { e.stopPropagation(); onBranchClick() }}
        className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium"
        style={{ background: branchColor[trick.branch] + "25", color: branchColor[trick.branch] }}
      >
        {branchLabel[trick.branch]}
      </button>

      {trick.certified && (
        <span className="text-xs text-green-400 font-bold tracking-wider flex-shrink-0">E-STAMP</span>
      )}
    </li>
  )
}