import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Bell, Lock, Palette, CreditCard, HelpCircle, LogOut, Globe, ChevronRight, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { plans, appSettings } = useApp()
  const nav = useNavigate()
  const [section, setSection] = useState('main')

  const settingsItems = [
    { id: 'account', icon: User, label: 'Account & Profile', color: 'from-blue-500 to-primary' },
    { id: 'notifications', icon: Bell, label: 'Notification Preferences', color: 'from-amber-500 to-orange-500' },
    { id: 'privacy', icon: Lock, label: 'Privacy & Security', color: 'from-red-500 to-rose-500' },
    { id: 'appearance', icon: Palette, label: 'Appearance & Theme', color: 'from-violet to-purple-500' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription & Billing', color: 'from-emerald-500 to-teal-500' },
    { id: 'language', icon: Globe, label: 'Language', color: 'from-cyan-500 to-blue-500' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', color: 'from-orange-500 to-amber-500' },
  ]

  if (section === 'subscription') {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setSection('main')} className="glass p-2 rounded-xl text-white/60 active:scale-90 transition-transform">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <h1 className="text-2xl font-black text-white">Subscription Plans</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {(plans || []).map((p) => (
            <div key={p.id} className={`glass rounded-2xl p-5 ${p.name === 'Premium' ? 'ring-2 ring-primary/40' : ''}`}>
              {p.name === 'Premium' && <span className="text-xs font-bold text-primary mb-2 block">RECOMMENDED</span>}
              <h3 className="text-white font-black text-lg">{p.name}</h3>
              <p className="text-2xl font-black gradient-text mt-1">{p.price}</p>
              <p className="text-white/30 text-xs">per {p.period}</p>
              <div className="mt-3 space-y-2">
                {(p.features || '').split(',').map((f, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-white/60 text-xs">{f.trim()}</span>
                  </div>
                ))}
              </div>
              <button className={`w-full mt-4 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform ${p.name === 'Premium' ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/60'}`}>
                {p.name === 'Free' ? 'Current Plan' : `Upgrade to ${p.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Manage your Ngoms AI experience</p>
      </div>

      {/* Profile card */}
      <div className="glass p-4 rounded-2xl mb-5 flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-xl font-black text-white">D</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Davie Kuminga</p>
          <p className="text-white/40 text-xs">daviekumi@gmail.com</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-semibold">Premium</span>
        </div>
      </div>

      {/* Settings items */}
      <div className="space-y-2">
        {settingsItems.map((item) => (
          <button key={item.id}
            onClick={() => setSection(item.id)}
            className="w-full glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
              <item.icon size={16} className="text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium flex-1 text-left">{item.label}</span>
            <ChevronRight size={16} className="text-white/30" />
          </button>
        ))}
      </div>

      {/* App info */}
      <div className="mt-5 text-center">
        <p className="text-white/30 text-xs">{appSettings?.appName || 'Ngoms AI'} v{appSettings?.version || '1.0.0'}</p>
        <p className="text-white/20 text-[11px] mt-0.5">{appSettings?.tagline}</p>
      </div>

      <button className="w-full mt-4 glass p-3.5 rounded-2xl flex items-center justify-center gap-2 text-red-400 active:scale-[0.98] transition-transform">
        <LogOut size={16} /> <span className="text-sm font-semibold">Sign Out</span>
      </button>
    </div>
  )
}
