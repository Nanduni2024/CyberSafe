import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { HistoryPage } from './pages/HistoryPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { PasswordCheckerPage } from './pages/PasswordCheckerPage'
import { TipsPage } from './pages/TipsPage'
import { UrlCheckerPage } from './pages/UrlCheckerPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="password-checker" element={<PasswordCheckerPage />} />
        <Route path="url-checker" element={<UrlCheckerPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="tips" element={<TipsPage />} />
        <Route path="*" element={<PlaceholderPage title="Page not found" description="That page is not part of this preview." phase="a future update" />} />
      </Route>
    </Routes>
  )
}
