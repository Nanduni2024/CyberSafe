export interface ScanHistoryItem {
  id: string
  type: 'Password' | 'URL'
  label: string
  rating: string
  score: number
  createdAt: string
}

const historyKey = 'cybersafe.scanHistory'

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const rawHistory = window.localStorage.getItem(historyKey)
    if (!rawHistory) return []
    const parsed = JSON.parse(rawHistory)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addScanHistory(item: Omit<ScanHistoryItem, 'id' | 'createdAt'>) {
  const nextItem: ScanHistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  const history = [nextItem, ...getScanHistory()].slice(0, 20)
  window.localStorage.setItem(historyKey, JSON.stringify(history))
}

export function clearScanHistory() {
  window.localStorage.removeItem(historyKey)
}
