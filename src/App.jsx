import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import SplashScreen from './pages/SplashScreen'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import ChatTutor from './pages/ChatTutor'
import Flashcards from './pages/Flashcards'
import QuizEngine from './pages/QuizEngine'
import SmartNotes from './pages/SmartNotes'
import StudyPlanner from './pages/StudyPlanner'
import Analytics from './pages/Analytics'
import Leaderboard from './pages/Leaderboard'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Layout from './components/layout/Layout'

function MaintenanceGate({ children }) {
  const { appSettings } = useApp()
  if (appSettings?.maintenanceMode) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-2xl font-black text-ink mb-2">Under Maintenance</h1>
          <p className="text-ink-muted text-sm">{appSettings.maintenanceMessage || 'We\'ll be back soon.'}</p>
        </div>
      </div>
    )
  }
  return children
}

function AppRoutes() {
  const onboarded = localStorage.getItem('ngoms_onboarded')
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<MaintenanceGate><Layout /></MaintenanceGate>}>
        <Route index element={!onboarded ? <Navigate to="/onboarding" /> : <Dashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="chat"      element={<ChatTutor />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="quiz"      element={<QuizEngine />} />
        <Route path="notes"     element={<SmartNotes />} />
        <Route path="planner"   element={<StudyPlanner />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile"   element={<Profile />} />
        <Route path="settings"  element={<Settings />} />
        <Route path="admin"     element={<AdminPanel />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  useEffect(() => { setTimeout(() => setShowSplash(false), 2800) }, [])
  if (showSplash) return <SplashScreen />
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
