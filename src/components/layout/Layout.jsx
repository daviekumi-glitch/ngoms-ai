import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, MessageCircle, Bell, User, Settings, Brain
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
  const { appSettings, isFeatureEnabled } = useApp()

  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      {/* Desktop sidebar - fixed, no admin link */}
      <aside className="hidden md:flex w-60 glass border-r border-white/5 flex-col py-5 px-3 shrink-0">
        <div className="flex items-center gap-2.5 px-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shadow-lg shadow-primary/30">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <span className="font-black text-base gradient-text">{appSettings?.appName || 'Ngoms AI'}</span>
            <p className="text-white/30 text-[11px]">{appSettings?.tagline || 'Learn Smarter'}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {bottomItems.filter(b => isFeatureEnabled(b.featureKey)).map(({to, icon:Icon, label}) => (
            <NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'nav-active':'nav-item'}>
              <Icon size={18} /><span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content - scrollable area only */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav - fixed, native feel */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-800/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomItems.filter(b => isFeatureEnabled(b.featureKey)).map(({to, icon:Icon, label}) => (
            <NavLink key={to} to={to} end={to==='/'} className={({isActive})=>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors duration-200 ${isActive ? 'text-primary' : 'text-white/40'}`
            }>
              {({isActive}) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-colors duration-200 ${isActive ? 'bg-primary/20' : ''}`}>
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
