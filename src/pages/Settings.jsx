import { useState, useEffect } from 'react'
import {
  Moon, Sun, Monitor, Bell, BellOff, Volume2, VolumeX,
  User, Download, Trash2, RefreshCw, Info, ChevronRight,
  Palette, Type, Globe, Target, Zap, Shield, Eye, EyeOff,
  Clock, Award, BarChart2, BookOpen, Check, X, Smartphone
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const SECTION = ({ title, children }) => (
  <div className="card mb-4">
    <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-4">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
)

const Row = ({ icon: Icon, label, desc, children, danger }) => (
  <div className={`flex items-center gap-3 py-3 px-1 rounded-xl transition-colors ${
    danger ? 'hover:bg-red-50' : 'hover:bg-surface-hover'
  }`}>
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
      danger ? 'bg-red-50' : 'bg-surface-muted'
    }`}>
      <Icon size={17} className={danger ? 'text-danger' : 'text-ink-muted'} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-semibold ${danger ? 'text-danger' : 'text-ink'}`}>{label}</p>
      {desc && <p className="text-xs text-ink-muted mt-0.5 truncate">{desc}</p>}
    </div>
    {children}
  </div>
)

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
      value ? 'bg-brand' : 'bg-surface-border'
    }`}>
    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
      value ? 'left-5' : 'left-0.5'
    }`} />
  </button>
)

const THEMES = ['light', 'dark', 'auto']
const FONT_SIZES = ['small', 'medium', 'large']
const LANGUAGES = ['English', 'Chichewa', 'French', 'Portuguese']
const AI_STYLES = ['Concise', 'Detailed', 'Bullet Points', 'Story Mode']
const XP_GOALS = [50, 100, 200, 500, 1000]

