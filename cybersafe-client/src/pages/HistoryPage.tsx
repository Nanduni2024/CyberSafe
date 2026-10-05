import { useMemo, useState } from 'react'
import { Clock3, KeyRound, Link2, Trash2 } from 'lucide-react'
import { clearScanHistory, getScanHistory } from '../services/history'

export function HistoryPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const history = useMemo(() => getScanHistory(), [refreshKey])

  function handleClear() {
    clearScanHistory()
    setRefreshKey((value) => value + 1)
  }

  return (
    <section className="tool-page">
      <div className="history-heading">
        <div className="tool-intro">
          <div className="eyebrow"><span className="eyebrow-line" />SCAN HISTORY</div>
          <h1>Recent local checks.</h1>
          <p>CyberSafe stores only lightweight scan summaries in this browser. Password text is never saved.</p>
        </div>
        {history.length > 0 && (
          <button type="button" className="secondary-action clear-button" onClick={handleClear}>
            <Trash2 size={16} />
            Clear history
          </button>
        )}
      </div>

      <div className="history-list surface">
        {history.length === 0 ? (
          <div className="empty-result">
            <Clock3 size={28} />
            <strong>No scans yet</strong>
            <span>Run a password or URL check and the summary will appear here.</span>
          </div>
        ) : (
          history.map((item) => (
            <div className="history-row" key={item.id}>
              <div className="history-icon">{item.type === 'Password' ? <KeyRound size={17} /> : <Link2 size={17} />}</div>
              <div>
                <strong>{item.label}</strong>
                <span>{item.type} check | {new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <div className="history-score">
                <strong>{item.rating}</strong>
                <span>{item.score}/100</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
