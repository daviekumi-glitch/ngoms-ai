import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Bell, Lock, Palette, CreditCard, HelpCircle, LogOut, Globe,
  ChevronRight, ChevronLeft, Check, Moon, Sun, Volume2, Mail, MessageSquare,
  Smartphone, Wifi, Star, ToggleLeft, Save, Shield
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { plans, appSettings, signOut, user, updateUser } = useApp()
  const nav = useNavigate()
  const [section, setSection] = useState('main')

  const settingsItems = [
    { id: 'account', icon: User, label: 'Account & Profile', color: 'from-blue-500 to-primary' },
    { id: 'notifications', icon: Bell, label: 'Notification Preferences', color: 'from-amber-500 to-orange-500' },
    { id: 'privacy', icon: Lock, label: 'Privacy & Security', color: 'from-red-500 to-rose-500' },
    { id: 'appearance', icon: Palette, label: 'Appearance & Theme', color: 'from-violet to-purple-500' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription & Billing', color: 'from-emerald-500 to-teal-500' },
    { id: 'language', icon: Globe, label: 'Language & Region', color: 'from-cyan-500 to-blue-500' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', color: 'from-orange-500 to-amber-500' },
  ]

  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('ngoms_prefs')
    return saved ? JSON.parse(saved) : {
      notifPush: true, notifEmail: true, notifCourse: true, notifPromo: false,
      darkMode: true, reduceMotion: false, soundEffects: true, fontSize: 'medium',
      language: 'en', region: 'mw', autoDownload: false, dataSaver: true,
    }
  })

  const updatePref = (key, val) => {
    const newPrefs = { ...prefs, [key]: val }
    setPrefs(newPrefs)
    localStorage.setItem('ngoms_prefs', JSON.stringify(newPrefs))
  }

  const renderSection = () => {
    switch (section) {
      case 'subscription': return <SubscriptionSection plans={plans} goBack={() => setSection('main')} user={user} />
      case 'account': return <AccountSection goBack={() => setSection('main')} />
      case 'notifications': return <NotificationsSection prefs={prefs} updatePref={updatePref} goBack={() => setSection('main')} />
      case 'privacy': return <PrivacySection prefs={prefs} updatePref={updatePref} goBack={() => setSection('main')} />
      case 'appearance': return <AppearanceSection prefs={prefs} updatePref={updatePref} goBack={() => setSection('main')} />
      case 'language': return <LanguageSection prefs={prefs} updatePref={updatePref} goBack={() => setSection('main')} />
      case 'help': return <HelpSection goBack={() => setSection('main')} appSettings={appSettings} />
      default: return null
    }
  }

  const subView = renderSection()
  if (subView) return subView

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Manage your Ngoms AI experience</p>
      </div>

      <div className="glass p-4 rounded-2xl mb-5 flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-xl font-black text-white">
          {(user?.name || '?')[0]}
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{user?.name || 'Student'}</p>
          <p className="text-white/40 text-xs">{user?.email || ''}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-semibold">{user?.plan || 'Free'}</span>
        </div>
      </div>

      <div className="space-y-2">
        {settingsItems.map((item) => (
          <button key={item.id} onClick={() => setSection(item.id)}
            className="w-full glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
              <item.icon size={16} className="text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium flex-1 text-left">{item.label}</span>
            <ChevronRight size={16} className="text-white/30" />
          </button>
        ))}
      </div>

      <div className="mt-5 text-center">
        <p className="text-white/30 text-xs">{appSettings?.appName || 'Ngoms AI'} v{appSettings?.version || '1.0.0'}</p>
        <p className="text-white/20 text-[11px] mt-0.5">{appSettings?.tagline}</p>
      </div>

      <button onClick={() => { signOut(); nav('/onboarding') }}
        className="w-full mt-4 glass p-3.5 rounded-2xl flex items-center justify-center gap-2 text-red-400 active:scale-[0.98] transition-transform">
        <LogOut size={16} /> <span className="text-sm font-semibold">Sign Out</span>
      </button>
    </div>
  )
}

