import { useNavigate } from 'react-router-dom'
import { Upload, MessageCircle, Zap, Layers, Star, ChevronRight, Flame, Sparkles, TrendingUp, Award, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Dashboard() {
  const { banner, appSettings, loading, isFeatureEnabled, courses, user, badges, quizzes } = useApp()
  const nav = useNavigate()

  const quickActions = [
    { icon: Upload, label: 'Upload', color: 'from-blue-500 to-primary', path: '/documents', featureKey: null },
    { icon: Zap, label: 'Quiz', color: 'from-violet to-purple-500', path: '/quiz', featureKey: 'quiz' },
    { icon: MessageCircle, label: 'AI Tutor', color: 'from-emerald-500 to-teal-500', path: '/chat', featureKey: 'ai_chat' },
    { icon: Layers, label: 'Cards', color: 'from-orange-500 to-amber-500', path: '/flashcards', featureKey: 'flashcards' },
  ]

  const activeBadges = (badges || []).filter(b => b.status === 'active').length
  const activeQuizzes = (quizzes || []).filter(q => q.status === 'active').length
  const stats = [
    { label: 'Study Hours', value: '24.5h', sub: 'This week', icon: Clock, color: 'text-primary' },
    { label: 'Quiz Score', value: '87%', sub: 'Average', icon: Zap, color: 'text-violet' },
    { label: 'Cards Mastered', value: '142', sub: 'All time', icon: Layers, color: 'text-emerald-400' },
    { label: 'XP Points', value: (user?.xp || 2840).toLocaleString(), sub: 'This month', icon: Star, color: 'text-amber-400' },
  ]

  // Stable progress per course using course id hash
  const courseProgress = (c) => {
    const hash = (c.id || c.title || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)
    return 30 + (hash % 50)
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="h-8 w-48 rounded-xl bg-white/5 animate-pulse mb-6" />
        <div className="h-24 rounded-3xl bg-white/5 animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-5">
        <p className="text-white/40 text-sm mb-0.5">Good morning, {user?.name?.split(' ')[0] || 'there'}</p>
        <h1 className="text-2xl font-black text-white">Ready to <span className="gradient-text">learn smarter?</span></h1>
      </div>

      {banner?.active && (
        <div
          onClick={() => nav(banner.actionRoute || '/settings')}
          className={`bg-gradient-to-r ${banner.bgColor || 'from-primary to-violet'} rounded-2xl p-4 mb-5 cursor-pointer active:scale-[0.98] transition-transform shadow-lg shadow-primary/20`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">{banner.title}</p>
              <p className="text-white/70 text-xs truncate">{banner.subtitle}</p>
            </div>
            {banner.actionText && <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg text-white text-xs font-semibold whitespace-nowrap">{banner.actionText}</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="glass p-3.5 rounded-2xl">
            <s.icon size={18} className={s.color + ' mb-1.5'} />
            <p className="text-xl md:text-2xl font-black text-white">{s.value}</p>
            <p className="text-white/40 text-[11px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {quickActions.filter(a => isFeatureEnabled(a.featureKey)).map((a) => (
          <button key={a.label} onClick={() => nav(a.path)}
            className="glass rounded-2xl py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-md`}>
              <a.icon size={20} className="text-white" />
            </div>
            <span className="text-white/70 text-[11px] font-semibold">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="glass p-4 rounded-2xl mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-400" />
            <span className="text-white font-bold text-sm">Daily Streak</span>
          </div>
          <span className="text-xl font-black gradient-text">{user?.streak || 7} days</span>
        </div>
        <div className="flex gap-1.5">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} className={`flex-1 h-10 rounded-lg flex items-end justify-center pb-1 ${i < (user?.streak || 7) % 7 || (user?.streak || 7) >= 7 ? 'bg-gradient-to-t from-orange-500 to-amber-400' : 'bg-white/5'}`}>
              <span className={`text-[10px] font-bold ${i < (user?.streak || 7) % 7 || (user?.streak || 7) >= 7 ? 'text-white/80' : 'text-white/30'}`}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-4 rounded-2xl mb-5 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm mb-1">AI Insight</p>
            <p className="text-white/50 text-xs leading-relaxed">You have {activeQuizzes} quizzes available and {activeBadges} badges to unlock. Keep your {user?.streak || 7}-day streak going!</p>
          </div>
        </div>
      </div>

      {(courses || []).length > 0 && (
        <>
          <p className="text-white/60 text-xs font-semibold mb-2.5 uppercase tracking-wide">Continue Learning</p>
          <div className="space-y-2.5">
            {courses.slice(0, 4).map((c) => {
              const progress = courseProgress(c)
              return (
                <div key={c.id} onClick={() => nav('/documents')}
                  className="glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color || 'from-primary to-violet'} flex items-center justify-center text-xl shrink-0`}>
                    {c.icon || '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-violet" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-white/40 text-[11px]">{progress}%</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/30 shrink-0" />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
