"use client"

import { useState } from "react"
import { levels, getLevelProgress, isLevelPassed, type Level, type Trick } from "@/lib/tricks"

export default function Home() {
  const [trickData, setTrickData] = useState(levels)
  const [activeLevel, setActiveLevel] = useState<number>(1)
  const [coachMode, setCoachMode] = useState(false)

  const currentLevel = trickData.find((l) => l.id === activeLevel)!

  function toggleTrick(levelId: number, trickId: string) {
    if (!coachMode) return
    setTrickData((prev) =>
      prev.map((level) =>
        level.id === levelId
          ? {
              ...level,
              tricks: level.tricks.map((trick) =>
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">🛹 Skate Pass</h1>
          <p className="text-zinc-400 text-sm">Student: Demo Skater</p>
        </div>
        <button
          onClick={() => setCoachMode(!coachMode)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            coachMode
              ? "bg-amber-500 text-black"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {coachMode ? "✓ Coach Mode" : "Coach Mode"}
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Level tabs */}
        <div className="flex gap-2">
          {trickData.map((level) => {
            const passed = isLevelPassed(level)
            const progress = getLevelProgress(level)
            return (
              <button
                key={level.id}
                onClick={() => setActiveLevel(level.id)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeLevel === level.id
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                <div>{level.name}</div>
                <div className={`text-xs mt-0.5 ${activeLevel === level.id ? "text-zinc-600" : passed ? "text-green-400" : "text-zinc-500"}`}>
                  {passed ? "✓ Passed" : `${progress}%`}
                </div>
              </button>
            )
          })}
        </div>

        {/* Level card */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
          <LevelHeader level={currentLevel} />
          <TrickList
            level={currentLevel}
            coachMode={coachMode}
            onToggle={(trickId) => toggleTrick(currentLevel.id, trickId)}
          />
        </div>

        {coachMode && (
          <p className="text-center text-amber-400/70 text-sm">
            Tap any trick to certify / uncertify it
          </p>
        )}
      </div>
    </main>
  )
}

function LevelHeader({ level }: { level: Level }) {
  const certified = level.tricks.filter((t) => t.certified).length
  const progress = getLevelProgress(level)
  const passed = isLevelPassed(level)

  return (
    <div className="px-5 py-4 border-b border-zinc-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-bold text-lg">{level.name}</h2>
          <p className="text-zinc-400 text-sm">
            {certified}/{level.totalTricks} tricks · 100% vereist
          </p>
        </div>
        {passed && (
          <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full">
            ✓ GEHAALD
          </span>
        )}
      </div>
      {/* Progress bar */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            passed ? "bg-green-500" : "bg-amber-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function TrickList({
  level,
  coachMode,
  onToggle,
}: {
  level: Level
  coachMode: boolean
  onToggle: (trickId: string) => void
}) {
  return (
    <ul className="divide-y divide-zinc-800/60">
      {level.tricks.map((trick) => (
        <TrickRow
          key={trick.id}
          trick={trick}
          coachMode={coachMode}
          onToggle={() => onToggle(trick.id)}
        />
      ))}
    </ul>
  )
}

function TrickRow({
  trick,
  coachMode,
  onToggle,
}: {
  trick: Trick
  coachMode: boolean
  onToggle: () => void
}) {
  return (
    <li
      onClick={onToggle}
      className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
        coachMode ? "cursor-pointer hover:bg-zinc-800/50" : ""
      }`}
    >
      {/* Stamp / checkbox */}
      <div
        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
          trick.certified
            ? "bg-green-500 border-green-500"
            : "border-zinc-600"
        }`}
      >
        {trick.certified && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Trick name */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${trick.certified ? "text-white" : "text-zinc-400"}`}>
          {trick.name}
        </p>
        {trick.certified && trick.certifiedBy && (
          <p className="text-xs text-green-500/70 mt-0.5">
            E-Stamp: {trick.certifiedBy} · {trick.certifiedAt}
          </p>
        )}
      </div>

      {/* E-stamp badge */}
      {trick.certified && (
        <span className="text-xs text-green-400 font-bold tracking-wider">E-STAMP</span>
      )}
    </li>
  )
}