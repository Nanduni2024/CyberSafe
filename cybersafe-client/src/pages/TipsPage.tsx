import { CheckCircle2, Fingerprint, KeyRound, Link2, Smartphone } from 'lucide-react'

const tips = [
  {
    title: 'Use unique passwords',
    detail: 'Create a different password for every important account. A password manager makes this practical.',
    icon: KeyRound,
  },
  {
    title: 'Check the real domain',
    detail: 'Before signing in, read the domain from right to left and watch for misspellings or extra words.',
    icon: Link2,
  },
  {
    title: 'Enable multi-factor sign-in',
    detail: 'Use an authenticator app or security key where possible, especially for email and banking.',
    icon: Smartphone,
  },
  {
    title: 'Review account activity',
    detail: 'If something feels wrong, check active sessions, recovery email, phone number, and recent login history.',
    icon: Fingerprint,
  },
]

export function TipsPage() {
  return (
    <section className="tool-page">
      <div className="tool-intro">
        <div className="eyebrow"><span className="eyebrow-line" />SECURITY TIPS</div>
        <h1>Small habits that prevent common attacks.</h1>
        <p>Use these as a quick checklist when securing your own accounts or helping someone else stay safer online.</p>
      </div>

      <div className="tips-grid">
        {tips.map(({ title, detail, icon: Icon }) => (
          <article className="tip-card" key={title}>
            <div className="tip-icon"><Icon size={21} /></div>
            <h2>{title}</h2>
            <p>{detail}</p>
            <span><CheckCircle2 size={15} />Recommended</span>
          </article>
        ))}
      </div>
    </section>
  )
}
