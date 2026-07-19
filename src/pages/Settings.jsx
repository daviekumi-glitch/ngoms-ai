import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  CreditCard, AlertCircle, Globe, Type, Palette, Heart, User, Camera,
  Shield, Users, FileText, Activity, Bot, Settings as SettingsIcon,
  Image, Bell, Star, Database, Key, BarChart2, Flag, Mail, Sliders,
  Package, Monitor, Server, Lock, Megaphone, Award, BookOpen, Zap,
  Calendar, TrendingUp, MessageSquare, Layers, ChevronRight, Check,
  ChevronDown, X, Search, Plus, Edit3, Trash2
} from 'lucide-react'

// ─── SETTINGS SECTIONS ──────────────────────────────────────────────────────
const settingsSections = [
  { id:'subscription', icon:CreditCard, label:'Subscription', color:'text-emerald-400', bg:'bg-emerald-400/10' },
  { id:'report', icon:AlertCircle, label:'Report Issue', color:'text-red-400', bg:'bg-red-400/10' },
  { id:'language', icon:Globe, label:'Language', color:'text-blue-400', bg:'bg-blue-400/10' },
  { id:'fonts', icon:Type, label:'Fonts', color:'text-purple-400', bg:'bg-purple-400/10' },
  { id:'theme', icon:Palette, label:'Theme', color:'text-pink-400', bg:'bg-pink-400/10' },
  { id:'favourites', icon:Heart, label:'Favourites', color:'text-rose-400', bg:'bg-rose-400/10' },
  { id:'profile_info', icon:User, label:'Profile Info', color:'text-primary', bg:'bg-primary/10' },
  { id:'admin', icon:Shield, label:'Admin Panel', color:'text-amber-400', bg:'bg-amber-400/10' },
]

// ─── ADMIN TABS ──────────────────────────────────────────────────────────────
const adminTabs = [
  { id:'notif_mgmt', icon:Bell, label:'Notifications' },
  { id:'users_mgmt', icon:Users, label:'Users' },
  { id:'docs_mgmt', icon:FileText, label:'Documents' },
  { id:'system_status', icon:Activity, label:'System Status' },
  { id:'ai_coordinator', icon:Bot, label:'AI Coordinator' },
  { id:'sub_mgmt', icon:CreditCard, label:'Subscriptions' },
  { id:'payment_int', icon:Package, label:'Payments' },
  { id:'banner_mgmt', icon:Image, label:'Banners' },
  { id:'quiz_mgmt', icon:Zap, label:'Quizzes' },
  { id:'flash_mgmt', icon:Layers, label:'Flashcards' },
  { id:'course_mgmt', icon:BookOpen, label:'Courses' },
  { id:'subject_mgmt', icon:Database, label:'Subjects' },
  { id:'badge_mgmt', icon:Award, label:'Badges' },
  { id:'xp_rules', icon:Star, label:'XP Rules' },
  { id:'analytics_cfg', icon:BarChart2, label:'Analytics' },
  { id:'feature_flags', icon:Flag, label:'Features' },
  { id:'email_tmpl', icon:Mail, label:'Email Tpl' },
  { id:'notif_rules', icon:Sliders, label:'Notif Rules' },
  { id:'api_keys', icon:Key, label:'API Keys' },
  { id:'security', icon:Lock, label:'Security' },
  { id:'content_mod', icon:Shield, label:'Moderation' },
  { id:'reports', icon:TrendingUp, label:'Reports' },
  { id:'announcements', icon:Megaphone, label:'Announcements' },
  { id:'planner_cfg', icon:Calendar, label:'Planner Cfg' },
  { id:'lang_mgmt', icon:Globe, label:'Languages' },
  { id:'institution_mgmt', icon:Monitor, label:'Institutions' },
  { id:'session_mgmt', icon:Server, label:'Sessions' },
  { id:'feedback', icon:MessageSquare, label:'Feedback' },
  { id:'achievements', icon:Trophy, label:'Achievements' },
  { id:'theme_mgmt', icon:Palette, label:'Themes' },
  { id:'font_mgmt', icon:Type, label:'Fonts Mgmt' },
  { id:'backup', icon:Database, label:'Backup' },
  { id:'audit_log', icon:Activity, label:'Audit Log' },
  { id:'quiz_templates', icon:Zap, label:'Quiz Templates' },
  { id:'ai_models', icon:Bot, label:'AI Models' },
  { id:'onboard_cfg', icon:SettingsIcon, label:'Onboarding' },
  { id:'leaderboard_cfg', icon:BarChart2, label:'Leaderboard' },
  { id:'platform_logs', icon:Server, label:'Platform Logs' },
]

