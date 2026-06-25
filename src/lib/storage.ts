const LEADERBOARD_KEY = 'cao_tu_mln_leaderboard_v2'
const LEGACY_LEADERBOARD_KEYS = ['cao_tu_mln_leaderboard']

export interface LeaderboardEntry {
  name: string
  score: number
  rounds: number
  date: string
}

function purgeLegacyLeaderboards(): void {
  try {
    for (const key of LEGACY_LEADERBOARD_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    // ignore
  }
}

export function saveLeaderboard(entry: LeaderboardEntry): void {
  const current = getLeaderboard()
  const updated = [...current, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  purgeLegacyLeaderboards()
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    if (!raw) return []
    return JSON.parse(raw) as LeaderboardEntry[]
  } catch {
    return []
  }
}

export function clearLeaderboard(): void {
  purgeLegacyLeaderboards()
  try {
    localStorage.removeItem(LEADERBOARD_KEY)
  } catch {
    // ignore
  }
}
