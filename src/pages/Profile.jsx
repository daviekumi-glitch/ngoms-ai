import { Star, Zap, Trophy, Flame, ChevronRight, Award } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const { badges, leaderboard, appSettings } = useApp()

  const myRank = (leaderboard || []).find(u => u.name === 'Davie Kuminga')

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Profile header */}
      <div className="glass p-5 rounded-2xl mb-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-2xl font-black text-white">D</div>
        <div className="flex-1">
          <p className="text-white font-bold text-lg">Davie Kuminga</p>
          <p className="text-white/40 text-sm">daviekumi@gmail.com</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-semibold">Premium</span>
            {myRank && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-semibold">Rank #{myRank.rank}</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="glass p-3 rounded-2xl text-center">
          <Flame size={18} className="text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-black text-white">7</p>
          <p className="text-white/40 text-[11px]">Day Streak</p>
        </div>
        <div className="glass p-3 rounded-2xl text-center">
          <Zap size={18} className="text-violet mx-auto mb-1" />
          <p className="text-xl font-black text-white">{(myRank?.xp || 2840).toLocaleString()}</p>
          <p className="text-white/40 text-[11px]">XP Points</p>
        </div>
        <div className="glass p-3 rounded-2xl text-center">
          <Trophy size={18} className="text-amber-400 mx-auto mb-1" />
          <p className="text-xl font-black text-white">{(badges || []).filter(b => b.status === 'active').length}</p>
          <p className="text-white/40 text-[11px]">Badges</p>
        </div>
      </div>

      {/* Badges */}
      <p className="text-white/60 text-xs font-semibold mb-2.5 uppercase tracking-wide">Achievements</p>
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {(badges || []).map((b) => (
          <div key={b.id} className={`glass p-3.5 rounded-2xl ${b.status === 'inactive' ? 'opacity-40' : ''}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${b.color || 'from-primary to-violet'} flex items-center justify-center text-lg`}>
                {b.icon || '🏆'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-xs">{b.name}</p>
                <p className="text-white/40 text-[11px] truncate">{b.desc}</p>
              </div>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              <Award size={10} className="text-white/20" />
              <span className="text-white/30 text-[10px]">{b.earners || 0} earners</span>
            </div>
          </div>
        ))}
      </div>

      {/* App info */}
      <div className="text-center mt-6">
        <p className="text-white/30 text-xs">{appSettings?.appName || 'Ngoms AI'} v{appSettings?.version || '1.0.0'}</p>
        <p className="text-white/20 text-[11px] mt-0.5">{appSettings?.tagline}</p>
      </div>
    </div>
  )
}
