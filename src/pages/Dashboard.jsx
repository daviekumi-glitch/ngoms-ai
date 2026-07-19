import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Upload, MessageCircle, Zap, Layers, TrendingUp, Book, Star, ChevronRight, Flame, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Dashboard() {
  const { banner, features, appSettings } = useApp()
  const nav = useNavigate()

  const quickActions = [
    { icon: Upload, label: 'Upload Doc', color: 'from-blue-500 to-primary', path: '/documents', featureKey: null },
    { icon: Zap, label: 'Start Quiz', color: 'from-violet to-purple-500', path: '/quiz', featureKey: 'quiz' },
    { icon: MessageCircle, label: 'AI Tutor', color: 'from-emerald-500 to-teal-500', path: '/chat', featureKey: 'ai_chat' },
    { icon: Layers, label: 'Flashcards', color: 'from-orange-500 to-amber-500', path: '/flashcards', featureKey: 'flashcards' },
  ]

  const stats = [
    { label: 'Study Hours', value: '24.5h', sub: 'This week', icon: Book, color: 'text-primary' },
    { label: 'Quiz Score', value: '87%', sub: 'Average', icon: Zap, color: 'text-violet' },
    { label: 'Cards Mastered', value: '142', sub: 'All time', icon: Layers, color: 'text-emerald-400' },
    { label: 'XP Points', value: '2,840', sub: 'This month', icon: Star, color: 'text-amber-400' },
  ]

  const isFeatureEnabled = (key) => {
    if (!key) return true
    const f = features?.find(ft => ft.key === key)
    return f ? f.enabled : true
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div className="mb-6" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <p className="text-white/40 text-sm mb-1">Good morning 👋</p>
        <h1 className="text-3xl font-black">Ready to <span className="gradient-text">learn smarter?</span></h1>
      </motion.div>

      {/* Admin-controlled Banner */}
      <AnimatePresence>
      {banner?.active && (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
          onClick={() => nav(banner.actionRoute || '/settings')}
          className={`bg-gradient-to-r ${banner.bgColor || 'from-primary to-violet'} rounded-3xl p-5 mb-6 cursor-pointer hover:scale-[1.01] transition-transform shadow-lg shadow-primary/20`}>
          <div className="flex items-center gap-4">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Sparkles size={24} className="text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base md:text-lg">{banner.title}</p>
              <p className="text-white/80 text-sm">{banner.subtitle}</p>
            </div>
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-white text-sm font-semibold whitespace-nowrap">{banner.actionText}</span>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="glass p-4 rounded-2xl">
            <s.icon size={20} className={s.color + ' mb-2'} />
            <p className="text-2xl md:text-3xl font-black">{s.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{s.label} · {s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wide">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {quickActions.filter(a => isFeatureEnabled(a.featureKey)).map((a, i) => (
          <motion.button key={a.label} whileTap={{scale:0.95}} onClick={() => nav(a.path)}
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="glass rounded-2xl p-3 flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg`}>
              <a.icon size={22} className="text-white" />
            </div>
            <span className="text-white/70 text-xs font-semibold">{a.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Streak card */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
        className="glass p-5 rounded-2xl mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-400" />
            <span className="text-white font-bold text-sm">Daily Streak</span>
          </div>
          <span className="text-2xl font-black gradient-text">7 days</span>
        </div>
        <div className="flex gap-1.5">
          {[...Array(7)].map((_, i) => (
            <motion.div key={i} initial={{scaleY:0}} animate={{scaleY:1}} transition={{delay:i*0.08}}
              className="flex-1 h-12 rounded-xl bg-gradient-to-t from-orange-500 to-amber-400 flex items-end justify-center pb-1">
              <span className="text-white/80 text-[10px] font-bold">{['M','T','W','T','F','S','S'][i]}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue Learning */}
      <h2 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wide">Continue Learning</h2>
      <div className="space-y-3">
        {[
          { title: 'Biology: Cellular Respiration', progress: 65, color: 'from-emerald-500 to-teal-500', icon: '🧬' },
          { title: 'Math: Calculus Basics', progress: 40, color: 'from-blue-500 to-primary', icon: '📐' },
        ].map((c, i) => (
          <motion.div key={c.title} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
            className="glass p-4 rounded-2xl flex items-center gap-4 hover:scale-[1.01] transition-transform cursor-pointer">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl`}>{c.icon}</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{c.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div initial={{width:0}} animate={{width:`${c.progress}%`}} transition={{delay:0.5,duration:0.8}}
                    className={`h-full rounded-full bg-gradient-to-r ${c.color}`} />
                </div>
                <span className="text-white/40 text-xs">{c.progress}%</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/30" />
          </motion.div>
        ))}
      </div>

      {/* Admin quick access */}
      <div className="mt-6">
        <button onClick={() => nav('/admin/login')}
          className="glass p-3 rounded-2xl w-full flex items-center gap-3 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Brain size={16} />
          </div>
          <span className="text-sm font-medium">Admin Panel</span>
          <ChevronRight size={16} className="ml-auto" />
        </button>
      </div>
    </div>
  )
}

import { AnimatePresence } from 'framer-motion'
