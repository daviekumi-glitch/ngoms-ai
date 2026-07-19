import { Bell, BookOpen, AlertCircle, Zap, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'

const typeIcon = { course: BookOpen, system: AlertCircle, promo: Zap, update: Info, warning: AlertCircle }
const typeColor = { course: 'from-emerald-500 to-teal-500', system: 'from-blue-500 to-primary', promo: 'from-amber-500 to-orange-500', update: 'from-violet to-purple-500', warning: 'from-red-500 to-rose-500' }

export default function Notifications() {
  const { notifications, announcements } = useApp()
  const allNotifs = [
    ...(notifications || []),
    ...(announcements || []).map(a => ({ id: a.id, title: a.title, body: a.body, type: 'system', date: a.date, sent: 0, status: a.status })),
  ]

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">Notifications</h1>
        <p className="text-white/40 text-sm mt-0.5">Stay updated with Ngoms AI</p>
      </div>

      <div className="space-y-2.5">
        {allNotifs.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={48} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No notifications yet</p>
          </div>
        ) : allNotifs.map((n) => {
          const Icon = typeIcon[n.type] || Bell
          const color = typeColor[n.type] || 'from-primary to-violet'
          return (
            <div key={n.id}
              className="glass p-3.5 rounded-2xl flex items-start gap-3 active:scale-[0.98] transition-transform cursor-pointer">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-white font-semibold text-sm">{n.title}</p>
                  <span className="text-white/30 text-[11px] whitespace-nowrap">{n.date}</span>
                </div>
                <p className="text-white/50 text-xs mt-0.5">{n.body}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
