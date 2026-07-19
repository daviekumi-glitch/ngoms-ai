import { Crown, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'

const badgeStyle = {
  Diamond: 'from-cyan-400 to-blue-500',
  Gold: 'from-yellow-400 to-amber-500',
  Silver: 'from-gray-300 to-gray-400',
  Bronze: 'from-orange-400 to-orange-600',
}

export default function Leaderboard() {
  const { leaderboard, isFeatureEnabled } = useApp()

  if (!isFeatureEnabled('leaderboard')) {
    return <div className="p-6 text-center text-white/40">Leaderboard is currently disabled by admin.</div>
  }

  const sorted = [...(leaderboard || [])].sort((a, b) => b.xp - a.xp)

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">Leaderboard</h1>
        <p className="text-white/40 text-sm mt-0.5">Top learners this season</p>
      </div>

      {/* Top 3 podium - fixed layout */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[sorted[1], sorted[0], sorted[2]].filter(Boolean).map((u, i) => {
          const place = i === 0 ? 2 : i === 1 ? 1 : 3
          return (
            <div key={u.id}
              className={`glass rounded-2xl p-3 text-center ${place === 1 ? 'scale-105 shadow-lg shadow-amber-500/20' : ''}`}>
              {place === 1 && <Crown size={18} className="text-amber-400 mx-auto mb-1" />}
              <div className="text-2xl mb-1.5">{u.avatar}</div>
              <p className="text-white font-bold text-xs truncate">{u.name}</p>
              <p className="text-white/50 text-[11px]">{(u.xp || 0).toLocaleString()} XP</p>
              <div className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${badgeStyle[u.badge] || 'from-white/10 to-white/5'} text-white`}>{u.badge}</div>
            </div>
          )
        })}
      </div>

      {/* Full list - no animation */}
      <div className="space-y-2">
        {sorted.map((u, i) => (
          <div key={u.id} className="glass p-3 rounded-2xl flex items-center gap-3">
            <span className={`text-base font-black w-7 text-center ${i < 3 ? 'gradient-text' : 'text-white/30'}`}>{i + 1}</span>
            <div className="text-xl">{u.avatar}</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{u.name}</p>
              <p className="text-white/40 text-xs">{(u.xp || 0).toLocaleString()} XP</p>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r ${badgeStyle[u.badge] || 'from-white/10 to-white/5'} text-white`}>{u.badge}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
