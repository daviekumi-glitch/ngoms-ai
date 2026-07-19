import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, Bell, Lock, Palette, CreditCard, HelpCircle, LogOut, Shield, Globe, ChevronRight, Check, Star, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { plans, appSettings, features } = useApp()
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
    { id: 'admin', icon: Shield, label: 'Admin Panel', color: 'from-red-500 to-violet', route: '/admin/login' },
  ]

  if (section === 'subscription') {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSection('main')} className="glass p-2 rounded-xl text-white/60 hover:text-white">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <h1 className="text-2xl font-black text-white">Subscription Plans</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p, i) => (
            <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className={`glass rounded-3xl p-6 ${p.name === 'Premium' ? 'ring-2 ring-primary/40 scale-105' : ''}`}>
              {p.name === 'Premium' && <span className="text-xs font-bold text-primary mb-2 block">RECOMMENDED</span>}
              <h3 className="text-white font-black text-lg">{p.name}</h3>
              <p className="text-2xl font-black gradient-text mt-1">{p.price}</p>
              <p className="text-white/30 text-xs">per {p.period}</p>
              <div className="mt-4 space-y-2">
                {p.features.split(',').map((f, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-white/60 text-xs">{f.trim()}</span>
                  </div>
                ))}
              </div>
              <motion.button whileTap={{scale:0.97}} className={`w-full mt-6 py-3 rounded-xl font-bold text-sm ${p.name === 'Premium' ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/60'}`}>
                {p.name === 'Free' ? 'Current Plan' : `Upgrade to ${p.name}`}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-6">
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your Ngoms AI experience</p>
      </motion.div>

      {/* Profile card */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        className="glass p-5 rounded-2xl mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-2xl font-black text-white">D</div>
        <div className="flex-1">
          <p className="text-white font-bold">Davie Kuminga</p>
          <p className="text-white/40 text-sm">daviekumi@gmail.com</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">Premium</span>
        </div>
      </motion.div>

      {/* Settings items */}
      <div className="space-y-2">
        {settingsItems.map((item, i) => (
          <motion.button key={item.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
            onClick={() => item.route ? nav(item.route) : setSection(item.id)}
            className="w-full glass p-4 rounded-2xl flex items-center gap-3 hover:scale-[1.01] transition-transform">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
              <item.icon size={18} className="text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium flex-1 text-left">{item.label}</span>
            <ChevronRight size={18} className="text-white/30" />
          </motion.button>
        ))}
      </div>

      {/* App info */}
      <div className="mt-6 text-center">
        <p className="text-white/30 text-xs">{appSettings?.appName || 'Ngoms AI'} v{appSettings?.version || '1.0.0'}</p>
        <p className="text-white/20 text-xs mt-1">{appSettings?.tagline}</p>
      </div>

      <motion.button whileTap={{scale:0.97}} className="w-full mt-4 glass p-4 rounded-2xl flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-all">
        <LogOut size={18} /> <span className="text-sm font-semibold">Sign Out</span>
      </motion.button>
    </div>
  )
}