function AccountSection({ goBack }) {
  const { user, updateUser } = useApp()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [editing, setEditing] = useState(false)

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Header title="Account & Profile" onBack={goBack} />
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-4xl font-black text-white mb-3">
          {(name || '?')[0]}
        </div>
        {editing ? (
          <input value={name} onChange={e => setName(e.target.value)} className="input-field text-center max-w-xs" />
        ) : (
          <p className="text-white font-bold">{name}</p>
        )}
        <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">{user?.plan || 'Free'} Member</span>
      </div>
      <div className="glass p-5 rounded-2xl space-y-4">
        {[
          { icon: User, label: 'Full Name', val: name, set: setName, type: 'text' },
          { icon: Mail, label: 'Email Address', val: email, set: setEmail, type: 'email' },
          { icon: Smartphone, label: 'Phone Number', val: phone, set: setPhone, type: 'tel' },
        ].map(f => (
          <div key={f.label}>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase tracking-wide">{f.label}</label>
            <div className="relative">
              <f.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} disabled={!editing}
                className={`input-field pl-10 ${!editing ? 'opacity-60' : ''}`} />
            </div>
          </div>
        ))}
        <div>
          <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase tracking-wide">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} disabled={!editing} rows={2}
            className={`input-field resize-none ${!editing ? 'opacity-60' : ''}`} />
        </div>
      </div>
      <button onClick={() => { if (editing) { updateUser({ name, email, phone, bio }) }; setEditing(!editing) }}
        className={`w-full mt-4 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          editing ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/70'
        }`}>
        {editing ? <><Save size={16} /> Save Changes</> : 'Edit Profile'}
      </button>
    </div>
  )
}

function NotificationsSection({ prefs, updatePref, goBack }) {
  const items = [
    { key: 'notifPush', icon: Bell, label: 'Push Notifications', desc: 'Receive alerts on your device' },
    { key: 'notifEmail', icon: Mail, label: 'Email Notifications', desc: 'Get updates via email' },
    { key: 'notifCourse', icon: MessageSquare, label: 'Course Updates', desc: 'New lessons and quiz alerts' },
    { key: 'notifPromo', icon: Star, label: 'Promotional Offers', desc: 'Discounts and special deals' },
  ]
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Header title="Notification Preferences" onBack={goBack} />
      <div className="space-y-2">
        {items.map(item => (
          <ToggleCard key={item.key} icon={item.icon} label={item.label} desc={item.desc}
            value={prefs[item.key]} onChange={v => updatePref(item.key, v)} />
        ))}
      </div>
      <div className="glass p-4 rounded-2xl mt-4">
        <p className="text-white/40 text-xs flex items-center gap-2">
          <Volume2 size={14} /> Sound effects are {prefs.soundEffects ? 'enabled' : 'disabled'}. Change in Appearance settings.
        </p>
      </div>
    </div>
  )
}

function PrivacySection({ prefs, updatePref, goBack }) {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Header title="Privacy & Security" onBack={goBack} />
      <div className="space-y-2">
        <ToggleCard icon={Wifi} label="Auto-Download Content" desc="Download course materials automatically" value={prefs.autoDownload} onChange={v => updatePref('autoDownload', v)} />
        <ToggleCard icon={Volume2} label="Data Saver Mode" desc="Reduce data usage by compressing media" value={prefs.dataSaver} onChange={v => updatePref('dataSaver', v)} />
      </div>
      <div className="glass p-5 rounded-2xl mt-4">
        <h3 className="text-white font-bold text-sm mb-3">Security</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
            <Lock size={18} className="text-primary" />
            <span className="text-white/80 text-sm font-medium flex-1 text-left">Change Password</span>
            <ChevronRight size={16} className="text-white/30" />
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
            <Shield size={18} className="text-primary" />
            <span className="text-white/80 text-sm font-medium flex-1 text-left">Two-Factor Authentication</span>
            <span className="text-xs text-green-400 font-semibold">Enabled</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
            <Smartphone size={18} className="text-primary" />
            <span className="text-white/80 text-sm font-medium flex-1 text-left">Active Devices</span>
            <ChevronRight size={16} className="text-white/30" />
          </button>
        </div>
      </div>
      <div className="glass p-5 rounded-2xl mt-4">
        <h3 className="text-white font-bold text-sm mb-2">Data & Privacy</h3>
        <p className="text-white/40 text-xs mb-3">Your data is encrypted and stored securely. We never share your information with third parties.</p>
        <button className="text-red-400 text-sm font-semibold">Delete My Account</button>
      </div>
    </div>
  )
}

