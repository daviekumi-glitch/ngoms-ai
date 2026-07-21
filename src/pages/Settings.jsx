import { Moon, Sun, Bell, Shield, Info, ChevronRight, Globe, Palette } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

export default function Settings() {
  const { appSettings, user } = useApp()
  const [notifs, setNotifs] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const sections = [
    {
      title: 'Appearance',
      items: [
        { icon: Sun, label: 'Theme', sub: darkMode ? 'Dark' : 'Light', action: () => setDarkMode(d => !d), toggle: darkMode, showToggle: true },
        { icon: Palette, label: 'Primary Color', sub: appSettings?.primaryColor || '#0F73F7', action: null },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Push Notifications', sub: 'Study reminders & updates', action: () => setNotifs(n => !n), toggle: notifs, showToggle: true },
      ]
    },
    {
      title: 'App Info',
      items: [
        { icon: Globe, label: 'Support Email', sub: appSettings?.supportEmail || 'support@ngoms.ai', action: null },
        { icon: Info, label: 'Version', sub: `v${appSettings?.version || '1.0.0'}`, action: null },
        { icon: Shield, label: 'Privacy Policy', sub: 'Read our privacy terms', action: null },
      ]
    }
  ]

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Settings</h1>
        <p className="text-sm text-ink-muted">Customize your Ngoms AI experience</p>
      </div>

      <div className="space-y-5">
        {sections.map(sec => (
          <div key={sec.title}>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2 px-1">{sec.title}</p>
            <div className="bg-white rounded-2xl overflow-hidden border border-surface-border shadow-card divide-y divide-surface-border">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={item.action || undefined}
                  className={`flex items-center gap-3 px-4 py-3.5 ${item.action ? 'cursor-pointer active:bg-surface-soft' : ''} transition-colors`}
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{item.label}</p>
                    <p className="text-xs text-ink-muted">{item.sub}</p>
                  </div>
                  {item.showToggle ? (
                    <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${item.toggle ? 'bg-brand' : 'bg-surface-border'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${item.toggle ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  ) : item.action ? (
                    <ChevronRight size={15} className="text-ink-faint" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
