const LEADERBOARD_KEY = 'capaccumulate_leaderboard'

export interface LeaderboardEntry {
  name: string
  score: number
  rounds: number
  date: string
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
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    if (!raw) return []
    return JSON.parse(raw) as LeaderboardEntry[]
  } catch {
    return []
  }
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY)
  } catch {
    // ignore
  }
}
