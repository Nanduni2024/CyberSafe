import { useState, type FormEvent } from 'react'
import { Globe2, Link2, Loader2, ShieldAlert } from 'lucide-react'
import { checkUrl, type UrlCheckResponse } from '../services/api'
import { addScanHistory } from '../services/history'

export function UrlCheckerPage() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<UrlCheckResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!url.trim()) {
      setError('Enter a URL to review.')
      return
    }

    setLoading(true)
    try {
      const nextResult = await checkUrl(url)
      setResult(nextResult)
      addScanHistory({
        type: 'URL',
        label: getUrlLabel(url),
        rating: nextResult.rating,
        score: nextResult.riskScore,
      })
    } catch {
      setError('Could not reach the CyberSafe API. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="tool-page">
      <div className="tool-intro">
        <div className="eyebrow"><span className="eyebrow-line" />URL CHECKER</div>
        <h1>Review links before you trust them.</h1>
        <p>CyberSafe checks for common warning signs such as missing HTTPS, IP-address hosts, link shorteners, suspicious brand wording, and unusual URL shape.</p>
      </div>

      <div className="tool-grid">
        <form className="tool-card" onSubmit={handleSubmit}>
          <label htmlFor="url-input">URL</label>
          <div className="input-with-button">
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
            />
            <div className="input-static-icon"><Link2 size={18} /></div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-action tool-submit" type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <Globe2 size={16} />}
            Check URL
          </button>
        </form>

        <div className="result-card">
          {result ? (
            <>
              <div className="result-top">
                <div className="result-icon warning"><ShieldAlert size={22} /></div>
                <div><span>Risk rating</span><strong>{result.rating}</strong></div>
                <div className="result-score">{result.riskScore}<span>/100</span></div>
              </div>
              <div className="result-track warning"><span style={{ width: `${result.riskScore}%` }} /></div>
              <ul className="feedback-list">
                {result.findings.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          ) : (
            <div className="empty-result">
              <Globe2 size={28} />
              <strong>Waiting for a URL check</strong>
              <span>Your findings will appear here after the API reviews the link.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function getUrlLabel(value: string) {
  try {
    return new URL(value).hostname
  } catch {
    return 'URL review'
  }
}
