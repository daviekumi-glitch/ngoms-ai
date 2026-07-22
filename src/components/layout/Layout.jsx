import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessageCircle, Bell, User, Settings,
  BookOpen, Layers, Zap, FileText, BarChart2, Trophy,
  Brain, ShieldCheck, NotebookPen, CalendarDays
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const BOTTOM_NAV = [
  { to: '/',           icon: LayoutDashboard, label: 'Home',    featureKey: null },
  { to: '/chat',       icon: MessageCircle,   label: 'Tutor',   featureKey: 'ai_chat' },
  { to: '/flashcards', icon: Layers,          label: 'Cards',   featureKey: 'flashcards' },
  { to: '/quiz',       icon: Zap,             label: 'Quiz',    featureKey: 'quiz' },
  { to: '/profile',    icon: User,            label: 'Profile', featureKey: null },
]

const SIDE_NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard',   featureKey: null },
  { to: '/chat',        icon: MessageCircle,   label: 'AI Tutor',    featureKey: 'ai_chat' },
  { to: '/flashcards',  icon: Layers,          label: 'Flashcards',  featureKey: 'flashcards' },
  { to: '/quiz',        icon: Zap,             label: 'Quiz Engine', featureKey: 'quiz' },
  { to: '/notes',       icon: NotebookPen,     label: 'Smart Notes', featureKey: 'notes' },
  { to: '/planner',     icon: CalendarDays,    label: 'Study Plan',  featureKey: 'planner' },
  { to: '/analytics',   icon: BarChart2,       label: 'Analytics',   featureKey: 'analytics' },
  { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard', featureKey: 'leaderboard' },
  { to: '/documents',   icon: FileText,        label: 'Documents',   featureKey: null },
  { to: '/notifications',icon: Bell,           label: 'Notifications',featureKey: null },
  { to: '/profile',     icon: User,            label: 'Profile',     featureKey: null },
  { to: '/settings',    icon: Settings,        label: 'Settings',    featureKey: null },
]

export default function Layout() {
  const { appSettings, isFeatureEnabled, user, isAdmin } = useApp()

  return (
    <div className="flex h-screen bg-surface-soft overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-surface-border flex-col py-6 px-3 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center shadow-btn">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <p className="font-black text-base text-ink leading-tight">{appSettings?.appName || 'Ngoms AI'}</p>
            <p className="text-ink-muted text-[11px] leading-tight">{appSettings?.tagline || 'Learn Smarter'}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto scrollbar-hide">
          {SIDE_NAV.filter(n => isFeatureEnabled(n.featureKey)).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand text-white font-semibold shadow-sm'
                    : 'text-ink-secondary hover:bg-surface-soft hover:text-ink'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 mt-3 border ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'text-amber-600 border-amber-200 hover:bg-amber-50'
                }`
              }
            >
              <ShieldCheck size={16} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* User chip */}
        <div className="mt-4 flex items-center gap-3 px-3 py-3 rounded-2xl bg-surface-soft border border-surface-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate">{user?.name || 'Learner'}</p>
            <p className="text-[11px] text-ink-muted">{user?.plan || 'Free'} Plan</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden tab-bar">
        <div className="flex items-end justify-around w-full px-1 pt-2 pb-1">
          {BOTTOM_NAV.filter(n => isFeatureEnabled(n.featureKey)).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex-1"
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center gap-0.5 py-1">
                  <div className={`p-2 rounded-2xl transition-all duration-200 ${
                    isActive ? 'bg-brand text-white shadow-btn scale-110' : 'text-ink-muted'
                  }`}>
                    <Icon size={19} />
                  </div>
                  <span className={`text-[10px] font-bold leading-none ${isActive ? 'text-brand' : 'text-ink-muted'}`}>
                    {label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  )
}
