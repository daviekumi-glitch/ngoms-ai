import { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider, useApp } from './context/AppContext'
import ErrorBoundary from './ErrorBoundary'
import SplashScreen from './pages/SplashScreen'
import Layout from './components/layout/Layout'

// ── Issue #3 Fix: Lazy-load all heavy pages ──
const Dashboard     = lazy(() => import('./pages/Dashboard'))
const Documents     = lazy(() => import('./pages/Documents'))
const ChatTutor     = lazy(() => import('./pages/ChatTutor'))
const Flashcards    = lazy(() => import('./pages/Flashcards'))
const QuizEngine    = lazy(() => import('./pages/QuizEngine'))
const SmartNotes    = lazy(() => import('./pages/SmartNotes'))
const StudyPlanner  = lazy(() => import('./pages/StudyPlanner'))
const Analytics     = lazy(() => import('./pages/Analytics'))
const Leaderboard   = lazy(() => import('./pages/Leaderboard'))
const Settings      = lazy(() => import('./pages/Settings'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Profile       = lazy(() => import('./pages/Profile'))
const AdminPanel    = lazy(() => import('./pages/AdminPanel'))
const Onboarding    = lazy(() => import('./pages/Onboarding'))

// ── Issue #5 Fix: Loading skeleton shown while pages lazy-load ──
function PageSkeleton() {
  return (
    <div className="p-5 max-w-2xl mx-auto animate-pulse">
      <div className="skeleton h-7 w-40 mb-2 rounded-2xl" />
      <div className="skeleton h-4 w-28 mb-6 rounded-xl" />
      <div className="skeleton h-32 rounded-3xl mb-4" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
      </div>
      <div className="skeleton h-40 rounded-3xl" />
    </div>
  )
}

function MaintenanceGate({ children }) {
  const { appSettings } = useApp()
  if (appSettings?.maintenanceMode) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🔧</div>
        <h1 className="text-2xl font-black text-ink mb-2">Under Maintenance</h1>
        <p className="text-ink-muted text-sm">{appSettings.maintenanceMessage || "We'll be back soon."}</p>
      </div>
    </div>
  )
  return children
}

function AppRoutes() {
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('ngoms_onboarded'))
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/onboarding" element={<Onboarding onDone={() => setOnboarded(true)} />} />
        <Route path="/" element={<MaintenanceGate><Layout /></MaintenanceGate>}>
          <Route index element={onboarded ? <Dashboard /> : <Navigate to="/onboarding" replace />} />
          <Route path="documents"      element={<Documents />} />
          <Route path="chat"           element={<ChatTutor />} />
          <Route path="flashcards"     element={<Flashcards />} />
          <Route path="quiz"           element={<QuizEngine />} />
          <Route path="notes"          element={<SmartNotes />} />
          <Route path="planner"        element={<StudyPlanner />} />
          <Route path="analytics"      element={<Analytics />} />
          <Route path="leaderboard"    element={<Leaderboard />} />
          <Route path="notifications"  element={<Notifications />} />
          <Route path="profile"        element={<Profile />} />
          <Route path="settings"       element={<Settings />} />
          <Route path="admin"          element={<AdminPanel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2800)
    return () => clearTimeout(t)
  }, [])

  if (showSplash) return <SplashScreen />

  return (
    <ErrorBoundary>
      <AppProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background:'#fff', color:'#1A1F36', borderRadius:'16px', fontSize:'14px', fontWeight:600, boxShadow:'0 4px 24px rgba(15,115,247,0.12)', border:'1px solid #E2EAF4' },
            success: { iconTheme: { primary:'#22C55E', secondary:'#fff' } },
            error:   { iconTheme: { primary:'#EF4444', secondary:'#fff' } },
          }}
        />
        <AppRoutes />
      </AppProvider>
    </ErrorBoundary>
  )
}
