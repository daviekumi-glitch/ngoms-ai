import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { Clock, Zap, Target, TrendingUp } from 'lucide-react'

const weeklyHours = [
  { day: 'Mon', hours: 2 }, { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 1.5 }, { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 3.5 }, { day: 'Sat', hours: 5 },
  { day: 'Sun', hours: 2.5 },
]

const quizScores = [
  { week: 'W1', score: 78 }, { week: 'W2', score: 82 },
  { week: 'W3', score: 85 }, { week: 'W4', score: 90 },
]

export default function Analytics() {
  const stats = [
    { label: 'Total Hours', value: '21.5h', icon: Clock, color: 'text-primary' },
    { label: 'Avg Score', value: '84%', icon: Target, color: 'text-violet' },
    { label: 'Quizzes', value: '12', icon: Zap, color: 'text-emerald-400' },
    { label: 'Trend', value: '+12%', icon: TrendingUp, color: 'text-amber-400' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-white/40 text-sm mt-0.5">Your learning progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="glass p-3.5 rounded-2xl">
            <s.icon size={18} className={s.color + ' mb-1.5'} />
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-white/40 text-[11px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly hours chart */}
      <div className="glass p-4 rounded-2xl mb-4">
        <p className="text-white font-semibold text-sm mb-3">Weekly Study Hours</p>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#ffffff40" fontSize={11} />
              <YAxis stroke="#ffffff40" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0A0F1E', border: '1px solid #ffffff20', borderRadius: 12 }} />
              <Bar dataKey="hours" fill="#3B82F6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quiz scores chart */}
      <div className="glass p-4 rounded-2xl">
        <p className="text-white font-semibold text-sm mb-3">Quiz Score Trend</p>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <LineChart data={quizScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="week" stroke="#ffffff40" fontSize={11} />
              <YAxis stroke="#ffffff40" fontSize={11} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: '#0A0F1E', border: '1px solid #ffffff20', borderRadius: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