function AppearanceSection({ prefs, updatePref, goBack }) {
  const [theme, setTheme] = useState('dark')
  const sizes = [
    { key: 'small', label: 'Small', size: 'text-xs' },
    { key: 'medium', label: 'Medium', size: 'text-sm' },
    { key: 'large', label: 'Large', size: 'text-base' },
  ]
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Header title="Appearance & Theme" onBack={goBack} />
      <div className="glass p-5 rounded-2xl mb-3">
        <h3 className="text-white font-bold text-sm mb-4">Theme Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'dark', icon: Moon, label: 'Dark Mode' },
            { key: 'light', icon: Sun, label: 'Light Mode' },
          ].map(t => (
            <button key={t.key} onClick={() => setTheme(t.key)}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                theme === t.key ? 'bg-gradient-to-br from-primary/20 to-violet/20 border border-primary/40' : 'glass border border-transparent'
              }`}>
              <t.icon size={22} className={theme === t.key ? 'text-primary' : 'text-white/40'} />
              <span className={`text-sm font-semibold ${theme === t.key ? 'text-white' : 'text-white/50'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="glass p-5 rounded-2xl mb-3">
        <h3 className="text-white font-bold text-sm mb-4">Font Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map(s => (
            <button key={s.key} onClick={() => updatePref('fontSize', s.key)}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                prefs.fontSize === s.key ? 'bg-gradient-to-br from-primary/20 to-violet/20 border border-primary/40' : 'glass border border-transparent'
              }`}>
              <span className={`${s.size} font-bold text-white`}>Aa</span>
              <span className="text-xs text-white/40">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <ToggleCard icon={ToggleLeft} label="Reduce Motion" desc="Minimize animations and transitions" value={prefs.reduceMotion} onChange={v => updatePref('reduceMotion', v)} />
        <ToggleCard icon={Volume2} label="Sound Effects" desc="Play sounds for interactions and alerts" value={prefs.soundEffects} onChange={v => updatePref('soundEffects', v)} />
      </div>
    </div>
  )
}

function SubscriptionSection({ plans, goBack, user }) {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Header title="Subscription Plans" onBack={goBack} />
      <div className="glass p-4 rounded-2xl mb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <CreditCard size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Current Plan: {user?.plan || 'Free'}</p>
          <p className="text-white/40 text-xs">{user?.plan === 'Premium' ? 'Renews on Aug 19, 2026' : 'Upgrade for full access'}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">Active</span>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {(plans || []).map((p) => {
          const features = Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? p.features.split(',') : [])
          const isCurrent = (user?.plan || 'Free') === p.name
          return (
            <div key={p.id} className={`glass rounded-2xl p-5 ${p.name === 'Premium' ? 'ring-2 ring-primary/40' : ''}`}>
              {p.name === 'Premium' && <span className="text-xs font-bold text-primary mb-2 block">RECOMMENDED</span>}
              <h3 className="text-white font-black text-lg">{p.name}</h3>
              <p className="text-2xl font-black gradient-text mt-1">{p.price}</p>
              <p className="text-white/30 text-xs">per {p.period}</p>
              <div className="mt-3 space-y-2">
                {features.map((f, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-white/60 text-xs">{typeof f === 'string' ? f.trim() : f}</span>
                  </div>
                ))}
              </div>
              <button className={`w-full mt-4 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform ${
                isCurrent ? 'glass text-white/40' :
                p.name === 'Free' ? 'glass text-white/40' : 'bg-gradient-to-r from-primary to-violet text-white'
              }`}>
                {isCurrent ? 'Current Plan' : `Upgrade to ${p.name}`}
              </button>
            </div>
          )
        })}
      </div>
      <div className="glass p-4 rounded-2xl mt-4">
        <h3 className="text-white font-bold text-sm mb-3">Payment Method</h3>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xs">MK</div>
          <div className="flex-1">
            <p className="text-white/80 text-sm font-semibold">Paychangu</p>
            <p className="text-white/30 text-xs">Malawi Kwacha (MWK)</p>
          </div>
          <ChevronRight size={16} className="text-white/30" />
        </div>
      </div>
    </div>
  )
}

function LanguageSection({ prefs, updatePref, goBack }) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  ]
  const regions = [
    { code: 'mw', name: 'Malawi', flag: '🇲🇼' },
    { code: 'za', name: 'South Africa', flag: '🇿🇦' },
    { code: 'ng', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'ke', name: 'Kenya', flag: '🇰🇪' },
    { code: 'gh', name: 'Ghana', flag: '🇬🇭' },
    { code: 'eg', name: 'Egypt', flag: '🇪🇬' },
  ]
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Header title="Language & Region" onBack={goBack} />
      <div className="glass p-5 rounded-2xl mb-3">
        <h3 className="text-white font-bold text-sm mb-4">Language</h3>
        <div className="space-y-2">
          {languages.map(l => (
            <button key={l.code} onClick={() => updatePref('language', l.code)}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5">
              <span className="text-2xl">{l.flag}</span>
              <span className={`text-sm font-medium flex-1 text-left ${prefs.language === l.code ? 'text-white' : 'text-white/50'}`}>{l.name}</span>
              {prefs.language === l.code && <Check size={18} className="text-primary" />}
            </button>
          ))}
        </div>
      </div>
      <div className="glass p-5 rounded-2xl">
        <h3 className="text-white font-bold text-sm mb-4">Region</h3>
        <div className="space-y-2">
          {regions.map(r => (
            <button key={r.code} onClick={() => updatePref('region', r.code)}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5">
              <span className="text-2xl">{r.flag}</span>
              <span className={`text-sm font-medium flex-1 text-left ${prefs.region === r.code ? 'text-white' : 'text-white/50'}`}>{r.name}</span>
              {prefs.region === r.code && <Check size={18} className="text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function HelpSection({ goBack, appSettings }) {
  const faqs = [
    { q: 'How do I create flashcards?', a: 'Go to Flashcards tab, click the + button, and start adding cards to your deck.' },
    { q: 'How does the AI Tutor work?', a: 'The AI Tutor uses advanced models to answer your questions, explain concepts, and provide study guidance.' },
    { q: 'Can I download documents for offline?', a: 'Yes, in Privacy settings enable Auto-Download, and your course materials will be available offline.' },
    { q: 'How do I cancel my subscription?', a: 'Go to Subscription & Billing in Settings and click Cancel, or contact support.' },
  ]
  const [openFaq, setOpenFaq] = useState(null)
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Header title="Help & Support" onBack={goBack} />
      <div className="glass p-5 rounded-2xl mb-3">
        <h3 className="text-white font-bold text-sm mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="glass p-3 rounded-xl">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-2">
                <span className="text-white/80 text-sm font-medium text-left">{f.q}</span>
                <ChevronRight size={16} className={`text-white/30 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
              </button>
              {openFaq === i && <p className="text-white/40 text-xs mt-2 pt-2 border-t border-white/5">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="glass p-5 rounded-2xl mb-3">
        <h3 className="text-white font-bold text-sm mb-3">Contact Us</h3>
        <div className="space-y-2">
          <a href={`mailto:${appSettings?.supportEmail || 'support@ngoms.ai'}`}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
            <Mail size={18} className="text-primary" />
            <span className="text-white/80 text-sm font-medium flex-1 text-left">{appSettings?.supportEmail || 'support@ngoms.ai'}</span>
          </a>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
            <MessageSquare size={18} className="text-primary" />
            <span className="text-white/80 text-sm font-medium flex-1 text-left">Live Chat</span>
            <span className="text-xs text-green-400 font-semibold">Online</span>
          </button>
        </div>
      </div>
      <div className="glass p-4 rounded-2xl text-center">
        <p className="text-white/30 text-xs">Ngoms AI v{appSettings?.version || '1.0.0'}</p>
        <p className="text-white/20 text-[11px] mt-1">Made with 💜 in Malawi</p>
      </div>
    </div>
  )
}

function Header({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <button onClick={onBack} className="glass p-2 rounded-xl text-white/60 active:scale-90 transition-transform">
        <ChevronLeft size={18} />
      </button>
      <h1 className="text-2xl font-black text-white">{title}</h1>
    </div>
  )
}

function ToggleCard({ icon: Icon, label, desc, value, onChange }) {
  return (
    <div className="glass p-4 rounded-2xl flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
        <Icon size={18} className="text-white/60" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-sm font-semibold">{label}</p>
        <p className="text-white/40 text-xs">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-all shrink-0 ${value ? 'bg-gradient-to-r from-primary to-violet' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
