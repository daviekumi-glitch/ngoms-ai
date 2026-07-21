import { useState } from 'react'
import { Calendar, Plus, Clock, CheckCircle, Trash2, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

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

  const todaySessions = sessions.filter(s => s.date === today.toISOString().split('T')[0])
  const upcomingSessions = sessions.filter(s => s.date > today.toISOString().split('T')[0]).slice(0, 5)

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