function Trophy(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
}

// ─── GENERIC CRUD TABLE ──────────────────────────────────────────────────────
function CrudTable({ title, columns, rows }) {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const filtered = rows.filter(r => Object.values(r).join(' ').toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"/>
          <input className="input-field pl-9 text-sm py-2" placeholder={`Search ${title}...`} value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <button onClick={()=>setShowAdd(true)} className="gradient-btn text-sm py-2 flex items-center gap-1">
          <Plus size={14}/> Add
        </button>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid gap-0" style={{gridTemplateColumns:`repeat(${columns.length+1},1fr)`}}>
          {columns.map(c=>(
            <div key={c} className="px-4 py-3 text-xs font-bold text-white/40 uppercase tracking-wider border-b border-white/5">{c}</div>
          ))}
          <div className="px-4 py-3 text-xs font-bold text-white/40 uppercase tracking-wider border-b border-white/5">Actions</div>
          {filtered.map((row,i)=>(
            <>
              {columns.map(c=>(
                <div key={c} className={`px-4 py-3.5 text-sm text-white/70 ${i%2===0?'':'bg-white/2'} border-b border-white/5`}>{row[c]||'—'}</div>
              ))}
              <div className={`px-4 py-3.5 flex items-center gap-2 ${i%2===0?'':'bg-white/2'} border-b border-white/5`}>
                <button className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all"><Edit3 size={12} className="text-primary"/></button>
                <button className="p-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-all"><Trash2 size={12} className="text-red-400"/></button>
              </div>
            </>
          ))}
        </div>
        {filtered.length===0&&(
          <div className="py-12 text-center text-white/30 text-sm">No {title.toLowerCase()} found</div>
        )}
      </div>
    </div>
  )
}

