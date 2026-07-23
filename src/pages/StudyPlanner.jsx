import { useState, useEffect, useRef } from 'react'
import { Calendar, Plus, Clock, CircleCheck as CheckCircle, Trash2, BookOpen, Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

/* ─── Pomodoro Focus Timer ─── */
function PomodoroTimer() {
  const MODES = {
    focus: { label: 'Focus', minutes: 25, color: 'from-brand to-sky-500', icon: Timer },
    short:  { label: 'Short Break', minutes: 5, color: 'from-emerald-400 to-green-500', icon: Coffee },
    long:   { label: 'Long Break', minutes: 15, color: 'from-violet-400 to-indigo-500', icon: Coffee },
  }

  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ngoms_pomodoro_count') || '0') } catch { return 0 }
  })
  const intervalRef = useRef(null)

  const total = MODES[mode].minutes * 60

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (mode === 'focus') {
              const next = sessions + 1
              setSessions(next)
              localStorage.setItem('ngoms_pomodoro_count', JSON.stringify(next))
              toast.success('Focus session complete! Take a break.')
            } else {
              toast.success('Break over — back to focus!')
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode, sessions])

  const switchMode = (m) => {
    setRunning(false)
    setMode(m)
    setSecondsLeft(MODES[m].minutes * 60)
  }

  const reset = () => {
    setRunning(false)
    setSecondsLeft(MODES[mode].minutes * 60)
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const pct = ((total - secondsLeft) / total) * 100
  const circumference = 2 * Math.PI * 54
  const dash = (pct / 100) * circumference

  return (
    <div className="card mb-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-ink flex items-center gap-2">
          <Timer size={16} className="text-brand" /> Focus Timer
        </p>
        <span className="chip text-[10px]">{sessions} sessions today</span>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1.5 bg-surface-muted rounded-xl p-1 mb-5">
        {Object.entries(MODES).map(([key, m]) => (
          <button key={key} onClick={() => switchMode(key)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === key ? 'bg-white shadow text-brand' : 'text-ink-muted hover:text-ink'
            }`}>{m.label}</button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface-border)" strokeWidth="6" />
            <circle
              cx="60" cy="60" r="54" fill="none" stroke="var(--brand)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-ink tabular-nums">{mm}:{ss}</span>
            <span className="text-[10px] text-ink-muted font-semibold uppercase tracking-wide">{MODES[mode].label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={reset} className="w-10 h-10 rounded-xl bg-surface-soft border border-surface-border flex items-center justify-center text-ink-muted active:scale-95 transition-all">
            <RotateCcw size={16} />
          </button>
          <button onClick={() => setRunning(r => !r)}
            className={`px-6 h-12 rounded-2xl bg-gradient-to-r ${MODES[mode].color} text-white font-bold text-sm flex items-center gap-2 shadow-btn active:scale-95 transition-all`}>
            {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function StudyPlanner() {
  const { courses } = useApp()
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ngoms_sessions') || '[]') } catch { return [] }
  })
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ subject: '', date: '', time: '', duration: '60', notes: '' })

  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - today.getDay() + i)
    return d
  })

  const save = () => {
    const ns = [...sessions, { ...form, id: Date.now(), completed: false }]
    setSessions(ns); localStorage.setItem('ngoms_sessions', JSON.stringify(ns))
    setForm({ subject: '', date: '', time: '', duration: '60', notes: '' }); setShowAdd(false)
  }

  const toggle = (id) => {
    const ns = sessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s)
    setSessions(ns); localStorage.setItem('ngoms_sessions', JSON.stringify(ns))
  }

  const remove = (id) => {
    const ns = sessions.filter(s => s.id !== id)
    setSessions(ns); localStorage.setItem('ngoms_sessions', JSON.stringify(ns))
  }

  const todayStr = today.toISOString().split('T')[0]
  const todaySessions = sessions.filter(s => s.date === todayStr)
  const upcomingSessions = sessions.filter(s => s.date > todayStr).slice(0, 5)

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-ink">Study Planner</h1>
          <p className="text-sm text-ink-muted">{sessions.filter(s => !s.completed).length} sessions pending</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="w-11 h-11 rounded-2xl bg-brand flex items-center justify-center shadow-btn active:scale-95">
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Pomodoro Timer */}
      <PomodoroTimer />

      {/* Week strip */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1">
        {weekDays.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString()
          const hasSess = sessions.some(s => s.date === d.toISOString().split('T')[0])
          return (
            <div key={i} className={`flex flex-col items-center px-3 py-2.5 rounded-2xl min-w-[52px] transition-all ${isToday ? 'bg-brand text-white shadow-btn' : 'bg-white border border-surface-border text-ink'}`}>
              <span className="text-[10px] font-semibold opacity-70">{DAYS[d.getDay()]}</span>
              <span className="text-base font-black mt-0.5">{d.getDate()}</span>
              {hasSess && <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? 'bg-white/60' : 'bg-brand'}`} />}
            </div>
          )
        })}
      </div>

      {/* Add session form */}
      {showAdd && (
        <div className="card mb-5 animate-slide-up">
          <p className="font-bold text-ink mb-3">Schedule Session</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-ink-muted mb-1 block">Subject</label>
              <input className="input" placeholder="e.g. Mathematics" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1 block">Date</label>
                <input type="date" className="input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1 block">Time</label>
                <input type="time" className="input" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-muted mb-1 block">Duration (minutes)</label>
              <select className="input" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                {[30,45,60,90,120].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={!form.subject || !form.date} className="btn-primary flex-1 py-3 text-sm">Save</button>
              <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1 py-3 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Today sessions */}
      <div className="mb-5">
        <p className="section-title mb-3">Today</p>
        {todaySessions.length === 0
          ? <div className="bg-white rounded-2xl p-4 border border-surface-border text-center text-sm text-ink-muted">No sessions scheduled today</div>
          : <div className="space-y-2">
              {todaySessions.map(s => (
                <div key={s.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card">
                  <button onClick={() => toggle(s.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${s.completed ? 'bg-success border-success' : 'border-ink-faint'}`}>
                    {s.completed && <CheckCircle size={14} className="text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${s.completed ? 'line-through text-ink-muted' : 'text-ink'}`}>{s.subject}</p>
                    <p className="text-xs text-ink-muted">{s.time} · {s.duration} min</p>
                  </div>
                  <button onClick={() => remove(s.id)} className="text-ink-faint hover:text-danger transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
        }
      </div>

      {/* Upcoming */}
      {upcomingSessions.length > 0 && (
        <div>
          <p className="section-title mb-3">Upcoming</p>
          <div className="space-y-2">
            {upcomingSessions.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card">
                <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-brand" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{s.subject}</p>
                  <p className="text-xs text-ink-muted">{new Date(s.date).toLocaleDateString()} · {s.time}</p>
                </div>
                <button onClick={() => remove(s.id)} className="text-ink-faint hover:text-danger transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
