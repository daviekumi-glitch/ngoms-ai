import { useNavigate } from 'react-router-dom'
import {
  MessageCircle, Zap, Layers, FileText, BookOpen,
  Flame, Trophy, TrendingUp, Clock, ChevronRight,
  Sparkles, Bell, BarChart2, Star, Brain
} from 'lucide-react'
import { useApp } from '../context/AppContext'

function Skeleton() {
  return (
    <div className="p-5 max-w-2xl mx-auto">
      <div className="skeleton h-6 w-40 mb-1" /><div className="skeleton h-8 w-56 mb-6" />
      <div className="skeleton h-28 rounded-3xl mb-5" />
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
      </div>
      <div className="skeleton h-40 rounded-3xl" />
    </div>
  )
}

export default function Dashboard() {
  const { banner, appSettings, loading, isFeatureEnabled, courses, user, badges, quizzes, announcements } = useApp()
  const nav = useNavigate()

  if (loading) return <Skeleton />

  const greetHour = new Date().getHours()
  const greet = greetHour < 12 ? 'Good morning' : greetHour < 17 ? 'Good afternoon' : 'Good evening'

  const quickActions = [
    { icon: MessageCircle, label: 'AI Tutor', color: 'from-brand to-sky-400', path: '/chat', featureKey: 'ai_chat' },
    { icon: Zap, label: 'Quiz', color: 'from-amber-400 to-orange-400', path: '/quiz', featureKey: 'quiz' },
    { icon: Layers, label: 'Cards', color: 'from-violet-500 to-purple-400', path: '/flashcards', featureKey: 'flashcards' },
    { icon: FileText, label: 'Notes', color: 'from-emerald-400 to-green-400', path: '/notes', featureKey: 'notes' },
    { icon: BookOpen, label: 'Planner', color: 'from-rose-400 to-pink-400', path: '/planner', featureKey: 'planner' },
    { icon: BarChart2, label: 'Stats', color: 'from-sky-400 to-cyan-400', path: '/analytics', featureKey: 'analytics' },
  ]

  const stats = [
    { label: 'Streak', value: `${user?.streak || 0}d`, icon: Flame, bg: 'bg-orange-50', color: 'text-orange-500' },
    { label: 'XP', value: (user?.xp || 0).toLocaleString(), icon: Star, bg: 'bg-amber-50', color: 'text-amber-500' },
    { label: 'Courses', value: (courses || []).filter(c => c.status === 'Active').length, icon: BookOpen, bg: 'bg-brand-soft', color: 'text-brand' },
    { label: 'Rank', value: '#12', icon: Trophy, bg: 'bg-violet-50', color: 'text-violet-500' },
  ]

  const courseProgress = (c) => {
    const hash = (c.id || c.title || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)
    return 20 + (hash % 65)
  }

  const activeCourses = (courses || []).filter(c => c.status === 'Active' || c.status === 'active').slice(0, 4)
  const latestAnnouncement = (announcements || [])[0]

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">

      {/* Top bar with glass effect */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-ink-muted text-sm font-medium">{greet},</p>
          <h1 className="text-2xl font-black text-ink">{user?.name?.split(' ')[0] || 'Learner'} <span className="animate-float inline-block">👋</span></h1>
        </div>
        <button
          onClick={() => nav('/notifications')}
          className="relative w-11 h-11 rounded-2xl glass border border-surface-border flex items-center justify-center shadow-card hover:shadow-card-hover transition-all active:scale-95"
        >
          <Bell size={18} className="text-ink-secondary" />
          {(announcements || []).length > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand rounded-full border-2 border-white animate-pulse-glow" />
          )}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2.5 mb-5 stagger">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-3 flex flex-col items-center gap-1`}>
            <s.icon size={16} className={s.color} />
            <p className="text-base font-black text-ink">{s.value}</p>
            <p className="text-[10px] text-ink-muted font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Banner */}
      {banner?.active && (
        <div
          onClick={() => nav(banner.actionRoute || '/settings')}
          className="bg-gradient-to-r from-brand to-sky-500 rounded-3xl p-5 mb-5 cursor-pointer active:scale-[0.98] transition-transform shadow-btn relative overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full animate-pulse-glow" />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">{banner.title}</p>
              <p className="text-white/70 text-xs truncate">{banner.subtitle}</p>
            </div>
            {banner.actionText && (
              <span className="bg-white text-brand text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-sm">
                {banner.actionText}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Latest announcement */}
      {latestAnnouncement && (
        <div className="flex items-center gap-3 bg-white rounded-2xl p-4 mb-5 border border-surface-border shadow-card animate-slide-up">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Bell size={16} className="text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{latestAnnouncement.title}</p>
            <p className="text-xs text-ink-muted truncate">{latestAnnouncement.message || latestAnnouncement.body}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <p className="section-title mb-3">Quick Actions</p>
        <div className="grid grid-cols-3 gap-2.5 stagger">
          {quickActions.filter(a => isFeatureEnabled(a.featureKey)).map(a => (
            <button
              key={a.label}
              onClick={() => nav(a.path)}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-surface-border shadow-card active:scale-95 hover:shadow-card-hover transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${a.color} shadow-sm`}>
                <a.icon size={18} className="text-white" />
              </div>
              <span className="text-xs font-bold text-ink">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Courses */}
      {activeCourses.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">My Courses</p>
            <button onClick={() => nav('/documents')} className="text-brand text-xs font-bold flex items-center gap-1">
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-3 stagger">
            {activeCourses.map(c => {
              const prog = courseProgress(c)
              return (
                <div key={c.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card active:scale-[0.99] cursor-pointer hover:shadow-card-hover transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-brand-soft flex items-center justify-center text-2xl shrink-0">
                    {c.icon || '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{c.title}</p>
                    <p className="text-xs text-ink-muted mb-2">{c.category} · {c.lessons || 0} lessons</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand to-sky-400 rounded-full transition-all duration-500" style={{ width: `${prog}%` }} />
                      </div>
                      <span className="text-[10px] text-ink-muted font-semibold">{prog}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer branding */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center">
          <Brain size={12} className="text-white" />
        </div>
        <p className="text-xs text-ink-faint font-semibold">{appSettings?.appName || 'Ngoms AI'} v{appSettings?.version || '2.0.0'}</p>
      </div>
    </div>
  )
}
