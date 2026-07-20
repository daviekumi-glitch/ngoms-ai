import { useState } from 'react'
import { Calendar, Plus, Clock, ChevronLeft, ChevronRight, Check, X, Trash2 } from 'lucide-react'

function loadEvents() {
  const saved = localStorage.getItem('ngoms_planner')
  return saved ? JSON.parse(saved) : [
    { id: 'e1', title: 'Biology Review', time: '09:00', duration: 60, color: 'from-emerald-500 to-teal-500', done: true },
    { id: 'e2', title: 'Math Practice', time: '14:00', duration: 90, color: 'from-blue-500 to-primary', done: false },
    { id: 'e3', title: 'English Essay', time: '16:30', duration: 45, color: 'from-violet to-purple-500', done: false },
  ]
}

const colors = [
  { id: 'emerald', val: 'from-emerald-500 to-teal-500' },
  { id: 'blue', val: 'from-blue-500 to-primary' },
  { id: 'violet', val: 'from-violet to-purple-500' },
  { id: 'amber', val: 'from-amber-500 to-orange-500' },
  { id: 'rose', val: 'from-rose-500 to-pink-500' },
]

export default function StudyPlanner() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [events, setEvents] = useState(loadEvents)
  const [showAdd, setShowAdd] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', time: '09:00', duration: 60, color: 'from-blue-500 to-primary' })
  const today = new Date()

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const saveEvents = (newEvents) => {
    setEvents(newEvents)
    localStorage.setItem('ngoms_planner', JSON.stringify(newEvents))
  }

  const toggleDone = (id) => {
    saveEvents(events.map(e => e.id === id ? { ...e, done: !e.done } : e))
  }

  const deleteEvent = (id) => {
    saveEvents(events.filter(e => e.id !== id))
  }

  const addEvent = () => {
    if (!newEvent.title.trim()) return
    saveEvents([...events, { id: `e${Date.now()}`, ...newEvent, done: false }])
    setNewEvent({ title: '', time: '09:00', duration: 60, color: 'from-blue-500 to-primary' })
    setShowAdd(false)
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Study Planner</h1>
          <p className="text-white/40 text-sm mt-0.5">Your study schedule</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-violet text-white text-sm font-semibold active:scale-95 transition-transform">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Calendar */}
      <div className="glass p-4 rounded-2xl mb-5">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(year - 1) } else setMonth(month - 1) }}
            className="glass p-1.5 rounded-lg text-white/60 active:scale-90 transition-transform">
            <ChevronLeft size={16} />
          </button>
          <p className="text-white font-semibold text-sm">{monthNames[month]} {year}</p>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(year + 1) } else setMonth(month + 1) }}
            className="glass p-1.5 rounded-lg text-white/60 active:scale-90 transition-transform">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-center text-white/30 text-[11px] font-bold py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }, (_, i) => <div key={'empty' + i} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            return (
              <div key={day}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                  isToday ? 'bg-gradient-to-br from-primary to-violet text-white' : 'text-white/50 hover:bg-white/5'
                }`}>
                {day}
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's schedule */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Today's Schedule</p>
        <span className="text-white/30 text-xs">{events.filter(e => e.done).length}/{events.length} done</span>
      </div>
      <div className="space-y-2.5">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={40} className="text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-sm">No study sessions scheduled</p>
          </div>
        ) : events.map((e) => (
          <div key={e.id} className="glass p-3.5 rounded-2xl flex items-center gap-3">
            <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${e.color}`} />
            <button onClick={() => toggleDone(e.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                e.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-primary/50'
              }`}>
              {e.done && <Check size={12} className="text-white" />}
            </button>
            <div className="flex-1">
              <p className={`text-white font-semibold text-sm ${e.done ? 'line-through opacity-50' : ''}`}>{e.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={11} className="text-white/30" />
                <span className="text-white/40 text-xs">{e.time} · {e.duration}min</span>
              </div>
            </div>
            <button onClick={() => deleteEvent(e.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/40 hover:text-red-400 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setShowAdd(false)}>
          <div className="glass rounded-2xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Add Study Session</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Title</label>
                <input value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Chemistry Review" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Time</label>
                  <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Duration (min)</label>
                  <input type="number" value={newEvent.duration} onChange={e => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) || 60 })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Color</label>
                <div className="flex gap-2">
                  {colors.map(c => (
                    <button key={c.id} onClick={() => setNewEvent({ ...newEvent, color: c.val })}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.val} ${newEvent.color === c.val ? 'ring-2 ring-white/40' : ''}`} />
                  ))}
                </div>
              </div>
              <button onClick={addEvent} disabled={!newEvent.title.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm active:scale-95 transition-transform disabled:opacity-50">
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
