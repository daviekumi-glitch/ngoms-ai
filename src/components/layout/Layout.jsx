import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, MessageCircle, Bell, User,
  Settings, Brain, Shield, X
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const bottomItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home', featureKey: null },
  { to: '/chat', icon: MessageCircle, label: 'AI Tutor', featureKey: 'ai_chat' },
  { to: '/notifications', icon: Bell, label: 'Alerts', featureKey: null },
  { to: '/profile', icon: User, label: 'Profile', featureKey: null },
  { to: '/settings', icon: Settings, label: 'Settings', featureKey: null },
]

export default function Layout() {
  const location = useLocation()
  const nav = useNavigate()
  const { features, appSettings } = useApp()

  const isFeatureEnabled = (key) => {
    if (!key) return true
    const f = features?.find(ft => ft.key === key)
    return f ? f.enabled : true
  }

  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 glass border-r border-white/5 flex-col py-6 px-3 z-10 shrink-0">
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shadow-lg shadow-primary/30">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span className="font-black text-lg gradient-text">{appSettings?.appName || 'Ngoms AI'}</span>
            <p className="text-white/30 text-xs">{appSettings?.tagline || 'Learn Smarter'}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {bottomItems.filter(b => isFeatureEnabled(b.featureKey)).map(({to, icon:Icon, label}) => (
            <NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'nav-active':'nav-item'}>
              <Icon size={18} /><span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-3 flex flex-col gap-1">
          <NavLink to="/admin/login" className="nav-item text-red-400/60 hover:text-red-400">
            <Shield size={18} /><span className="text-sm font-medium">Admin</span>
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:pt-0">
        <motion.div key={location.pathname} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.25, ease:'easeOut'}}>
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-800/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around px-2 py-1.5">
          {bottomItems.filter(b => isFeatureEnabled(b.featureKey)).map(({to, icon:Icon, label}) => (
            <NavLink key={to} to={to} end={to==='/'} className={({isActive})=>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 ${isActive ? 'text-primary' : 'text-white/40'}`
            }>
              {({isActive}) => (
                <>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div layoutId="navPill" className="absolute -top-px h-1 w-10 rounded-full bg-gradient-to-r from-primary to-violet" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                    )}
                  </AnimatePresence>
                  <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/20' : ''}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-semibold">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
