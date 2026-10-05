import { ArrowLeft, CircleDashed } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  description: string
  phase: string
}

export function PlaceholderPage({ title, description, phase }: PlaceholderPageProps) {
  return (
    <section className="placeholder-page">
      <div className="eyebrow"><span className="eyebrow-line" />CYBERSAFE ROADMAP</div>
      <div className="placeholder-icon"><CircleDashed size={22} /></div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="placeholder-phase">Planned for {phase}</div>
      <Link to="/" className="text-link"><ArrowLeft size={15} /> Back to overview</Link>
    </section>
  )
}