export default function Settings() {
  const { user, setUser } = useApp()

  // --- 15 Settings (all persisted in localStorage) ---
  const load = (key, def) => { try { const v = localStorage.getItem('s_' + key); return v !== null ? JSON.parse(v) : def } catch { return def } }
  const save = (key, val) => { try { localStorage.setItem('s_' + key, JSON.stringify(val)) } catch {} }

  // 1. Theme
  const [theme, setTheme] = useState(() => load('theme', 'light'))
  // 2. Font size
  const [fontSize, setFontSize] = useState(() => load('fontSize', 'medium'))
  // 3. Language
  const [language, setLanguage] = useState(() => load('language', 'English'))
  // 4. Notification sounds
  const [notifSound, setNotifSound] = useState(() => load('notifSound', true))
  // 5. Study reminder time
  const [reminderTime, setReminderTime] = useState(() => load('reminderTime', '18:00'))
  // 6. Reminders enabled
  const [remindersOn, setRemindersOn] = useState(() => load('remindersOn', false))
  // 7. Daily XP goal
  const [xpGoal, setXpGoal] = useState(() => load('xpGoal', 100))
  // 8. AI response style
  const [aiStyle, setAiStyle] = useState(() => load('aiStyle', 'Detailed'))
  // 9. Auto-save notes
  const [autoSave, setAutoSave] = useState(() => load('autoSave', true))
  // 10. Streak freeze
  const [streakFreeze, setStreakFreeze] = useState(() => load('streakFreeze', false))
  // 11. Leaderboard visibility
  const [leaderboardVisible, setLeaderboardVisible] = useState(() => load('lbVisible', true))
  // 12. Offline mode / data saver
  const [dataSaver, setDataSaver] = useState(() => load('dataSaver', false))
  // 13. Display name editing
  const [editingName, setEditingName] = useState(false)
  const [displayName, setDisplayName] = useState(user?.name || '')
  // 14. Avatar emoji
  const [avatar, setAvatar] = useState(() => load('avatar', '🎓'))
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  // 15. Version / Changelog modal
  const [showChangelog, setShowChangelog] = useState(false)

  const AVATARS = ['🎓','📚','🧠','⚡','🔥','🌟','💡','🎯','🚀','🦁','🐉','🦊','🎮','💎','🏆']

  // Apply theme to document
  useEffect(() => {
    save('theme', theme)
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else if (theme === 'light') document.documentElement.classList.remove('dark')
    else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      if (mq.matches) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Apply font size
  useEffect(() => {
    save('fontSize', fontSize)
    document.documentElement.style.fontSize = { small: '14px', medium: '16px', large: '18px' }[fontSize]
  }, [fontSize])

  const persistSetting = (setter, key) => (val) => { setter(val); save(key, val) }

  const handleSaveName = () => {
    if (!displayName.trim()) { toast.error('Name cannot be empty'); return }
    setUser({ ...user, name: displayName.trim() })
    setEditingName(false)
    toast.success('Display name updated!')
  }

  const handleExportData = () => {
    const data = {
      user, theme, fontSize, language, aiStyle, xpGoal,
      notifSound, remindersOn, reminderTime, autoSave, streakFreeze,
      leaderboardVisible, dataSaver, avatar,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'ngoms-ai-data.json'; a.click()
    toast.success('Data exported!')
  }

  const handleClearData = () => {
    if (!confirm('This will reset ALL your settings and progress. Are you sure?')) return
    localStorage.clear()
    toast.success('All data cleared. Restarting...')
    setTimeout(() => window.location.reload(), 1500)
  }

  const CHANGELOG = [
    { ver: '2.0.0', date: 'Jul 2026', notes: ['Complete UI redesign', '25+ new admin features', '15 new settings', 'APK build fixed'] },
    { ver: '1.5.0', date: 'Jun 2026', notes: ['AI Chat Tutor improvements', 'Leaderboard system', 'Badge awards'] },
    { ver: '1.0.0', date: 'May 2026', notes: ['Initial release', 'Core learning features', 'PWA support'] },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-black text-ink mb-1">Settings</h1>
      <p className="text-ink-muted text-sm mb-6">Customize your Ngoms AI experience</p>

      {/* ─── 1-3: Appearance ─── */}
      <SECTION title="Appearance">
        <Row icon={theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor}
          label="Theme" desc={`Currently: ${theme}`}>
          <div className="flex gap-1 bg-surface-muted rounded-xl p-1">
            {THEMES.map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  theme === t ? 'bg-white shadow text-brand' : 'text-ink-muted hover:text-ink'
                }`}>{t === 'auto' ? '⚙️' : t === 'dark' ? '🌙' : '☀️'} {t}
              </button>
            ))}
          </div>
        </Row>
        <Row icon={Type} label="Font Size" desc={`Currently: ${fontSize}`}>
          <div className="flex gap-1 bg-surface-muted rounded-xl p-1">
            {FONT_SIZES.map(f => (
              <button key={f} onClick={() => setFontSize(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  fontSize === f ? 'bg-white shadow text-brand' : 'text-ink-muted hover:text-ink'
                }`}>{f}
              </button>
            ))}
          </div>
        </Row>
        <Row icon={Globe} label="Language" desc="Interface language">
          <select value={language} onChange={e => { setLanguage(e.target.value); save('language', e.target.value) }}
            className="text-sm font-semibold text-brand bg-brand-soft border-0 rounded-xl px-3 py-1.5 outline-none">
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </Row>
      </SECTION>

      {/* ─── 4-6: Notifications ─── */}
      <SECTION title="Notifications">
        <Row icon={notifSound ? Volume2 : VolumeX}
          label="Notification Sounds" desc="Play sounds for alerts">
          <Toggle value={notifSound} onChange={persistSetting(setNotifSound, 'notifSound')} />
        </Row>
        <Row icon={Bell} label="Study Reminders" desc="Daily push reminders">
          <Toggle value={remindersOn} onChange={persistSetting(setRemindersOn, 'remindersOn')} />
        </Row>
        {remindersOn && (
          <Row icon={Clock} label="Reminder Time" desc="What time to remind you">
            <input type="time" value={reminderTime}
              onChange={e => { setReminderTime(e.target.value); save('reminderTime', e.target.value) }}
              className="text-sm font-bold text-brand bg-brand-soft border-0 rounded-xl px-3 py-1.5 outline-none" />
          </Row>
        )}
      </SECTION>

      {/* ─── 7-8: Study Goals ─── */}
      <SECTION title="Study Goals">
        <Row icon={Target} label="Daily XP Goal" desc={`Target: ${xpGoal} XP per day`}>
          <div className="flex gap-1">
            {XP_GOALS.map(g => (
              <button key={g} onClick={() => { setXpGoal(g); save('xpGoal', g) }}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  xpGoal === g ? 'bg-brand text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
                }`}>{g}
              </button>
            ))}
          </div>
        </Row>
        <Row icon={Zap} label="AI Response Style" desc={`Current: ${aiStyle}`}>
          <select value={aiStyle} onChange={e => { setAiStyle(e.target.value); save('aiStyle', e.target.value) }}
            className="text-sm font-semibold text-brand bg-brand-soft border-0 rounded-xl px-3 py-1.5 outline-none">
            {AI_STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Row>
      </SECTION>

      {/* ─── 9-11: Learning Behaviour ─── */}
      <SECTION title="Learning Behaviour">
        <Row icon={BookOpen} label="Auto-Save Notes" desc="Save notes automatically as you type">
          <Toggle value={autoSave} onChange={persistSetting(setAutoSave, 'autoSave')} />
        </Row>
        <Row icon={Shield} label="Streak Freeze" desc="Protect streak on missed days">
          <Toggle value={streakFreeze} onChange={persistSetting(setStreakFreeze, 'streakFreeze')} />
        </Row>
        <Row icon={leaderboardVisible ? Eye : EyeOff}
          label="Show Me on Leaderboard" desc="Appear in the public rankings">
          <Toggle value={leaderboardVisible} onChange={persistSetting(setLeaderboardVisible, 'lbVisible')} />
        </Row>
      </SECTION>

      {/* ─── 12: Data & Connectivity ─── */}
      <SECTION title="Data & Connectivity">
        <Row icon={Smartphone} label="Data Saver Mode" desc="Reduce data usage on mobile">
          <Toggle value={dataSaver} onChange={persistSetting(setDataSaver, 'dataSaver')} />
        </Row>
      </SECTION>

      {/* ─── 13-14: Profile ─── */}
      <SECTION title="Profile">
        <Row icon={User} label="Display Name" desc={user?.name || 'Not set'}>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                className="text-sm border border-surface-border rounded-xl px-3 py-1.5 w-28 outline-none focus:border-brand"
                autoFocus onKeyDown={e => e.key === 'Enter' && handleSaveName()} />
              <button onClick={handleSaveName} className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center"><Check size={13} className="text-green-600" /></button>
              <button onClick={() => setEditingName(false)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center"><X size={13} className="text-danger" /></button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="text-sm font-semibold text-brand bg-brand-soft px-3 py-1.5 rounded-xl">Edit</button>
          )}
        </Row>
        <Row icon={Award} label="Avatar Emoji" desc={`Current: ${avatar}`}>
          <button onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="text-2xl w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center hover:bg-surface-border transition-colors">
            {avatar}
          </button>
        </Row>
        {showAvatarPicker && (
          <div className="grid grid-cols-5 gap-2 p-3 bg-surface-muted rounded-2xl mt-1">
            {AVATARS.map(em => (
              <button key={em} onClick={() => { setAvatar(em); save('avatar', em); setShowAvatarPicker(false) }}
                className={`text-2xl p-2 rounded-xl transition-all ${
                  avatar === em ? 'bg-brand/20 ring-2 ring-brand' : 'hover:bg-surface-border'
                }`}>{em}</button>
            ))}
          </div>
        )}
        <Row icon={BarChart2} label="Account Plan" desc={user?.plan || 'Free'}>
          <span className={`text-xs font-black px-3 py-1.5 rounded-full ${
            user?.plan === 'Pro' ? 'bg-brand text-white' :
            user?.plan === 'Premium' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' :
            'bg-surface-muted text-ink-muted'
          }`}>{user?.plan || 'Free'}</span>
        </Row>
      </SECTION>

      {/* ─── 15: Data & App Info ─── */}
      <SECTION title="Data & App">
        <Row icon={Download} label="Export My Data" desc="Download all your data as JSON">
          <button onClick={handleExportData}
            className="text-sm font-semibold text-brand bg-brand-soft px-3 py-1.5 rounded-xl hover:bg-brand hover:text-white transition-colors">
            Export
          </button>
        </Row>
        <Row icon={Info} label="App Version" desc="Ngoms AI v2.0.0 — Jul 2026">
          <button onClick={() => setShowChangelog(true)}
            className="text-sm font-semibold text-ink-muted bg-surface-muted px-3 py-1.5 rounded-xl hover:bg-surface-border transition-colors">
            Changelog
          </button>
        </Row>
        <Row icon={Trash2} label="Clear All Data" desc="Reset app to factory defaults" danger>
          <button onClick={handleClearData}
            className="text-sm font-semibold text-danger bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors">
            Reset
          </button>
        </Row>
      </SECTION>

      {/* Changelog Modal */}
      {showChangelog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowChangelog(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-ink">Changelog</h2>
              <button onClick={() => setShowChangelog(false)} className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {CHANGELOG.map(v => (
                <div key={v.ver} className="border-l-2 border-brand pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-brand text-sm">v{v.ver}</span>
                    <span className="text-xs text-ink-muted">{v.date}</span>
                  </div>
                  <ul className="space-y-1">{v.notes.map(n => <li key={n} className="text-xs text-ink-muted flex items-start gap-1"><span className="text-brand mt-0.5">•</span>{n}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
