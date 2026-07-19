import { useState } from 'react'
import { Calendar, Plus, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react'

const events = [
  { id: 'e1', title: 'Biology Review', time: '09:00', duration: 60, color: 'from-emerald-500 to-teal-500', done: true },
  { id: 'e2', title: 'Math Practice', time: '14:00', duration: 90, color: 'from-blue-500 to-primary', done: false },
  { id: 'e3', title: 'English Essay', time: '16:30', duration: 45, color: 'from-violet to-purple-500', done: false },
]

export default function StudyPlanner() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const today = new Date()

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Study Planner</h1>
          <p className="text-white/40 text-sm mt-0.5">Your AI-generated schedule</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-violet text-white text-sm font-semibold active:scale-95 transition-transform">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Calendar */}
      <div className="glass p-4 rounded-2xl mb-5">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth(Math.max(0, month - 1))}
            className="glass p-1.5 rounded-lg text-white/60 active:scale-90 transition-transform">
            <ChevronLeft size={16} />
          </button>
          <p className="text-white font-semibold text-sm">{monthNames[month]} {year}</p>
          <button onClick={() => setMonth(Math.min(11, month + 1))}
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
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={'empty' + i} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            return (
              <div key={day}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                  isToday ? 'bg-gradient-to-br from-primary to-violet text-white' : 'text-white/50'
                }`}>
                {day}
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's schedule */}
      <p className="text-white/60 text-xs font-semibold mb-2.5 uppercase tracking-wide">Today's Schedule</p>
      <div className="space-y-2.5">
        {events.map((e) => (
          <div key={e.id} className="glass p-3.5 rounded-2xl flex items-center gap-3">
            <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${e.color}`} />
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              e.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
            }`}>
              {e.done && <Check size={12} className="text-white" />}
            </div>
            <div className="flex-1">
              <p className={`text-white font-semibold text-sm ${e.done ? 'line-through opacity-50' : ''}`}>{e.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={11} className="text-white/30" />
                <span className="text-white/40 text-xs">{e.time} · {e.duration}min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
