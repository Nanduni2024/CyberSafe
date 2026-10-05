import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeAlert,
  BellRing,
  Check,
  Clock3,
  DatabaseZap,
  ExternalLink,
  Fingerprint,
  Globe2,
  LockKeyhole,
  MonitorCheck,
  Shield,
  ShieldAlert,
  Siren,
  Wifi,
} from 'lucide-react'
import { getApiHealth } from '../services/api'

type ApiState = 'checking' | 'online' | 'offline'

const exposureChecks = [
  { label: 'Password reuse', value: 'Not checked', tone: 'waiting', icon: LockKeyhole },
  { label: 'Suspicious link', value: 'Ready', tone: 'ready', icon: Globe2 },
  { label: 'Saved history', value: 'Off', tone: 'quiet', icon: DatabaseZap },
]

const actionPlan = [
  { title: 'Strengthen important passwords', detail: 'Start with email, banking, cloud storage, and social accounts.', icon: LockKeyhole },
  { title: 'Verify links before opening', detail: 'Look for misspelled domains, odd subdomains, and rushed language.', icon: ExternalLink },
  { title: 'Turn on multi-factor sign-in', detail: 'Use an authenticator app where possible for stronger protection.', icon: Fingerprint },
]

const pulseItems = [
  { label: 'API health', value: 'Live check', icon: MonitorCheck },
  { label: 'Privacy mode', value: 'No storage', icon: Shield },
  { label: 'Network safety', value: 'Guided review', icon: Wifi },
]

export function DashboardPage() {
  const [apiState, setApiState] = useState<ApiState>('checking')

  useEffect(() => {
    let active = true
    getApiHealth()
      .then(() => active && setApiState('online'))
      .catch(() => active && setApiState('offline'))
    return () => { active = false }
  }, [])

  return (
    <div className="dashboard">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" />CYBERSAFE CONTROL CENTER</div>
          <h1>Check everyday cyber risks before they become problems.</h1>
          <p className="welcome-copy">CyberSafe is a personal safety workspace for password habits, suspicious links, and simple security guidance.</p>
          <div className="hero-actions">
            <Link to="/password-checker" className="primary-action">Check a password <ArrowRight size={16} /></Link>
            <Link to="/url-checker" className="secondary-action">Review a URL</Link>
          </div>
        </div>
        <div className="hero-console" aria-label="CyberSafe status console">
          <div className="console-header">
            <span className="console-dot" />
            <span className="console-dot" />
            <span className="console-dot" />
            <strong>cybersafe.scan</strong>
          </div>
          <div className="console-body">
            <div><span>mode</span><strong>private preview</strong></div>
            <div><span>storage</span><strong>disabled</strong></div>
            <div><span>risk tools</span><strong>queued</strong></div>
            <div className={`api-status api-${apiState}`}><span className="status-dot" />API {apiState === 'checking' ? 'connecting' : apiState}</div>
          </div>
        </div>
      </section>

      <section className="pulse-strip" aria-label="CyberSafe operating status">
        {pulseItems.map(({ label, value, icon: Icon }) => (
          <div className="pulse-item" key={label}>
            <Icon size={18} />
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="content-grid">
        <article className="surface risk-surface">
          <div className="section-heading">
            <div><div className="section-kicker">READINESS</div><h2>Risk checks</h2></div>
            <span className="section-badge">Preview</span>
          </div>
          <div className="risk-list">
            {exposureChecks.map(({ label, value, tone, icon: Icon }) => (
              <div className={`risk-row risk-${tone}`} key={label}>
                <div className="risk-icon"><Icon size={18} /></div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="preview-notice"><BadgeAlert size={16} /><span>Scanning features are staged for upcoming phases. This screen avoids fake personal results.</span></div>
        </article>

        <article className="surface action-surface">
          <div className="section-heading">
            <div><div className="section-kicker">NEXT STEPS</div><h2>Personal safety plan</h2></div>
            <div className="alert-mark"><BellRing size={16} /></div>
          </div>
          <div className="action-list">
            {actionPlan.map(({ title, detail, icon: Icon }) => (
              <div className="action-row" key={title}>
                <div className="action-icon"><Icon size={17} /></div>
                <div><strong>{title}</strong><p>{detail}</p></div>
                <Check size={16} className="action-check" />
              </div>
            ))}
          </div>
        </article>

        <article className="surface timeline-surface">
          <div className="section-heading">
            <div><div className="section-kicker">PROJECT ROADMAP</div><h2>Build phases</h2></div>
            <Clock3 size={17} className="muted-icon" />
          </div>
          <div className="timeline">
            <div className="timeline-item active"><span>01</span><strong>Interface foundation</strong><p>CyberSafe layout, navigation, and API status.</p></div>
            <div className="timeline-item"><span>02</span><strong>Password checker</strong><p>Private strength guidance without saving secrets.</p></div>
            <div className="timeline-item"><span>03</span><strong>URL checker</strong><p>Defensive review of common risky URL signals.</p></div>
          </div>
          <Link to="/tips" className="text-link">Open tips library <ArrowRight size={15} /></Link>
        </article>

        <article className="surface emergency-surface">
          <div className="emergency-icon"><Siren size={20} /></div>
          <div>
            <div className="section-kicker">QUICK RESPONSE</div>
            <h2>Think an account is compromised?</h2>
            <p>Change the password from a trusted device, sign out other sessions, enable multi-factor sign-in, and review recent activity.</p>
          </div>
          <ShieldAlert size={20} className="emergency-shield" />
        </article>
      </section>

      <footer className="dashboard-footer"><span><Shield size={14} />CYBERSAFE</span><span>Educational cyber hygiene project <span className="footer-separator">|</span> No data collected in this preview</span></footer>
    </div>
  )
}
