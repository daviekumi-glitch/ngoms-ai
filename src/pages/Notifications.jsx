import { Bell, Megaphone, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const iconMap = { info: Info, warning: AlertTriangle, success: CheckCircle, announcement: Megaphone }
const bgMap  = { info: 'bg-brand-soft', warning: 'bg-amber-50', success: 'bg-green-50', announcement: 'bg-violet-50' }
const clrMap = { info: 'text-brand', warning: 'text-warning', success: 'text-success', announcement: 'text-violet-500' }

export default function Notifications() {
  const { notifications, announcements } = useApp()

  const all = [
    ...(announcements || []).map(a => ({ ...a, _type: 'announcement', _date: a.createdAt })),
    ...(notifications || []).map(n => ({ ...n, _type: n.type || 'info', _date: n.createdAt })),
  ].sort((a, b) => (b._date || '').localeCompare(a._date || ''))

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Notifications</h1>
        <p className="text-sm text-ink-muted">{all.length} updates</p>
      </div>

      {all.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center mb-4">
            <Bell size={28} className="text-brand" />
          </div>
          <p className="font-bold text-ink">All caught up!</p>
          <p className="text-sm text-ink-muted mt-1">No notifications right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {all.map((n, i) => {
            const Icon = iconMap[n._type] || Bell
            const bg = bgMap[n._type] || 'bg-surface-soft'
            const clr = clrMap[n._type] || 'text-ink-secondary'
            return (
              <div key={n.id || i} className="bg-white rounded-2xl p-4 flex items-start gap-3 border border-surface-border shadow-card animate-slide-up">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={17} className={clr} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-ink">{n.title || n.name || 'Notification'}</p>
                  <p className="text-sm text-ink-muted mt-0.5 leading-relaxed">{n.message || n.body || n.subtitle || ''}</p>
                  {n._date && <p className="text-xs text-ink-faint mt-2">{new Date(n._date).toLocaleDateString()}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
