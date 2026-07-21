import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { TrendingUp, Flame, Star, Trophy, Clock, Target } from 'lucide-react'
import { useApp } from '../context/AppContext'

const weekData = [
  { day: 'Mon', hours: 1.5 }, { day: 'Tue', hours: 2.0 }, { day: 'Wed', hours: 0.5 },
  { day: 'Thu', hours: 3.0 }, { day: 'Fri', hours: 2.5 }, { day: 'Sat', hours: 1.0 }, { day: 'Sun', hours: 0.8 },
]

const progressData = [
  { week: 'W1', score: 62 }, { week: 'W2', score: 71 }, { week: 'W3', score: 68 },
  { week: 'W4', score: 79 }, { week: 'W5', score: 85 }, { week: 'W6', score: 87 },
]

export default function Analytics() {
  const { user, courses, quizzes } = useApp()

  const stats = [
    { label: 'Current Streak', value: `${user?.streak || 0}d`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Total XP', value: (user?.xp || 0).toLocaleString(), icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Study Hours', value: '24.5h', icon: Clock, color: 'text-brand', bg: 'bg-brand-soft' },
    { label: 'Avg Score', value: '87%', icon: Target, color: 'text-emerald-500', bg: 'bg-green-50' },
  ]

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Analytics</h1>
        <p className="text-sm text-ink-muted">Your learning progress at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-black text-ink">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly study hours */}
      <div className="card mb-5">
        <p className="font-bold text-ink mb-4">Study Hours This Week</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData} barSize={22}>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8A97B8' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #E2EAF4', borderRadius: 12, fontSize: 12 }}
              formatter={(v) => [`${v}h`, 'Hours']}
            />
            <Bar dataKey="hours" fill="#0F73F7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score trend */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-ink">Quiz Score Trend</p>
          <span className="chip-success text-xs">↑ 25% this month</span>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2EAF4" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8A97B8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#8A97B8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2EAF4', borderRadius: 12, fontSize: 12 }} formatter={v => [`${v}%`, 'Score']} />
            <Line type="monotone" dataKey="score" stroke="#0F73F7" strokeWidth={2.5} dot={{ fill: '#0F73F7', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subject breakdown */}
      <div className="card">
        <p className="font-bold text-ink mb-3">Subject Progress</p>
        <div className="space-y-3">
          {[
            { subject: 'Mathematics', pct: 78, color: 'bg-brand' },
            { subject: 'Biology', pct: 91, color: 'bg-emerald-400' },
            { subject: 'Computer Science', pct: 65, color: 'bg-violet-500' },
            { subject: 'English', pct: 82, color: 'bg-amber-400' },
          ].map(s => (
            <div key={s.subject}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-ink">{s.subject}</span>
                <span className="text-sm font-bold text-ink">{s.pct}%</span>
              </div>
              <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
