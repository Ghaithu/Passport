"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { label: "🎫 Passport", href: "/" },
  { label: "🕸️ Tree",     href: "/tree" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-3 flex items-center gap-6">
      <span className="text-white font-bold text-lg tracking-tight mr-4">Skate Pass</span>
      <div className="flex gap-1">
        {tabs.map(tab => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}