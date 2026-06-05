export type Trick = {
  id: string
  name: string
  certified: boolean
  certifiedBy?: string
  certifiedAt?: string
  org?: string
}

export type Level = {
  id: number
  name: string
  requiredPercent: number
  minRequired: number | null
  totalTricks: number
  tricks: Trick[]
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Level 1",
    requiredPercent: 100,
    minRequired: null,
    totalTricks: 15,
    tricks: [
      { id: "1-01", name: "Basishouding stilstaand", certified: false },
      { id: "1-02", name: "Basishouding rijdend", certified: false },
      { id: "1-03", name: "FS en BS sturen door te leunen", certified: false },
      { id: "1-04", name: "Al rijdend verschillende grabs", certified: false },
      { id: "1-05", name: "Hippie jump zonder obstakel", certified: false },
      { id: "1-06", name: "Noodstop, voorwaarts van board stappen/springen", certified: false },
      { id: "1-07", name: "Volledige ronde draaien ter plaatse op flat", certified: false },
      { id: "1-08", name: "Tiktak vanuit stilstand naar rijdend", certified: false },
      { id: "1-09", name: "Bank afrijden", certified: false },
      { id: "1-10", name: "Drop bank", certified: false },
      { id: "1-11", name: "Op bank rijden en fakie naar beneden", certified: false },
      { id: "1-12", name: "Op quarter rijden en fakie naar beneden", certified: false },
      { id: "1-13", name: "Fakie kickturn op flat", certified: false },
      { id: "1-14", name: "Backside kickturn op bank", certified: false },
      { id: "1-15", name: "Backside kickturn op flat", certified: false },
    ],
  },
  {
    id: 2,
    name: "Level 2",
    requiredPercent: 100,
    minRequired: null,
    totalTricks: 14,
    tricks: [
      { id: "2-01", name: "Drop van quarter", certified: false },
      { id: "2-02", name: "Pompen in transition", certified: false },
      { id: "2-03", name: "FS kickturn op bank", certified: false },
      { id: "2-04", name: "FS kickturn op quarter", certified: false },
      { id: "2-05", name: "Afduwen tijdens over toestel rijden", certified: false },
      { id: "2-06", name: "Fly-out, eindigen met board in handen", certified: false },
      { id: "2-07", name: "Over stok rijden (kantelbeweging)", certified: false },
      { id: "2-08", name: "Poptechniek koppelen aan kleine sprong", certified: false },
      { id: "2-09", name: "Verhoog afrijden en landen op 4 wielen", certified: false },
      { id: "2-10", name: "Schans/kicker afrijden en landen op 4 wielen", certified: false },
      { id: "2-11", name: "180 hippiejump op flat", certified: false },
      { id: "2-12", name: "180 hippiejump op bank", certified: false },
      { id: "2-13", name: "Axl drop", certified: false },
      { id: "2-14", name: "Eigen trick", certified: false },
    ],
  },
  {
    id: 3,
    name: "Level 3",
    requiredPercent: 100,
    minRequired: null,
    totalTricks: 13,
    tricks: [
      { id: "3-01", name: "Rijdende ollie", certified: false },
      { id: "3-02", name: "Boneless", certified: false },
      { id: "3-03", name: "Grinden op curb zonder ollie", certified: false },
      { id: "3-04", name: "Loopstart", certified: false },
      { id: "3-05", name: "Fly-out, op board", certified: false },
      { id: "3-06", name: "Roll in", certified: false },
      { id: "3-07", name: "Axl stall", certified: false },
      { id: "3-08", name: "Feeble stall", certified: false },
      { id: "3-09", name: "Rock to fakie", certified: false },
      { id: "3-10", name: "Rock & Roll", certified: false },
      { id: "3-11", name: "Tailstall", certified: false },
      { id: "3-12", name: "180 hippiejump in quarter", certified: false },
      { id: "3-13", name: "Manual op flat 1m", certified: false },
    ],
  },
]

export function getLevelProgress(level: Level): number {
  const certified = level.tricks.filter((t) => t.certified).length
  return Math.round((certified / level.totalTricks) * 100)
}

export function isLevelPassed(level: Level): boolean {
  const certified = level.tricks.filter((t) => t.certified).length
  if (level.minRequired !== null) {
    return certified >= level.minRequired
  }
  return certified === level.totalTricks
}