import { motion } from 'framer-motion'
import { Brain, Upload, MessageCircle, Zap, Layers, TrendingUp, Book, Star, ChevronRight, Flame } from 'lucide-react'

const quickActions = [
  { icon:Upload, label:'Upload Doc', color:'from-blue-500 to-primary', path:'/documents' },
  { icon:Zap, label:'Start Quiz', color:'from-violet to-purple-500', path:'/quiz' },
  { icon:MessageCircle, label:'AI Tutor', color:'from-emerald-500 to-teal-500', path:'/chat' },
  { icon:Layers, label:'Flashcards', color:'from-orange-500 to-amber-500', path:'/flashcards' },
]
const stats = [
  { label:'Study Hours', value:'24.5h', sub:'This week', icon:Book, color:'text-primary' },
  { label:'Quiz Score', value:'87%', sub:'Average', icon:Zap, color:'text-violet' },
  { label:'Cards Mastered', value:'142', sub:'All time', icon:Layers, color:'text-emerald-400' },
  { label:'XP Points', value:'2,840', sub:'This month', icon:Star, color:'text-amber-400' },
]

export default function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div className="mb-8" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <p className="text-white/40 text-sm mb-1">Good morning 👋</p>
        <h1 className="text-3xl font-black">Ready to <span className="gradient-text">learn smarter?</span></h1>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s,i) => (
          <motion.div key={s.label} className="card" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
            <s.icon size={20} className={`${s.color} mb-3`} />
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div className="mb-6" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
        <h2 className="text-lg font-bold mb-3 text-white/80">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((a,i) => (
            <motion.div key={a.label} className="glass-hover p-5 flex flex-col items-center gap-3 cursor-pointer"
              whileHover={{scale:1.03}} whileTap={{scale:0.97}} transition={{delay:i*0.05}}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                <a.icon size={22} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white/80">{a.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Insight + Today plan */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div className="card border border-primary/20 box-glow" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.4}}>
          <div className="flex items-center gap-2 mb-3">
            <Brain size={18} className="text-primary" />
            <span className="text-sm font-bold text-primary">AI Insight</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            You've been most productive on <span className="text-primary font-semibold">Wednesday mornings</span>. 
            Try scheduling your hardest topics then. Your quiz accuracy improved 12% this week — keep it up! 🎯
          </p>
        </motion.div>
        <motion.div className="card" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4}}>
          <div className="flex items-center gap-2 mb-3">
            <Flame size={18} className="text-orange-400" />
            <span className="text-sm font-bold text-white/80">Today's Plan</span>
          </div>
          {['Review Chapter 4 — Physics','10 Flashcards — Biology','Practice Quiz — Math'].map((task,i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <span className="text-sm text-white/60">{task}</span>
              <ChevronRight size={14} className="ml-auto text-white/30" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
