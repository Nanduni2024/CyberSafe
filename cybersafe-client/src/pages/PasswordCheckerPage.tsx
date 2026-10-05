import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from 'lucide-react'
import { checkPassword, type PasswordCheckResponse } from '../services/api'
import { addScanHistory } from '../services/history'

export function PasswordCheckerPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [result, setResult] = useState<PasswordCheckResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!password) {
      setError('Enter a password to check.')
      return
    }

    setLoading(true)
    try {
      const nextResult = await checkPassword(password)
      setResult(nextResult)
      addScanHistory({
        type: 'Password',
        label: 'Password strength check',
        rating: nextResult.rating,
        score: nextResult.score,
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
        <div className="eyebrow"><span className="eyebrow-line" />PASSWORD CHECKER</div>
        <h1>Test password strength without saving it.</h1>
        <p>CyberSafe checks length, variety, common patterns, and obvious weak passwords. Do not enter a real password you currently use in production systems.</p>
      </div>

      <div className="tool-grid">
        <form className="tool-card" onSubmit={handleSubmit}>
          <label htmlFor="password-input">Password</label>
          <div className="input-with-button">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Try a sample password"
              autoComplete="off"
            />
            <button type="button" className="inline-icon-button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-action tool-submit" type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <KeyRound size={16} />}
            Check password
          </button>
        </form>

        <div className="result-card">
          {result ? (
            <>
              <div className="result-top">
                <div className="result-icon"><ShieldCheck size={22} /></div>
                <div><span>Strength rating</span><strong>{result.rating}</strong></div>
                <div className="result-score">{result.score}<span>/100</span></div>
              </div>
              <div className="result-track"><span style={{ width: `${result.score}%` }} /></div>
              <ul className="feedback-list">
                {result.feedback.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          ) : (
            <div className="empty-result">
              <KeyRound size={28} />
              <strong>Waiting for a password check</strong>
              <span>Your result will appear here after the API reviews the password.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
