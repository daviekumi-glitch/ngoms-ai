import { useState, useEffect } from 'react'
import { Bell, BookOpen, AlertCircle, Zap, Info, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

const typeIcon = { course: BookOpen, system: AlertCircle, promo: Zap, update: Info, warning: AlertCircle }
const typeColor = { course: 'from-emerald-500 to-teal-500', system: 'from-blue-500 to-primary', promo: 'from-amber-500 to-orange-500', update: 'from-violet to-purple-500', warning: 'from-red-500 to-rose-500' }

export default function Notifications() {
  const { notifications, announcements } = useApp()
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('ngoms_read_notifs')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('ngoms_read_notifs', JSON.stringify(readIds))
  }, [readIds])

  const allNotifs = [
    ...(announcements || []).filter(a => a.status === 'active').map(a => ({ id: a.id, title: a.title, body: a.body, type: 'system', date: a.date, priority: a.priority })),
    ...(notifications || []).map(n => ({ id: n.id, title: n.title, body: n.body, type: n.type, date: n.date })),
  ]

  const markRead = (id) => {
    if (!readIds.includes(id)) setReadIds([...readIds, id])
  }

  const markAllRead = () => {
    setReadIds(allNotifs.map(n => n.id))
  }

  const unreadCount = allNotifs.filter(n => !readIds.includes(n.id)).length

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          <p className="text-white/40 text-sm mt-0.5">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="glass px-3 py-2 rounded-xl text-white/60 text-xs font-semibold active:scale-95 transition-transform flex items-center gap-1.5">
            <Check size={14} /> Mark all read
          </button>
        )}
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
          const isRead = readIds.includes(n.id)
          return (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`glass p-3.5 rounded-2xl flex items-start gap-3 active:scale-[0.98] transition-transform cursor-pointer ${isRead ? 'opacity-60' : ''}`}>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 ${!isRead ? 'shadow-lg' : ''}`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-white font-semibold text-sm">{n.title}</p>
                  <div className="flex items-center gap-1.5">
                    {!isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
                    <span className="text-white/30 text-[11px] whitespace-nowrap">{n.date}</span>
                  </div>
                </div>
                {n.body && <p className="text-white/50 text-xs mt-0.5">{n.body}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
