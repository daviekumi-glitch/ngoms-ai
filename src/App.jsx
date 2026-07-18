import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
import Layout from './components/layout/Layout'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  useEffect(() => { setTimeout(() => setShowSplash(false), 3000) }, [])
  if (showSplash) return <SplashScreen />
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="chat" element={<ChatTutor />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="quiz" element={<QuizEngine />} />
        <Route path="notes" element={<SmartNotes />} />
        <Route path="planner" element={<StudyPlanner />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
