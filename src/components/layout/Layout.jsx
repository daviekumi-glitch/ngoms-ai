import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, MessageCircle, Bell, User, Settings,
  BookOpen, Layers, Zap, FileText, BarChart2, Trophy,
  Brain, ShieldCheck
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const mainNav = [
  { to: '/',           icon: LayoutDashboard, label: 'Home',      featureKey: null },
  { to: '/chat',       icon: MessageCircle,   label: 'AI Tutor',  featureKey: 'ai_chat' },
  { to: '/flashcards', icon: Layers,          label: 'Cards',     featureKey: 'flashcards' },
  { to: '/quiz',       icon: Zap,             label: 'Quiz',      featureKey: 'quiz' },
  { to: '/profile',   icon: User,            label: 'Profile',   featureKey: null },
]

const sideNav = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard',   featureKey: null },
  { to: '/chat',       icon: MessageCircle,   label: 'AI Tutor',    featureKey: 'ai_chat' },
  { to: '/flashcards', icon: Layers,          label: 'Flashcards',  featureKey: 'flashcards' },
  { to: '/quiz',       icon: Zap,             label: 'Quiz',        featureKey: 'quiz' },
  { to: '/notes',      icon: FileText,        label: 'Smart Notes', featureKey: 'notes' },
  { to: '/planner',    icon: BookOpen,        label: 'Study Plan',  featureKey: 'planner' },
  { to: '/analytics',  icon: BarChart2,       label: 'Analytics',   featureKey: 'analytics' },
  { to: '/leaderboard',icon: Trophy,          label: 'Leaderboard', featureKey: 'leaderboard' },
  { to: '/documents',  icon: FileText,        label: 'Documents',   featureKey: null },
  { to: '/notifications',icon: Bell,          label: 'Alerts',      featureKey: null },
  { to: '/profile',    icon: User,            label: 'Profile',     featureKey: null },
  { to: '/settings',   icon: Settings,        label: 'Settings',    featureKey: null },
]

export default function Layout() {
  const { appSettings, isFeatureEnabled, user, isAdmin } = useApp()

  return (
    <div className="flex h-screen bg-surface-soft overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-surface-border flex-col py-6 px-3 shrink-0 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center shadow-btn">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span className="font-black text-lg text-ink">{appSettings?.appName || 'Ngoms AI'}</span>
            <p className="text-ink-muted text-[11px]">{appSettings?.tagline || 'Learn Smarter'}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto scrollbar-hide">
          {sideNav.filter(b => isFeatureEnabled(b.featureKey)).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-brand text-white shadow-card font-semibold'
                  : 'text-ink-secondary hover:bg-surface-soft hover:text-ink'}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 mt-2
                ${isActive ? 'bg-amber-500 text-white' : 'text-amber-600 hover:bg-amber-50'}`
              }
            >
              <ShieldCheck size={17} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* User chip */}
        <div className="mt-4 flex items-center gap-3 px-3 py-3 rounded-2xl bg-surface-soft border border-surface-border">
          <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-brand font-bold text-sm shrink-0">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate">{user?.name || 'Learner'}</p>
            <p className="text-xs text-ink-muted">{user?.plan || 'Free'} Plan</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden tab-bar">
        <div className="flex items-end justify-around w-full px-2 pt-2">
          {mainNav.filter(b => isFeatureEnabled(b.featureKey)).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-2xl transition-all duration-200 ${isActive ? 'bg-brand text-white shadow-btn scale-110' : 'text-ink-muted'}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-brand' : 'text-ink-muted'}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
