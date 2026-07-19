import { motion } from 'framer-motion'
import { Crown, ChevronUp, ChevronDown, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'

const badgeStyle = {
  Diamond: 'from-cyan-400 to-blue-500',
  Gold: 'from-yellow-400 to-amber-500',
  Silver: 'from-gray-300 to-gray-400',
  Bronze: 'from-orange-400 to-orange-600',
}

export default function Leaderboard() {
  const { leaderboard, features } = useApp()
  const featureEnabled = features?.find(f => f.key === 'leaderboard')
  if (featureEnabled && !featureEnabled.enabled) {
    return <div className="p-6 text-center text-white/40">Leaderboard is currently disabled by admin.</div>
  }
  const sorted = [...leaderboard].sort((a, b) => b.xp - a.xp)

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-6">
        <h1 className="text-2xl font-black text-white">Leaderboard</h1>
        <p className="text-white/40 text-sm mt-1">Top learners this season</p>
      </motion.div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[sorted[1], sorted[0], sorted[2]].filter(Boolean).map((u, i) => {
          const place = i === 0 ? 2 : i === 1 ? 1 : 3
          return (
            <motion.div key={u.id} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className={`glass rounded-2xl p-4 text-center ${place === 1 ? 'scale-110 shadow-lg shadow-amber-500/20' : ''}`}>
              {place === 1 && <Crown size={20} className="text-amber-400 mx-auto mb-1" />}
              <div className="text-3xl mb-2">{u.avatar}</div>
              <p className="text-white font-bold text-sm truncate">{u.name}</p>
              <p className="text-white/50 text-xs">{u.xp.toLocaleString()} XP</p>
              <div className={`mt-2 inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${badgeStyle[u.badge] || 'from-white/10 to-white/5'} text-white`}>{u.badge}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {sorted.map((u, i) => (
          <motion.div key={u.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
            className="glass p-3 rounded-2xl flex items-center gap-3">
            <span className={`text-lg font-black w-8 text-center ${i < 3 ? 'gradient-text' : 'text-white/30'}`}>{i + 1}</span>
            <div className="text-2xl">{u.avatar}</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{u.name}</p>
              <p className="text-white/40 text-xs">{u.xp.toLocaleString()} XP</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${badgeStyle[u.badge] || 'from-white/10 to-white/5'} text-white`}>{u.badge}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
