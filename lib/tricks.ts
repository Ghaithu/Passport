export type Branch =
  | "draaien"
  | "balans"
  | "springen"
  | "obstakels"
  | "flips"
  | "scoop"
  | "stances"
  | "transition"
  | "foundation"

export type Trick = {
  id: string
  name: string
  level: number
  branch: Branch
  certified: boolean
  certifiedBy?: string
  certifiedAt?: string
}

export type Level = {
  id: number
  name: string
  requiredPercent: number
  minRequired: number | null
  totalTricks: number
  tricks: Trick[]
}

export const branchColor: Record<Branch, string> = {
  foundation: "#BA7517",
  draaien:    "#e879f9",
  balans:     "#38bdf8",
  springen:   "#facc15",
  obstakels:  "#f97316",
  flips:      "#1D9E75",
  scoop:      "#a78bfa",
  stances:    "#fb7185",
  transition: "#185FA5",
}

export const branchLabel: Record<Branch, string> = {
  foundation: "Foundation",
  draaien:    "Draaien",
  balans:     "Balans",
  springen:   "Springen",
  obstakels:  "Obstakels",
  flips:      "Flips",
  scoop:      "Scoop",
  stances:    "Stances",
  transition:  "Transition",
}

export const levels: Level[] = [
  {
    id: 1, name: "Level 1", requiredPercent: 100, minRequired: null, totalTricks: 15,
    tricks: [
      { id: "1-01", name: "Basishouding stilstaand",                    level: 1, branch: "foundation", certified: false },
      { id: "1-02", name: "Basishouding rijdend",                       level: 1, branch: "foundation", certified: false },
      { id: "1-03", name: "FS en BS sturen door te leunen",             level: 1, branch: "balans",     certified: false },
      { id: "1-04", name: "Al rijdend verschillende grabs",             level: 1, branch: "balans",     certified: false },
      { id: "1-05", name: "Hippie jump zonder obstakel",                level: 1, branch: "springen",   certified: false },
      { id: "1-06", name: "Noodstop, voorwaarts van board stappen",     level: 1, branch: "balans",     certified: false },
      { id: "1-07", name: "Volledige ronde draaien ter plaatse op flat",level: 1, branch: "draaien",    certified: false },
      { id: "1-08", name: "Tiktak vanuit stilstand naar rijdend",       level: 1, branch: "balans",     certified: false },
      { id: "1-09", name: "Bank afrijden",                              level: 1, branch: "transition",  certified: false },
      { id: "1-10", name: "Drop bank",                                  level: 1, branch: "transition",  certified: false },
      { id: "1-11", name: "Op bank rijden en fakie naar beneden",       level: 1, branch: "transition",  certified: false },
      { id: "1-12", name: "Op quarter rijden en fakie naar beneden",    level: 1, branch: "transition",  certified: false },
      { id: "1-13", name: "Fakie kickturn op flat",                     level: 1, branch: "draaien",    certified: false },
      { id: "1-14", name: "Backside kickturn op bank",                  level: 1, branch: "draaien",    certified: false },
      { id: "1-15", name: "Backside kickturn op flat",                  level: 1, branch: "draaien",    certified: false },
    ],
  },
  {
    id: 2, name: "Level 2", requiredPercent: 100, minRequired: null, totalTricks: 15,
    tricks: [
      { id: "2-01", name: "Drop van quarter",                                       level: 2, branch: "transition",  certified: false },
      { id: "2-02", name: "Pompen in transition",                                   level: 2, branch: "transition",  certified: false },
      { id: "2-03", name: "FS kickturn op bank",                                    level: 2, branch: "draaien",    certified: false },
      { id: "2-04", name: "FS kickturn op quarter",                                 level: 2, branch: "draaien",    certified: false },
      { id: "2-05", name: "Afduwen tijdens over toestel rijden",                    level: 2, branch: "obstakels",  certified: false },
      { id: "2-06", name: "Fly-out, eindigen met board in handen",                  level: 2, branch: "springen",   certified: false },
      { id: "2-07", name: "Over stok rijden, kantelbeweging over tail en nose",     level: 2, branch: "balans",     certified: false },
      { id: "2-08", name: "Poptechniek koppelen aan kleine sprong",                 level: 2, branch: "springen",   certified: false },
      { id: "2-09", name: "Verhoog afrijden en landen op 4 wielen",                 level: 2, branch: "springen",   certified: false },
      { id: "2-10", name: "Schans/kicker afrijden en landen op 4 wielen",           level: 2, branch: "springen",   certified: false },
      { id: "2-11", name: "180 hippiejump op flat",                                 level: 2, branch: "draaien",    certified: false },
      { id: "2-12", name: "180 hippiejump op bank",                                 level: 2, branch: "draaien",    certified: false },
      { id: "2-13", name: "Axl drop",                                               level: 2, branch: "obstakels",  certified: false },
      { id: "2-14", name: "Eigen trick",                                             level: 2, branch: "foundation", certified: false },
      { id: "2-15", name: "Eigen trick",                                             level: 2, branch: "foundation", certified: false },
    ],
  },
  {
    id: 3, name: "Level 3", requiredPercent: 100, minRequired: null, totalTricks: 15,
    tricks: [
      { id: "3-01", name: "Rijdende ollie",                             level: 3, branch: "springen",   certified: false },
      { id: "3-02", name: "Boneless",                                   level: 3, branch: "springen",   certified: false },
      { id: "3-03", name: "Grinden op curb zonder ollie",               level: 3, branch: "obstakels",  certified: false },
      { id: "3-04", name: "Loopstart",                                  level: 3, branch: "foundation", certified: false },
      { id: "3-05", name: "Fly-out, op board",                          level: 3, branch: "springen",   certified: false },
      { id: "3-06", name: "Roll in",                                    level: 3, branch: "transition",  certified: false },
      { id: "3-07", name: "Axl stall",                                  level: 3, branch: "obstakels",  certified: false },
      { id: "3-08", name: "Feeble stall",                               level: 3, branch: "obstakels",  certified: false },
      { id: "3-09", name: "Rock to fakie",                              level: 3, branch: "transition",  certified: false },
      { id: "3-10", name: "Rock & Roll",                                level: 3, branch: "transition",  certified: false },
      { id: "3-11", name: "Tailstall",                                  level: 3, branch: "obstakels",  certified: false },
      { id: "3-12", name: "180 hippiejump in quarter",                  level: 3, branch: "draaien",    certified: false },
      { id: "3-13", name: "Manual op flat 1m",                          level: 3, branch: "balans",     certified: false },
      { id: "3-14", name: "Eigen trick",                                level: 3, branch: "foundation", certified: false },
      { id: "3-15", name: "Eigen trick",                                level: 3, branch: "foundation", certified: false },
    ],
  },
  {
    id: 4, name: "Level 4", requiredPercent: 80, minRequired: 12, totalTricks: 15,
    tricks: [
      { id: "4-01", name: "Fakie shuvit",                level: 4, branch: "scoop",     certified: false },
      { id: "4-02", name: "Ollie uit bank",              level: 4, branch: "springen",  certified: false },
      { id: "4-03", name: "Ollie in bank",               level: 4, branch: "springen",  certified: false },
      { id: "4-04", name: "Ollie to fakie op bank",      level: 4, branch: "springen",  certified: false },
      { id: "4-05", name: "Ollie van plateau",           level: 4, branch: "springen",  certified: false },
      { id: "4-06", name: "Ollie op plateau",            level: 4, branch: "springen",  certified: false },
      { id: "4-07", name: "Roll in",                     level: 4, branch: "transition", certified: false },
      { id: "4-08", name: "Slasher 5-0 quarter",         level: 4, branch: "obstakels", certified: false },
      { id: "4-09", name: "50-50 quarter",               level: 4, branch: "obstakels", certified: false },
      { id: "4-10", name: "Switch rock",                 level: 4, branch: "stances",   certified: false },
      { id: "4-11", name: "Manual flat 3m",              level: 4, branch: "balans",    certified: false },
      { id: "4-12", name: "Nose manual flat 1m",         level: 4, branch: "balans",    certified: false },
      { id: "4-13", name: "Eigen trick",                 level: 4, branch: "foundation", certified: false },
      { id: "4-14", name: "Eigen trick",                 level: 4, branch: "foundation", certified: false },
      { id: "4-15", name: "Eigen trick",                 level: 4, branch: "foundation", certified: false },
    ],
  },
  {
    id: 5, name: "Level 5", requiredPercent: 80, minRequired: 12, totalTricks: 15,
    tricks: [
      { id: "5-01", name: "Pop shuvit FS of BS",         level: 5, branch: "scoop",     certified: false },
      { id: "5-02", name: "180 FS of BS",                level: 5, branch: "draaien",   certified: false },
      { id: "5-03", name: "Fakie ollie",                 level: 5, branch: "stances",   certified: false },
      { id: "5-04", name: "Halfcab",                     level: 5, branch: "stances",   certified: false },
      { id: "5-05", name: "Ollie over hip",              level: 5, branch: "springen",  certified: false },
      { id: "5-06", name: "Boardslide FS of BS",         level: 5, branch: "obstakels", certified: false },
      { id: "5-07", name: "50-50 FS of BS",              level: 5, branch: "obstakels", certified: false },
      { id: "5-08", name: "Ollie to manual op plateau",  level: 5, branch: "balans",    certified: false },
      { id: "5-09", name: "Nosestall quarter",           level: 5, branch: "obstakels", certified: false },
      { id: "5-10", name: "5-0 stall quarter",           level: 5, branch: "obstakels", certified: false },
      { id: "5-11", name: "Fakie 180 rock to fakie",     level: 5, branch: "transition", certified: false },
      { id: "5-12", name: "Fakie Rock & Roll",           level: 5, branch: "transition", certified: false },
      { id: "5-13", name: "Eigen trick",                 level: 5, branch: "foundation", certified: false },
      { id: "5-14", name: "Eigen trick",                 level: 5, branch: "foundation", certified: false },
      { id: "5-15", name: "Eigen trick",                 level: 5, branch: "foundation", certified: false },
    ],
  },
  {
    id: 6, name: "Level 6", requiredPercent: 80, minRequired: 24, totalTricks: 30,
    tricks: [
      { id: "6-01", name: "Nollie (rijdend)",                    level: 6, branch: "stances",   certified: false },
      { id: "6-02", name: "Switch ollie",                        level: 6, branch: "stances",   certified: false },
      { id: "6-03", name: "180 ollie BS en FS",                  level: 6, branch: "draaien",   certified: false },
      { id: "6-04", name: "Fakie FS 180",                        level: 6, branch: "stances",   certified: false },
      { id: "6-05", name: "Nollie 180 FS of BS",                 level: 6, branch: "stances",   certified: false },
      { id: "6-06", name: "Switch 180 FS of BS",                 level: 6, branch: "stances",   certified: false },
      { id: "6-07", name: "Pop shuvit FS en BS",                 level: 6, branch: "scoop",     certified: false },
      { id: "6-08", name: "Kickflip of heelflip",                level: 6, branch: "flips",     certified: false },
      { id: "6-09", name: "Nollie pop shuvit FS of BS",          level: 6, branch: "scoop",     certified: false },
      { id: "6-10", name: "Fakie pop shuvit FS of BS",           level: 6, branch: "scoop",     certified: false },
      { id: "6-11", name: "Fakie bigspin FS of BS",              level: 6, branch: "draaien",   certified: false },
      { id: "6-12", name: "Fakie kickflip of heelflip",          level: 6, branch: "flips",     certified: false },
      { id: "6-13", name: "Switch shuvit FS of BS",              level: 6, branch: "scoop",     certified: false },
      { id: "6-14", name: "No comply",                           level: 6, branch: "scoop",     certified: false },
      { id: "6-15", name: "50-50 BS en FS",                      level: 6, branch: "obstakels", certified: false },
      { id: "6-16", name: "Boardslide FS en BS",                 level: 6, branch: "obstakels", certified: false },
      { id: "6-17", name: "50-50 up ledge FS of BS",             level: 6, branch: "obstakels", certified: false },
      { id: "6-18", name: "50-50 down ledge FS of BS",           level: 6, branch: "obstakels", certified: false },
      { id: "6-19", name: "Boardslide uprail BS of FS",          level: 6, branch: "obstakels", certified: false },
      { id: "6-20", name: "Ollie to manual op plateau 3m",       level: 6, branch: "balans",    certified: false },
      { id: "6-21", name: "Noseslide op curb BS of FS",          level: 6, branch: "obstakels", certified: false },
      { id: "6-22", name: "FS en BS ollie transition",           level: 6, branch: "transition", certified: false },
      { id: "6-23", name: "Disaster FS of BS",                   level: 6, branch: "transition", certified: false },
      { id: "6-24", name: "5-0 grind FS of BS transition",       level: 6, branch: "transition", certified: false },
      { id: "6-25", name: "FS axl stall",                        level: 6, branch: "obstakels", certified: false },
      { id: "6-26", name: "Smith stall FS of BS",                level: 6, branch: "obstakels", certified: false },
      { id: "6-27", name: "FS feeble stall",                     level: 6, branch: "obstakels", certified: false },
      { id: "6-28", name: "Eigen trick",                         level: 6, branch: "foundation", certified: false },
      { id: "6-29", name: "Eigen trick",                         level: 6, branch: "foundation", certified: false },
      { id: "6-30", name: "Eigen trick",                         level: 6, branch: "foundation", certified: false },
    ],
  },
  {
    id: 7, name: "Level 7", requiredPercent: 70, minRequired: 30, totalTricks: 45,
    tricks: [
      { id: "7-01", name: "Nollie 180 FS en BS",                 level: 7, branch: "stances",   certified: false },
      { id: "7-02", name: "Switch 180 FS en BS",                 level: 7, branch: "stances",   certified: false },
      { id: "7-03", name: "Nollie pop shuvit FS en BS",          level: 7, branch: "scoop",     certified: false },
      { id: "7-04", name: "Fakie pop shuvit FS en BS",           level: 7, branch: "scoop",     certified: false },
      { id: "7-05", name: "Fakie bigspin FS en BS",              level: 7, branch: "draaien",   certified: false },
      { id: "7-06", name: "Fakie kickflip en heelflip",          level: 7, branch: "flips",     certified: false },
      { id: "7-07", name: "Switch shuvit FS en BS",              level: 7, branch: "scoop",     certified: false },
      { id: "7-08", name: "FS of BS flip",                       level: 7, branch: "flips",     certified: false },
      { id: "7-09", name: "Bigspin FS of BS",                    level: 7, branch: "draaien",   certified: false },
      { id: "7-10", name: "Varial kickflip of heelflip",         level: 7, branch: "flips",     certified: false },
      { id: "7-11", name: "Switch kickflip of heelflip",         level: 7, branch: "flips",     certified: false },
      { id: "7-12", name: "Nollie kickflip of heelflip",         level: 7, branch: "flips",     certified: false },
      { id: "7-13", name: "Nollie BS of FS 180",                 level: 7, branch: "stances",   certified: false },
      { id: "7-14", name: "Fakie full cab of fakie FS 360",      level: 7, branch: "draaien",   certified: false },
      { id: "7-15", name: "50-50 up ledge FS en BS",             level: 7, branch: "obstakels", certified: false },
      { id: "7-16", name: "50-50 down ledge FS en BS",           level: 7, branch: "obstakels", certified: false },
      { id: "7-17", name: "Noseslide op curb BS en FS",          level: 7, branch: "obstakels", certified: false },
      { id: "7-18", name: "Boardslide uprail BS en FS",          level: 7, branch: "obstakels", certified: false },
      { id: "7-19", name: "Boardslide downrail BS of FS",        level: 7, branch: "obstakels", certified: false },
      { id: "7-20", name: "FS of BS lipslide op flatrail",       level: 7, branch: "obstakels", certified: false },
      { id: "7-21", name: "BS crooked op curb",                  level: 7, branch: "obstakels", certified: false },
      { id: "7-22", name: "FS of BS nosegrind op curb",          level: 7, branch: "obstakels", certified: false },
      { id: "7-23", name: "FS of BS smithgrind op rail",         level: 7, branch: "obstakels", certified: false },
      { id: "7-24", name: "FS of BS feeblegrind op rail",        level: 7, branch: "obstakels", certified: false },
      { id: "7-25", name: "FS of BS tailslide op curb",          level: 7, branch: "obstakels", certified: false },
      { id: "7-26", name: "Boardslide shuvit out BS of FS",      level: 7, branch: "obstakels", certified: false },
      { id: "7-27", name: "50-50 shuvit out FS of BS",           level: 7, branch: "obstakels", certified: false },
      { id: "7-28", name: "5-0 180 out FS of BS",                level: 7, branch: "obstakels", certified: false },
      { id: "7-29", name: "Fakie 50-50 op curb FS of BS",        level: 7, branch: "obstakels", certified: false },
      { id: "7-30", name: "Kickflip 50-50 FS of BS",             level: 7, branch: "flips",     certified: false },
      { id: "7-31", name: "Nosemanual op plateau",               level: 7, branch: "balans",    certified: false },
      { id: "7-32", name: "Halfcab manual op plateau",           level: 7, branch: "balans",    certified: false },
      { id: "7-33", name: "Disaster FS en BS",                   level: 7, branch: "transition", certified: false },
      { id: "7-34", name: "5-0 grind FS en BS transition",       level: 7, branch: "transition", certified: false },
      { id: "7-35", name: "Smith stall FS en BS",                level: 7, branch: "obstakels", certified: false },
      { id: "7-36", name: "Nosepick",                            level: 7, branch: "obstakels", certified: false },
      { id: "7-37", name: "Tailslide transition FS of BS",       level: 7, branch: "transition", certified: false },
      { id: "7-38", name: "Smithgrind transition FS of BS",      level: 7, branch: "transition", certified: false },
      { id: "7-39", name: "Lipslide transition FS of BS",        level: 7, branch: "transition", certified: false },
      { id: "7-40", name: "Blunt to fakie",                      level: 7, branch: "transition", certified: false },
      { id: "7-41", name: "Pivot to fakie FS of BS",             level: 7, branch: "transition", certified: false },
      { id: "7-42", name: "Air FS of BS",                        level: 7, branch: "transition", certified: false },
      { id: "7-43", name: "Eigen trick",                         level: 7, branch: "foundation", certified: false },
      { id: "7-44", name: "Eigen trick",                         level: 7, branch: "foundation", certified: false },
      { id: "7-45", name: "Eigen trick",                         level: 7, branch: "foundation", certified: false },
    ],
  },
  {
    id: 8, name: "Level 8", requiredPercent: 70, minRequired: 30, totalTricks: 45,
    tricks: [
      { id: "8-01", name: "FS en BS flip",                       level: 8, branch: "flips",     certified: false },
      { id: "8-02", name: "Treflip",                             level: 8, branch: "flips",     certified: false },
      { id: "8-03", name: "Fakie treflip",                       level: 8, branch: "flips",     certified: false },
      { id: "8-04", name: "FS en BS 360",                        level: 8, branch: "draaien",   certified: false },
      { id: "8-05", name: "Impossible",                          level: 8, branch: "scoop",     certified: false },
      { id: "8-06", name: "Bigspin FS en BS",                    level: 8, branch: "draaien",   certified: false },
      { id: "8-07", name: "Varial kickflip en heelflip",         level: 8, branch: "flips",     certified: false },
      { id: "8-08", name: "Switch kickflip en heelflip",         level: 8, branch: "flips",     certified: false },
      { id: "8-09", name: "Nollie kickflip en heelflip",         level: 8, branch: "flips",     certified: false },
      { id: "8-10", name: "Nollie BS en FS 180",                 level: 8, branch: "stances",   certified: false },
      { id: "8-11", name: "Fakie full cab en fakie FS 360",      level: 8, branch: "draaien",   certified: false },
      { id: "8-12", name: "Boardslide downrail BS en FS",        level: 8, branch: "obstakels", certified: false },
      { id: "8-13", name: "FS en BS lipslide op flatrail",       level: 8, branch: "obstakels", certified: false },
      { id: "8-14", name: "FS of BS lipslide op downrail",       level: 8, branch: "obstakels", certified: false },
      { id: "8-15", name: "FS en BS nosegrind op curb",          level: 8, branch: "obstakels", certified: false },
      { id: "8-16", name: "FS en BS smithgrind op rail",         level: 8, branch: "obstakels", certified: false },
      { id: "8-17", name: "FS of BS feeble 180 out op rail",     level: 8, branch: "obstakels", certified: false },
      { id: "8-18", name: "Crooked grind 180 out FS of BS",      level: 8, branch: "obstakels", certified: false },
      { id: "8-19", name: "Nosegrind 280 out FS of BS",          level: 8, branch: "obstakels", certified: false },
      { id: "8-20", name: "FS of BS smithgrind op downrail",     level: 8, branch: "obstakels", certified: false },
      { id: "8-21", name: "FS en BS feeblegrind op rail",        level: 8, branch: "obstakels", certified: false },
      { id: "8-22", name: "FS en BS tailslide op curb",          level: 8, branch: "obstakels", certified: false },
      { id: "8-23", name: "FS of BS tailslide upledge",          level: 8, branch: "obstakels", certified: false },
      { id: "8-24", name: "FS of BS crooked grind upledge",      level: 8, branch: "obstakels", certified: false },
      { id: "8-25", name: "FS en BS 5-0 downledge",              level: 8, branch: "obstakels", certified: false },
      { id: "8-26", name: "Boardslide shuvit out BS en FS",      level: 8, branch: "obstakels", certified: false },
      { id: "8-27", name: "50-50 shuvit out FS en BS",           level: 8, branch: "obstakels", certified: false },
      { id: "8-28", name: "5-0 180 out FS en BS",                level: 8, branch: "obstakels", certified: false },
      { id: "8-29", name: "Fakie 50-50 op curb FS en BS",        level: 8, branch: "obstakels", certified: false },
      { id: "8-30", name: "Kickflip 50-50 FS en BS",             level: 8, branch: "flips",     certified: false },
      { id: "8-31", name: "Switch manual op plateau",            level: 8, branch: "stances",   certified: false },
      { id: "8-32", name: "Kickflip manual op plateau",          level: 8, branch: "flips",     certified: false },
      { id: "8-33", name: "Kickflip nose manual op plateau",     level: 8, branch: "flips",     certified: false },
      { id: "8-34", name: "Tailslide transition FS en BS",       level: 8, branch: "transition", certified: false },
      { id: "8-35", name: "Smithgrind transition FS en BS",      level: 8, branch: "transition", certified: false },
      { id: "8-36", name: "Lipslide transition FS en BS",        level: 8, branch: "transition", certified: false },
      { id: "8-37", name: "Pivot to fakie FS en BS",             level: 8, branch: "transition", certified: false },
      { id: "8-38", name: "Air FS en BS",                        level: 8, branch: "transition", certified: false },
      { id: "8-39", name: "Switch blunt",                        level: 8, branch: "stances",   certified: false },
      { id: "8-40", name: "No comply disaster",                  level: 8, branch: "scoop",     certified: false },
      { id: "8-41", name: "360 ollie in transition",             level: 8, branch: "draaien",   certified: false },
      { id: "8-42", name: "Eigen trick",                         level: 8, branch: "foundation", certified: false },
      { id: "8-43", name: "Eigen trick",                         level: 8, branch: "foundation", certified: false },
      { id: "8-44", name: "Eigen trick",                         level: 8, branch: "foundation", certified: false },
      { id: "8-45", name: "Eigen trick",                         level: 8, branch: "foundation", certified: false },
    ],
  },
]

export function getLevelProgress(level: Level): number {
  const certified = level.tricks.filter(t => t.certified).length
  return Math.round((certified / level.totalTricks) * 100)
}

export function isLevelPassed(level: Level): boolean {
  const certified = level.tricks.filter(t => t.certified).length
  return level.minRequired !== null ? certified >= level.minRequired : certified === level.totalTricks
}

export function getTricksByBranch(branch: Branch): Trick[] {
  return levels.flatMap(l => l.tricks).filter(t => t.branch === branch)
}