// ─── AI COORDINATOR CHAT ─────────────────────────────────────────────────────
function AICoordinator() {
  const [msgs, setMsgs] = useState([
    { role:'ai', text:'Hello Admin! I am the Ngoms AI Coordinator. I can manage all platform features through this chat. Try: "List all users", "Disable quiz for institution X", "Show system health", or "Create announcement".' }
  ])
  const [input, setInput] = useState('')
  const send = () => {
    if(!input.trim()) return
    const userMsg = { role:'user', text:input }
    setMsgs(m=>[...m, userMsg])
    setInput('')
    setTimeout(()=>{
      setMsgs(m=>[...m, { role:'ai', text:`Processing: "${userMsg.text}" — Feature execution simulated. In production, this will call the Base44 backend and return real results.` }])
    }, 800)
  }
  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-3">
        {msgs.map((m,i)=>(
          <div key={i} className={`flex ${m.role==='user'?'justify-end':''}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role==='ai' ? 'glass text-white/80' : 'bg-gradient-to-r from-primary to-violet text-white'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input-field text-sm py-2 flex-1" placeholder="Command the platform..." value={input}
          onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
        <button onClick={send} className="gradient-btn text-sm py-2 px-4">Send</button>
      </div>
    </div>
  )
}

// ─── SYSTEM STATUS ───────────────────────────────────────────────────────────
function SystemStatus() {
  const services = [
    { name:'API Server', status:'online', latency:'42ms', uptime:'99.9%' },
    { name:'AI Engine', status:'online', latency:'180ms', uptime:'98.7%' },
    { name:'File Storage', status:'online', latency:'65ms', uptime:'99.8%' },
    { name:'Database', status:'online', latency:'12ms', uptime:'100%' },
    { name:'Auth Service', status:'online', latency:'28ms', uptime:'99.9%' },
    { name:'Payment Gateway', status:'degraded', latency:'340ms', uptime:'95.2%' },
    { name:'Notification Service', status:'online', latency:'90ms', uptime:'99.5%' },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3 mb-2">
        {[{l:'Total Users',v:'1,247'},{l:'Active Now',v:'89'},{l:'Docs Processed',v:'5,831'}].map(s=>(
          <div key={s.l} className="card text-center p-3">
            <p className="text-xl font-black gradient-text">{s.v}</p>
            <p className="text-white/40 text-xs">{s.l}</p>
          </div>
        ))}
      </div>
      {services.map((s,i)=>(
        <div key={s.name} className="glass p-4 rounded-2xl flex items-center gap-4">
          <div className={`w-2.5 h-2.5 rounded-full ${s.status==='online'?'bg-emerald-400':'bg-amber-400'} shadow-lg ${s.status==='online'?'shadow-emerald-400/50':'shadow-amber-400/50'}`}/>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{s.name}</p>
            <p className="text-xs text-white/30">Uptime: {s.uptime}</p>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold ${s.status==='online'?'text-emerald-400':'text-amber-400'}`}>{s.status}</span>
            <p className="text-white/30 text-xs">{s.latency}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── SUBSCRIPTION PANEL (MWK) ────────────────────────────────────────────────
function SubscriptionPage() {
  const [sel, setSel] = useState('pro')
  const plans = [
    { id:'free', name:'Free', price:'MWK 0', per:'/month', color:'from-white/10 to-white/5', features:['5 Documents','Basic AI Chat','10 Quizzes/month','Standard Flashcards'] },
    { id:'pro', name:'Pro', price:'MWK 4,500', per:'/month', color:'from-primary to-violet', features:['Unlimited Documents','Advanced AI Tutor','Unlimited Quizzes','Spaced Repetition','Smart Notes','Study Planner','Priority Support'], popular:true },
    { id:'institution', name:'Institution', price:'MWK 35,000', per:'/month', color:'from-amber-500 to-orange-500', features:['Everything in Pro','Admin Dashboard','Multi-user (50 seats)','Custom Branding','API Access','Dedicated Support','Analytics Export'] },
  ]
  return (
    <div>
      <p className="text-white/50 text-sm mb-5">All prices in Malawi Kwacha (MWK). PayChangu payment integration coming soon.</p>
      <div className="flex flex-col gap-4">
        {plans.map(p=>(
          <div key={p.id} className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${sel===p.id ? 'border-primary bg-primary/10' : 'border-white/10 glass'}`}
            onClick={()=>setSel(p.id)}>
            {p.popular && <span className="absolute -top-3 left-4 bg-gradient-to-r from-primary to-violet text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-black text-white text-lg">{p.name}</p>
                <p className="gradient-text font-black text-xl">{p.price}<span className="text-white/40 text-sm font-normal">{p.per}</span></p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sel===p.id ? 'border-primary bg-primary' : 'border-white/20'}`}>
                {sel===p.id && <Check size={12} className="text-white"/>}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {p.features.map(f=>(
                <div key={f} className="flex items-center gap-2">
                  <Check size={12} className="text-emerald-400 shrink-0"/>
                  <span className="text-white/60 text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="gradient-btn w-full mt-5 text-sm">
        Subscribe via PayChangu — Coming Soon
      </button>
      <p className="text-center text-white/30 text-xs mt-3">Secure payment via PayChangu. Cancel anytime.</p>
    </div>
  )
}

// ─── REPORT ISSUE ────────────────────────────────────────────────────────────
function ReportIssue() {
  const [type, setType] = useState('bug')
  const [desc, setDesc] = useState('')
  const [sent, setSent] = useState(false)
  const types = ['bug','ui','performance','suggestion','other']
  if(sent) return (
    <div className="flex flex-col items-center py-12 gap-4">
      <div className="text-6xl">✅</div>
      <p className="text-white font-bold text-lg">Report Submitted</p>
      <p className="text-white/40 text-sm text-center">Thank you! Our team will review and respond within 24 hours.</p>
      <button onClick={()=>setSent(false)} className="gradient-btn text-sm">Submit Another</button>
    </div>
  )
  return (
    <div className="flex flex-col gap-4">
      <p className="text-white/50 text-sm">Help us improve Ngoms AI by reporting issues or suggestions.</p>
      <div>
        <p className="text-xs text-white/40 mb-2 font-semibold uppercase tracking-wider">Issue Type</p>
        <div className="flex flex-wrap gap-2">
          {types.map(t=>(
            <button key={t} onClick={()=>setType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${type===t ? 'bg-gradient-to-r from-primary to-violet text-white' : 'glass text-white/50 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-white/40 mb-2 font-semibold uppercase tracking-wider">Description</p>
        <textarea className="input-field h-32 resize-none text-sm" placeholder="Describe the issue in detail..."
          value={desc} onChange={e=>setDesc(e.target.value)}/>
      </div>
      <button onClick={()=>setSent(true)} className="gradient-btn text-sm" disabled={!desc.trim()}>
        Submit Report
      </button>
    </div>
  )
}

// ─── LANGUAGE SWITCH ─────────────────────────────────────────────────────────
function LanguageSwitch() {
  const [lang, setLang] = useState('en')
  const langs = [
    { id:'en', name:'English', flag:'🇬🇧', native:'English' },
    { id:'fr', name:'French', flag:'🇫🇷', native:'Français' },
    { id:'ny', name:'Chichewa', flag:'🇲🇼', native:'Chichewa' },
    { id:'sw', name:'Swahili', flag:'🇹🇿', native:'Kiswahili' },
    { id:'pt', name:'Portuguese', flag:'🇵🇹', native:'Português' },
  ]
  return (
    <div className="flex flex-col gap-3">
      {langs.map(l=>(
        <div key={l.id} className={`glass-hover p-4 rounded-2xl flex items-center gap-4 cursor-pointer border transition-all ${lang===l.id ? 'border-primary/40 bg-primary/5' : 'border-transparent'}`}
          onClick={()=>setLang(l.id)}>
          <span className="text-3xl">{l.flag}</span>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">{l.name}</p>
            <p className="text-white/40 text-xs">{l.native}</p>
          </div>
          {lang===l.id && <Check size={18} className="text-primary"/>}
        </div>
      ))}
    </div>
  )
}

// ─── FONT SWITCH ─────────────────────────────────────────────────────────────
function FontSwitch() {
  const [font, setFont] = useState('jakarta')
  const fonts = [
    { id:'jakarta', name:'Plus Jakarta Sans', preview:'The quick brown fox', style:'font-sans' },
    { id:'inter', name:'Inter', preview:'Learn Smarter. Not Harder.', style:'font-sans' },
    { id:'mono', name:'JetBrains Mono', preview:'ngoms_ai.learn()', style:'font-mono' },
    { id:'serif', name:'Merriweather', preview:'Knowledge is power', style:'font-serif' },
  ]
  return (
    <div className="flex flex-col gap-3">
      {fonts.map(f=>(
        <div key={f.id} className={`glass-hover p-4 rounded-2xl cursor-pointer border transition-all ${font===f.id ? 'border-primary/40 bg-primary/5' : 'border-transparent'}`}
          onClick={()=>setFont(f.id)}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{f.name}</p>
            {font===f.id && <Check size={14} className="text-primary"/>}
          </div>
          <p className={`text-lg text-white ${f.style}`}>{f.preview}</p>
        </div>
      ))}
    </div>
  )
}

// ─── THEME ───────────────────────────────────────────────────────────────────
function ThemePanel() {
  const [theme, setTheme] = useState('dark_navy')
  const themes = [
    { id:'dark_navy', name:'Dark Navy', colors:['#0A0F1E','#3B82F6','#7C3AED'] },
    { id:'midnight', name:'Midnight Black', colors:['#000000','#6366F1','#8B5CF6'] },
    { id:'forest', name:'Forest Dark', colors:['#0D1F0D','#22C55E','#16A34A'] },
    { id:'sunset', name:'Sunset Dark', colors:['#1A0A0A','#F97316','#EF4444'] },
    { id:'ocean', name:'Ocean Deep', colors:['#0A1628','#06B6D4','#0EA5E9'] },
  ]
  return (
    <div className="flex flex-col gap-3">
      {themes.map(t=>(
        <div key={t.id} className={`glass-hover p-4 rounded-2xl flex items-center gap-4 cursor-pointer border transition-all ${theme===t.id ? 'border-primary/40 bg-primary/5' : 'border-transparent'}`}
          onClick={()=>setTheme(t.id)}>
          <div className="flex gap-1.5">
            {t.colors.map((c,i)=>(<div key={i} className="w-6 h-6 rounded-lg" style={{backgroundColor:c}}/>))}
          </div>
          <p className="flex-1 font-semibold text-white text-sm">{t.name}</p>
          {theme===t.id && <Check size={16} className="text-primary"/>}
        </div>
      ))}
    </div>
  )
}

// ─── ADMIN CONTENT ───────────────────────────────────────────────────────────
function AdminContent({ tab }) {
  const sampleUsers = [
    { Name:'Davie Kumi', Role:'Student', XP:'2840', Status:'Active' },
    { Name:'Amara Banda', Role:'Lecturer', XP:'1200', Status:'Active' },
    { Name:'John Phiri', Role:'Student', XP:'980', Status:'Inactive' },
  ]
  const sampleDocs = [
    { Title:'Biology Notes', Subject:'Biology', Pages:'45', Status:'Processed' },
    { Title:'Physics Past Papers', Subject:'Physics', Pages:'120', Status:'Processing' },
    { Title:'Math Calculus', Subject:'Math', Pages:'78', Status:'Processed' },
  ]
  const sampleNotifs = [
    { Title:'Streak Alert', Type:'Push', Sent:'1,247', Status:'Active' },
    { Title:'Quiz Ready', Type:'In-App', Sent:'892', Status:'Active' },
    { Title:'Welcome', Type:'Email', Sent:'1,247', Status:'Sent' },
  ]
  const sampleBanners = [
    { Title:'Pro Launch Banner', Page:'Dashboard', Status:'Active' },
    { Title:'Exam Season Tip', Page:'Quiz', Status:'Inactive' },
  ]
  const sampleSubs = [
    { User:'Davie Kumi', Plan:'Pro', Amount:'MWK 4,500', Status:'Active', Expires:'Aug 2026' },
    { User:'Amara Banda', Plan:'Institution', Amount:'MWK 35,000', Status:'Active', Expires:'Dec 2026' },
  ]

  if(tab==='ai_coordinator') return <AICoordinator/>
  if(tab==='system_status') return <SystemStatus/>
  if(tab==='users_mgmt') return <CrudTable title="Users" columns={['Name','Role','XP','Status']} rows={sampleUsers}/>
  if(tab==='docs_mgmt') return <CrudTable title="Documents" columns={['Title','Subject','Pages','Status']} rows={sampleDocs}/>
  if(tab==='notif_mgmt') return <CrudTable title="Notifications" columns={['Title','Type','Sent','Status']} rows={sampleNotifs}/>
  if(tab==='banner_mgmt') return <CrudTable title="Banners" columns={['Title','Page','Status']} rows={sampleBanners}/>
  if(tab==='sub_mgmt') return <CrudTable title="Subscriptions" columns={['User','Plan','Amount','Status','Expires']} rows={sampleSubs}/>
  if(tab==='payment_int') return (
    <div className="flex flex-col gap-4">
      <div className="card p-5">
        <p className="font-bold text-white mb-1">PayChangu Integration</p>
        <p className="text-white/50 text-sm mb-4">Connect your PayChangu account to accept payments in MWK.</p>
        <input className="input-field text-sm mb-3" placeholder="PayChangu Public Key"/>
        <input className="input-field text-sm mb-3" placeholder="PayChangu Secret Key" type="password"/>
        <button className="gradient-btn text-sm w-full">Save & Test Connection</button>
      </div>
      <div className="glass p-4 rounded-2xl">
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Recent Payments</p>
        <div className="text-center py-8 text-white/30 text-sm">No payments yet — configure PayChangu above</div>
      </div>
    </div>
  )
  if(tab==='security') return (
    <div className="flex flex-col gap-3">
      {[
        { label:'Two-Factor Auth', desc:'Require 2FA for admin login', on:true },
        { label:'Rate Limiting', desc:'Limit API requests per user', on:true },
        { label:'Session Timeout', desc:'Auto-logout after 30 min idle', on:false },
        { label:'IP Whitelist', desc:'Restrict admin access by IP', on:false },
        { label:'Audit Logging', desc:'Log all admin actions', on:true },
      ].map(s=>(
        <div key={s.label} className="glass p-4 rounded-2xl flex items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">{s.label}</p>
            <p className="text-white/40 text-xs">{s.desc}</p>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all cursor-pointer ${s.on ? 'bg-gradient-to-r from-primary to-violet' : 'bg-white/10'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all mt-0.5 ${s.on ? 'ml-6' : 'ml-0.5'}`}/>
          </div>
        </div>
      ))}
    </div>
  )
  // Default generic table for remaining tabs
  const tabInfo = adminTabs.find(t=>t.id===tab)
  return (
    <div>
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔧</div>
        <p className="font-bold text-white mb-1">{tabInfo?.label || 'Management'}</p>
        <p className="text-white/40 text-sm mb-6">Full CRUD interface — auto-built by Ngoms AI Builder</p>
        <button className="gradient-btn text-sm">
          <Plus size={14} className="inline mr-1"/>Create New
        </button>
      </div>
    </div>
  )
}

// ─── MAIN SETTINGS ───────────────────────────────────────────────────────────
export default function Settings() {
  const [active, setActive] = useState(null)
  const [adminTab, setAdminTab] = useState('notif_mgmt')

  const content = () => {
    switch(active) {
      case 'subscription': return <SubscriptionPage/>
      case 'report': return <ReportIssue/>
      case 'language': return <LanguageSwitch/>
      case 'fonts': return <FontSwitch/>
      case 'theme': return <ThemePanel/>
      case 'favourites': return (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">❤️</div>
          <p className="text-white/40 text-sm">Your saved documents, notes and flashcard decks appear here.</p>
        </div>
      )
      case 'profile_info': return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-2xl font-black text-white relative">
              DK
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-xl flex items-center justify-center border border-navy-900">
                <Camera size={12} className="text-white"/>
              </button>
            </div>
            <button className="text-primary text-xs font-semibold">Change Photo</button>
          </div>
          {[['Full Name','Davie Kumi'],['Email','daviekumi@gmail.com'],['Institution','University of Malawi'],['Course','Computer Science'],['Year','3rd Year']].map(([l,v])=>(
            <div key={l}>
              <p className="text-xs text-white/40 mb-1 font-semibold uppercase tracking-wider">{l}</p>
              <input className="input-field text-sm" defaultValue={v}/>
            </div>
          ))}
          <button className="gradient-btn text-sm">Save Changes</button>
        </div>
      )
      case 'admin': return (
        <div>
          {/* Admin tab bar */}
          <div className="flex overflow-x-auto gap-2 pb-3 mb-5 scrollbar-hide">
            {adminTabs.map(t=>(
              <button key={t.id} onClick={()=>setAdminTab(t.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${adminTab===t.id ? 'bg-gradient-to-r from-primary to-violet text-white shadow-lg shadow-primary/30' : 'glass text-white/50 hover:text-white'}`}>
                <t.icon size={12}/>{t.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={adminTab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
              <AdminContent tab={adminTab}/>
            </motion.div>
          </AnimatePresence>
        </div>
      )
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Header */}
        <motion.div className="flex items-center gap-3 mb-6" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
          {active && (
            <button onClick={()=>setActive(null)} className="w-9 h-9 glass rounded-xl flex items-center justify-center">
              <X size={18} className="text-white/60"/>
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-white">{active ? (settingsSections.find(s=>s.id===active)?.label || 'Settings') : 'Settings'}</h1>
            {!active && <p className="text-white/40 text-sm">Preferences & Account</p>}
          </div>
        </motion.div>

        {/* Settings list or active panel */}
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div key="list" className="flex flex-col gap-3" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              {settingsSections.map((s,i)=>(
                <motion.div key={s.id} className="glass-hover p-4 rounded-2xl flex items-center gap-4 cursor-pointer"
                  initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  onClick={()=>setActive(s.id)}>
                  <div className={`w-11 h-11 rounded-2xl ${s.bg} flex items-center justify-center`}>
                    <s.icon size={20} className={s.color}/>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{s.label}</p>
                    {s.id==='admin' && <p className="text-xs text-amber-400/70">35+ CRUD tabs</p>}
                    {s.id==='subscription' && <p className="text-xs text-emerald-400/70">MWK • PayChangu</p>}
                  </div>
                  <ChevronRight size={16} className="text-white/30"/>
                </motion.div>
              ))}
              <div className="card mt-4 p-5 text-center">
                <p className="text-white/50 text-xs">Ngoms AI v1.0.0</p>
                <p className="text-white/30 text-xs">© 2026 Ngoms AI. All rights reserved.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key={active} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              {content()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
