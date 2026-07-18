import { motion } from 'framer-motion'
import { Bell, BookOpen, Zap, Trophy, Star, Check, Trash2, Filter } from 'lucide-react'
import { useState } from 'react'

const allNotifs = [
  { id:1, type:'streak', icon:Star, color:'text-amber-400', bg:'bg-amber-400/10', title:'7-Day Streak! 🔥', body:'Amazing! You have studied 7 days in a row. Keep it up!', time:'2 min ago', read:false },
  { id:2, type:'quiz', icon:Zap, color:'text-violet', bg:'bg-violet/10', title:'Quiz Result', body:'You scored 91% on Biology Quiz. Great performance!', time:'1 hr ago', read:false },
  { id:3, type:'ai', icon:BookOpen, color:'text-primary', bg:'bg-primary/10', title:'AI Insight Ready', body:'Your weekly study analysis is ready. Check your Analytics.', time:'3 hrs ago', read:false },
  { id:4, type:'achievement', icon:Trophy, color:'text-emerald-400', bg:'bg-emerald-400/10', title:'Badge Earned 🏆', body:'You earned the "Quick Learner" badge for mastering 50 flashcards.', time:'Yesterday', read:true },
  { id:5, type:'streak', icon:Star, color:'text-amber-400', bg:'bg-amber-400/10', title:'Study Reminder', body:'You have not studied today. Your 6-day streak is at risk!', time:'Yesterday', read:true },
  { id:6, type:'quiz', icon:Zap, color:'text-violet', bg:'bg-violet/10', title:'New Quiz Available', body:'A new quiz has been generated from your Physics document.', time:'2 days ago', read:true },
  { id:7, type:'ai', icon:BookOpen, color:'text-primary', bg:'bg-primary/10', title:'Document Processed', body:'Your Chemistry notes have been summarised and indexed by AI.', time:'3 days ago', read:true },
]

export default function Notifications() {
  const [notifs, setNotifs] = useState(allNotifs)
  const [filter, setFilter] = useState('all')

  const markAll = () => setNotifs(n => n.map(x=>({...x,read:true})))
  const remove = (id) => setNotifs(n => n.filter(x=>x.id!==id))
  const markOne = (id) => setNotifs(n => n.map(x=>x.id===id?{...x,read:true}:x))

  const filters = ['all','unread','quiz','ai','streak','achievement']
  const visible = filter==='all' ? notifs : filter==='unread' ? notifs.filter(x=>!x.read) : notifs.filter(x=>x.type===filter)
  const unread = notifs.filter(x=>!x.read).length

  return (
    <div className="min-h-screen bg-navy-900 px-4 pt-6 pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div className="flex items-center justify-between mb-6" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          {unread>0 && <p className="text-primary text-sm mt-0.5">{unread} unread</p>}
        </div>
        <button onClick={markAll} className="text-xs text-primary font-semibold px-3 py-2 glass rounded-xl hover:bg-primary/10 transition-all">
          Mark all read
        </button>
      </motion.div>

      {/* Filter chips */}
      <motion.div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}>
        {filters.map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${filter===f ? 'bg-gradient-to-r from-primary to-violet text-white shadow-lg shadow-primary/30' : 'glass text-white/50 hover:text-white'}`}>
            {f}
          </button>
        ))}
      </motion.div>

      {/* Notification list */}
      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <motion.div className="flex flex-col items-center justify-center py-20 gap-4" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="text-6xl">🔔</div>
            <p className="text-white/40 text-sm">No notifications here</p>
          </motion.div>
        )}
        {visible.map((n, i) => (
          <motion.div key={n.id} className={`glass p-4 rounded-2xl flex gap-4 items-start cursor-pointer transition-all duration-200 ${!n.read ? 'border-primary/30 bg-primary/5' : 'hover:bg-white/5'}`}
            initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
            onClick={()=>markOne(n.id)}>
            <div className={`w-11 h-11 rounded-2xl ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <n.icon size={20} className={n.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`font-bold text-sm ${!n.read ? 'text-white' : 'text-white/70'}`}>{n.title}</p>
                <button onClick={e=>{e.stopPropagation();remove(n.id)}} className="text-white/20 hover:text-red-400 transition-colors shrink-0">
                  <Trash2 size={14}/>
                </button>
              </div>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">{n.body}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/30 text-xs">{n.time}</span>
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary"></span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
