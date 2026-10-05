import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  BookOpenText,
  Clock3,
  Gauge,
  Link2,
  LockKeyhole,
  Menu,
  Radar,
  Shield,
  X,
} from 'lucide-react'

const navigation = [
  { to: '/', label: 'Control center', icon: Gauge, end: true },
  { to: '/password-checker', label: 'Password checker', icon: LockKeyhole },
  { to: '/url-checker', label: 'URL checker', icon: Link2 },
  { to: '/history', label: 'Scan history', icon: Clock3 },
  { to: '/tips', label: 'Security tips', icon: BookOpenText },
]

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-frame">
      {menuOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Shield size={20} strokeWidth={2.1} /></div>
          <span className="brand-name">CyberSafe</span>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>

        <div className="workspace-label">CYBER HYGIENE TOOLS</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="workspace-card">
            <div className="workspace-icon"><Radar size={19} /></div>
            <div><strong>Private workspace</strong><span>No personal data stored</span></div>
          </div>
        </div>
      </aside>

      <main className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>CyberSafe</span><span className="breadcrumb-slash">/</span><strong>Control center</strong></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
