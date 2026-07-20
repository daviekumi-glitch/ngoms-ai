import { Star, Zap, Trophy, Flame, Award, ChevronRight, Edit2, Save } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { badges, leaderboard, appSettings, user, updateUser } = useApp()
  const nav = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')

  const myRank = (leaderboard || []).find(u => u.name === user?.name)

  const handleSave = () => {
    updateUser({ name, bio })
    setEditing(false)
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Profile header */}
      <div className="glass p-5 rounded-2xl mb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-2xl font-black text-white shrink-0">
            {(user?.name || '?')[0]}
          </div>
          <div className="flex-1">
            {editing ? (
              <input value={name} onChange={e => setName(e.target.value)} className="input-field text-sm" placeholder="Your name" />
            ) : (
              <p className="text-white font-bold text-lg">{user?.name || 'Student'}</p>
            )}
            <p className="text-white/40 text-sm">{user?.email || ''}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-semibold">{user?.plan || 'Free'}</span>
              {myRank && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-semibold">Rank #{myRank.rank}</span>}
            </div>
          </div>
          <button onClick={() => editing ? handleSave() : setEditing(true)}
            className="glass p-2.5 rounded-xl text-white/60 active:scale-90 transition-transform">
            {editing ? <Save size={16} className="text-primary" /> : <Edit2 size={16} />}
          </button>
        </div>
        {editing ? (
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} className="input-field resize-none text-sm" placeholder="Tell us about yourself..." />
        ) : (
          <p className="text-white/50 text-sm">{user?.bio || 'No bio yet'}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="glass p-3 rounded-2xl text-center">
          <Flame size={18} className="text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-black text-white">{user?.streak || 7}</p>
          <p className="text-white/40 text-[11px]">Day Streak</p>
        </div>
        <div className="glass p-3 rounded-2xl text-center">
          <Zap size={18} className="text-violet mx-auto mb-1" />
          <p className="text-xl font-black text-white">{(user?.xp || 2840).toLocaleString()}</p>
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
        {(badges || []).length === 0 ? (
          <p className="text-white/30 text-sm col-span-2 text-center py-4">No badges yet</p>
        ) : (badges || []).map((b) => (
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

      {/* Quick links */}
      <div className="space-y-2 mb-5">
        <button onClick={() => nav('/settings')} className="w-full glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform">
          <Star size={16} className="text-primary" />
          <span className="text-white/80 text-sm font-medium flex-1 text-left">Settings</span>
          <ChevronRight size={16} className="text-white/30" />
        </button>
      </div>

      {/* App info */}
      <div className="text-center">
        <p className="text-white/30 text-xs">{appSettings?.appName || 'Ngoms AI'} v{appSettings?.version || '1.0.0'}</p>
        <p className="text-white/20 text-[11px] mt-0.5">{appSettings?.tagline}</p>
      </div>
    </div>
  )
}
