import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, FileText, MessageCircle, Layers, Zap, BookOpen, Calendar, BarChart2, Trophy, Settings, Brain } from 'lucide-react'

const navItems = [
  { to:'/', icon:LayoutDashboard, label:'Dashboard' },
  { to:'/documents', icon:FileText, label:'Documents' },
  { to:'/chat', icon:MessageCircle, label:'AI Tutor' },
  { to:'/flashcards', icon:Layers, label:'Flashcards' },
  { to:'/quiz', icon:Zap, label:'Quiz' },
  { to:'/notes', icon:BookOpen, label:'Notes' },
  { to:'/planner', icon:Calendar, label:'Planner' },
  { to:'/analytics', icon:BarChart2, label:'Analytics' },
  { to:'/leaderboard', icon:Trophy, label:'Leaderboard' },
  { to:'/settings', icon:Settings, label:'Settings' },
]

export default function Layout() {
  const location = useLocation()
  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col py-6 px-3 z-10 shrink-0">
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span className="font-black text-lg gradient-text">Ngoms AI</span>
            <p className="text-white/30 text-xs">Learn Smarter</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({to, icon:Icon, label}) => (
            <NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'nav-active':'nav-item'}>
              <Icon size={18} /><span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="card mt-4 p-4">
          <p className="text-xs text-white/40 mb-1">Daily Streak 🔥</p>
          <p className="text-2xl font-black gradient-text">7 days</p>
          <div className="flex gap-1 mt-2">
            {[...Array(7)].map((_,i) => (
              <div key={i} className="flex-1 h-1 rounded-full bg-gradient-to-r from-primary to-violet" />
            ))}
          </div>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div key={location.pathname} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
