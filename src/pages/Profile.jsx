import { motion } from 'framer-motion'
import { useState } from 'react'
import { Camera, Edit3, Star, Zap, BookOpen, Trophy, Flame, ChevronRight, Settings, Bell, LogOut } from 'lucide-react'

const badges = [
  { icon:'🎯', label:'Focused' }, { icon:'⚡', label:'Quiz Master' },
  { icon:'🔥', label:'On Fire' }, { icon:'📚', label:'Bookworm' },
  { icon:'🏆', label:'Champion' }, { icon:'🧠', label:'Genius' },
]

const stats = [
  { label:'Study Hrs', value:'124', icon:BookOpen, color:'text-primary' },
  { label:'Quizzes', value:'48', icon:Zap, color:'text-violet' },
  { label:'Streak', value:'7d', icon:Flame, color:'text-orange-400' },
  { label:'XP', value:'2.8K', icon:Star, color:'text-amber-400' },
]

const menuItems = [
  { icon:Edit3, label:'Edit Profile', sub:'Update your info and avatar' },
  { icon:Bell, label:'Notifications', sub:'Manage your alerts' },
  { icon:Trophy, label:'Achievements', sub:'View all your badges' },
  { icon:Settings, label:'Settings', sub:'App preferences and account' },
]

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('Davie Kumi')
  const [role, setRole] = useState('Student')
  const [bio, setBio] = useState('Passionate learner | Computer Science | University of Malawi')

  return (
    <div className="min-h-screen bg-navy-900 pb-24 md:pb-8">
      {/* Header gradient banner */}
      <div className="h-40 bg-gradient-to-br from-primary via-violet to-navy-700 relative">
        <div className="absolute inset-0 bg-black/20"/>
        <div className="absolute top-4 right-4">
          <button className="glass px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 text-white/80">
            <Edit3 size={12}/> Edit
          </button>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center border-4 border-navy-900 text-4xl font-black text-white shadow-xl shadow-primary/30">
              DK
            </div>
            <button className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-br from-primary to-violet rounded-xl flex items-center justify-center shadow-lg border-2 border-navy-900">
              <Camera size={15} className="text-white"/>
            </button>
          </div>
          <div className="flex gap-2 mb-2">
            <span className="badge bg-primary/20 text-primary border border-primary/30">Student</span>
            <span className="badge bg-violet/20 text-violet border border-violet/30">Pro</span>
          </div>
        </div>

        {/* Name & bio */}
        <div className="mb-5">
          {editing ? (
            <div className="flex flex-col gap-2">
              <input className="input-field text-xl font-black" value={name} onChange={e=>setName(e.target.value)}/>
              <input className="input-field text-sm" value={bio} onChange={e=>setBio(e.target.value)}/>
              <button onClick={()=>setEditing(false)} className="gradient-btn text-sm py-2">Save</button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-white">{name}</h2>
              <p className="text-white/50 text-sm mt-1">{bio}</p>
              <button onClick={()=>setEditing(true)} className="mt-2 text-primary text-xs font-semibold flex items-center gap-1">
                <Edit3 size={12}/> Edit profile
              </button>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {stats.map((s,i) => (
            <motion.div key={s.label} className="card text-center p-3" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
              <s.icon size={16} className={`${s.color} mx-auto mb-1`}/>
              <p className="text-lg font-black text-white">{s.value}</p>
              <p className="text-white/40 text-[10px]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <div className="card mb-5">
          <p className="text-sm font-bold text-white/70 mb-3">🏅 Badges Earned</p>
          <div className="grid grid-cols-6 gap-2">
            {badges.map((b,i) => (
              <motion.div key={b.label} className="flex flex-col items-center gap-1" initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.05, type:'spring'}}>
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xl hover:bg-white/10 transition-all cursor-pointer">{b.icon}</div>
                <span className="text-white/30 text-[9px]">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* XP Progress */}
        <div className="card mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-white/70">XP Progress</span>
            <span className="text-primary text-sm font-bold">2,840 / 5,000</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-violet rounded-full"
              initial={{width:0}} animate={{width:'57%'}} transition={{duration:1, ease:'easeOut'}}/>
          </div>
          <p className="text-white/30 text-xs mt-1">2,160 XP to reach Level 6</p>
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-2 mb-5">
          {menuItems.map((m,i) => (
            <motion.div key={m.label} className="glass-hover p-4 flex items-center gap-4 cursor-pointer rounded-2xl"
              initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.05}}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <m.icon size={18} className="text-primary"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{m.label}</p>
                <p className="text-xs text-white/40">{m.sub}</p>
              </div>
              <ChevronRight size={16} className="text-white/30"/>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full glass p-4 rounded-2xl flex items-center justify-center gap-2 text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={18}/><span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
