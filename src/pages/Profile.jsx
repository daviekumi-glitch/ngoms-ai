import { useState } from 'react'
import { Star, Flame, Edit3, Check, Trophy, BookOpen, Settings, ChevronRight, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, setUser, badges, isAdmin } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', email: user?.email || '' })
  const nav = useNavigate()

  const save = () => {
    if (!form.name.trim()) return
    setUser({ ...user, ...form })
    setEditing(false)
    toast.success('Profile updated!')
  }

  const activeBadges = (badges || []).filter(b => b.status === 'Active' || b.status === 'active').slice(0, 6)

  const menu = [
    { icon: Settings,   label: 'Settings',      sub: 'Preferences & app config', path: '/settings' },
    { icon: Trophy,     label: 'Leaderboard',   sub: 'See top learners',          path: '/leaderboard' },
    { icon: BookOpen,   label: 'My Documents',  sub: 'Uploaded study materials',  path: '/documents' },
    ...(isAdmin ? [{ icon: ShieldCheck, label: 'Admin Panel', sub: 'Manage platform content', path: '/admin' }] : []),
  ]

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-ink">Profile</h1>
        <button
          onClick={() => editing ? save() : setEditing(true)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all
            ${editing ? 'bg-brand text-white shadow-btn' : 'bg-surface-soft border border-surface-border text-ink-secondary'}`}
        >
          {editing ? <><Check size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
        </button>
      </div>

      {/* Profile card */}
      <div className="card mb-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-btn">
            {(user?.name || 'L')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2">
                <input className="input text-sm py-2" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="input text-sm py-2" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <textarea className="input text-sm py-2 resize-none" rows={2} placeholder="Short bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-black text-ink">{user?.name || 'Learner'}</h2>
                <p className="text-sm text-ink-muted">{user?.email || 'No email set'}</p>
                <p className="text-sm text-ink-secondary mt-1 leading-snug">{user?.bio || 'No bio yet. Tap Edit to add one.'}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="chip">{user?.plan || 'Free'} Plan</span>
                  <span className="chip">{user?.role || 'Student'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'XP Points', value: (user?.xp || 0).toLocaleString(), icon: Star,   color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Streak',    value: `${user?.streak || 0}d`,          icon: Flame,  color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Badges',    value: activeBadges.length,              icon: Trophy, color: 'text-violet-500', bg: 'bg-violet-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-3 flex flex-col items-center gap-1`}>
            <s.icon size={16} className={s.color} />
            <p className="text-lg font-black text-ink">{s.value}</p>
            <p className="text-[10px] text-ink-muted font-medium text-center">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      {activeBadges.length > 0 && (
        <div className="card mb-5">
          <p className="font-bold text-ink mb-3">Earned Badges</p>
          <div className="flex gap-2 flex-wrap">
            {activeBadges.map(b => (
              <div key={b.id} className="flex flex-col items-center gap-1 px-3 py-2.5 bg-surface-soft rounded-xl border border-surface-border">
                <span className="text-2xl">{b.icon || '🏅'}</span>
                <p className="text-[10px] font-semibold text-ink-secondary text-center max-w-[56px] truncate">{b.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="space-y-2">
        {menu.map(item => (
          <button
            key={item.label}
            onClick={() => nav(item.path)}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card active:scale-[0.99] hover:shadow-card-hover transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
              <item.icon size={17} className="text-brand" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-ink">{item.label}</p>
              <p className="text-xs text-ink-muted">{item.sub}</p>
            </div>
            <ChevronRight size={15} className="text-ink-faint" />
          </button>
        ))}
      </div>
    </div>
  )
}
