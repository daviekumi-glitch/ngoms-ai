import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpen, FileText, Zap, Layers, Bell, CreditCard,
  Trophy, Award, Settings as SettingsIcon, LogOut, Menu, X, Megaphone,
  Tag, HelpCircle, MessageSquare, ScrollText, ToggleLeft, Star, TrendingUp,
  Shield, ChevronRight, Sparkles, Plus, Save
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import CrudTable from '../components/admin/CrudTable'

const TABS = [
  { id:'dashboard', label:'Overview', icon:LayoutDashboard, color:'from-primary to-violet' },
  { id:'users', label:'Users', icon:Users, color:'from-blue-500 to-primary' },
  { id:'banner', label:'Banner', icon:Megaphone, color:'from-pink-500 to-rose-500' },
  { id:'courses', label:'Courses', icon:BookOpen, color:'from-emerald-500 to-teal-500' },
  { id:'quizzes', label:'Quizzes', icon:Zap, color:'from-amber-500 to-orange-500' },
  { id:'flashcards', label:'Flashcards', icon:Layers, color:'from-violet to-purple-500' },
  { id:'documents', label:'Documents', icon:FileText, color:'from-cyan-500 to-blue-500' },
  { id:'notifications', label:'Notifications', icon:Bell, color:'from-red-500 to-orange-500' },
  { id:'plans', label:'Subscriptions', icon:CreditCard, color:'from-indigo-500 to-violet' },
  { id:'payments', label:'Payments', icon:TrendingUp, color:'from-green-500 to-emerald-500' },
  { id:'leaderboard', label:'Leaderboard', icon:Trophy, color:'from-yellow-500 to-amber-500' },
  { id:'badges', label:'Badges', icon:Award, color:'from-purple-500 to-pink-500' },
  { id:'features', label:'Feature Toggles', icon:ToggleLeft, color:'from-teal-500 to-cyan-500' },
  { id:'coupons', label:'Coupons', icon:Tag, color:'from-orange-500 to-red-500' },
  { id:'announcements', label:'Announcements', icon:Megaphone, color:'from-rose-500 to-pink-500' },
  { id:'faqs', label:'FAQs', icon:HelpCircle, color:'from-sky-500 to-blue-500' },
  { id:'testimonials', label:'Testimonials', icon:Star, color:'from-amber-400 to-yellow-500' },
  { id:'messages', label:'Messages', icon:MessageSquare, color:'from-lime-500 to-green-500' },
  { id:'logs', label:'System Logs', icon:ScrollText, color:'from-slate-500 to-gray-500' },
  { id:'settings', label:'App Settings', icon:SettingsIcon, color:'from-primary to-cyan-500' },
]

export default function AdminPanel() {
  const { adminSession, adminLogout } = useApp()
  const nav = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  // Proper redirect using useEffect
  useEffect(() => {
    if (!adminSession) nav('/admin/login')
  }, [adminSession, nav])

  if (!adminSession) return null

  const activeTab = TABS.find(t => t.id === tab)
  const handleLogout = () => { adminLogout(); nav('/admin/login') }

  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 w-72 bg-navy-800 border-r border-white/5 flex flex-col transition-transform duration-300 h-full`}>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-violet flex items-center justify-center shadow-lg shadow-violet/20">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-black text-white text-sm">Ngoms Admin</p>
              <p className="text-white/30 text-xs">{adminSession?.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setMenuOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm transition-all ${tab === t.id ? 'bg-gradient-to-r from-primary/20 to-violet/20 text-white border border-primary/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <t.icon size={16} /> <span className="font-medium">{t.label}</span>
              {tab === t.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
            <LogOut size={16} /> Logout Admin
          </button>
        </div>
      </aside>

      {menuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMenuOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white/60">
            <Menu size={20} />
          </button>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeTab?.color} flex items-center justify-center`}>
            {activeTab && <activeTab.icon size={18} className="text-white" />}
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">{activeTab?.label}</h1>
            <p className="text-white/30 text-xs">Ngoms AI Admin Panel</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-white/30 hidden sm:block">v1.0.0</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet flex items-center justify-center text-white text-sm font-bold">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <TabContent tab={tab} />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

function TabContent({ tab }) {
  const app = useApp()

  if (tab === 'dashboard') return <AdminDashboard app={app} />

  // Special tabs
  if (tab === 'banner') return <BannerEditor app={app} />
  if (tab === 'features') return <FeatureToggles app={app} />
  if (tab === 'settings') return <AppSettingsEditor app={app} />
  if (tab === 'documents') return <DocumentsManager app={app} />

  // CRUD tab configs
  const configs = {
    users: {
      title: 'Users', collection: 'users',
      columns: [{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'role',label:'Role'},{key:'plan',label:'Plan'},{key:'xp',label:'XP'},{key:'status',label:'Status'}],
      fields: [
        {key:'name',label:'Full Name',type:'text'},
        {key:'email',label:'Email',type:'email'},
        {key:'role',label:'Role',type:'select',options:['student','lecturer','institution','admin']},
        {key:'plan',label:'Plan',type:'select',options:['Free','Premium','Institutional']},
        {key:'xp',label:'XP Points',type:'number'},
        {key:'streak',label:'Streak (days)',type:'number'},
        {key:'status',label:'Status',type:'select',options:['active','suspended','banned']},
      ],
      renderCell: (k, v) => {
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='active'?'bg-green-500/20 text-green-400':v==='suspended'?'bg-orange-500/20 text-orange-400':'bg-red-500/20 text-red-400'}`}>{v}</span>
        if (k === 'plan') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='Premium'?'bg-primary/20 text-primary':'bg-white/10 text-white/50'}`}>{v}</span>
        return v ?? '—'
      }
    },
    courses: {
      title: 'Courses', collection: 'courses',
      columns: [{key:'title',label:'Title'},{key:'category',label:'Category'},{key:'students',label:'Students'},{key:'lessons',label:'Lessons'},{key:'status',label:'Status'}],
      fields: [
        {key:'title',label:'Course Title',type:'text'},
        {key:'category',label:'Category',type:'select',options:['Science','Math','Language','History','Geography','Computer Science','Economics','Psychology']},
        {key:'icon',label:'Icon (emoji)',type:'text',default:'📖'},
        {key:'color',label:'Color Gradient',type:'select',options:['from-emerald-500 to-teal-500','from-blue-500 to-primary','from-violet to-purple-500','from-orange-500 to-amber-500','from-red-500 to-rose-500']},
        {key:'lessons',label:'Number of Lessons',type:'number'},
        {key:'students',label:'Students Enrolled',type:'number'},
        {key:'status',label:'Status',type:'select',options:['published','draft','archived']},
      ],
      renderCell: (k, v) => {
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='published'?'bg-green-500/20 text-green-400':v==='draft'?'bg-yellow-500/20 text-yellow-400':'bg-red-500/20 text-red-400'}`}>{v}</span>
        return v ?? '—'
      }
    },
    quizzes: {
      title: 'Quizzes', collection: 'quizzes',
      columns: [{key:'title',label:'Title'},{key:'course',label:'Course'},{key:'questions',label:'Questions'},{key:'difficulty',label:'Difficulty'},{key:'attempts',label:'Attempts'},{key:'status',label:'Status'}],
      fields: [
        {key:'title',label:'Quiz Title',type:'text'},
        {key:'course',label:'Course',type:'text'},
        {key:'questions',label:'Number of Questions',type:'number'},
        {key:'difficulty',label:'Difficulty',type:'select',options:['Easy','Medium','Hard']},
        {key:'attempts',label:'Total Attempts',type:'number'},
        {key:'passRate',label:'Pass Rate',type:'text'},
        {key:'status',label:'Status',type:'select',options:['active','inactive','draft']},
      ],
      renderCell: (k, v) => {
        if (k === 'difficulty') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='Easy'?'bg-green-500/20 text-green-400':v==='Medium'?'bg-yellow-500/20 text-yellow-400':'bg-red-500/20 text-red-400'}`}>{v}</span>
        return v ?? '—'
      }
    },
    flashcards: {
      title: 'Flashcard Decks', collection: 'flashcards',
      columns: [{key:'title',label:'Deck Title'},{key:'author',label:'Author'},{key:'views',label:'Views'},{key:'status',label:'Status'}],
      fields: [
        {key:'title',label:'Deck Title',type:'text'},
        {key:'author',label:'Author',type:'text'},
        {key:'cards',label:'Card Count',type:'number'},
        {key:'views',label:'Views',type:'number'},
        {key:'status',label:'Status',type:'select',options:['published','draft','archived']},
      ],
      renderCell: (k, v) => {
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='published'?'bg-green-500/20 text-green-400':v==='draft'?'bg-yellow-500/20 text-yellow-400':'bg-red-500/20 text-red-400'}`}>{v}</span>
        return v ?? '—'
      }
    },
    notifications: {
      title: 'Notifications', collection: 'notifications',
      columns: [{key:'title',label:'Title'},{key:'body',label:'Body'},{key:'type',label:'Type'},{key:'sent',label:'Sent To'},{key:'date',label:'Date'}],
      fields: [
        {key:'title',label:'Title',type:'text'},
        {key:'body',label:'Body',type:'textarea'},
        {key:'type',label:'Type',type:'select',options:['course','system','promo','update','warning']},
        {key:'sent',label:'Sent Status',type:'number',default:1},
        {key:'date',label:'Date',type:'date'},
        {key:'status',label:'Status',type:'select',options:['sent','pending','draft']},
      ],
      renderCell: (k, v) => k === 'type' ? <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">{v}</span> : (v ?? '—')
    },
    plans: {
      title: 'Subscription Plans', collection: 'plans',
      columns: [{key:'name',label:'Plan'},{key:'price',label:'Price'},{key:'period',label:'Period'},{key:'features',label:'Features'},{key:'status',label:'Status'}],
      fields: [
        {key:'name',label:'Plan Name',type:'text'},
        {key:'price',label:'Price (MK)',type:'text'},
        {key:'period',label:'Billing Period',type:'select',options:['forever','month','year']},
        {key:'features',label:'Features (comma-separated)',type:'textarea'},
        {key:'limits',label:'Limits',type:'text'},
        {key:'color',label:'Color',type:'select',options:['from-white/10 to-white/5','from-primary to-violet','from-amber-500 to-orange-500','from-emerald-500 to-teal-500']},
        {key:'status',label:'Status',type:'select',options:['active','inactive']},
      ],
      renderCell: (k, v) => k === 'name' ? <span className="font-bold text-white">{v}</span> : (v ?? '—')
    },
    payments: {
      title: 'Payment Records', collection: 'payments',
      columns: [{key:'user',label:'User'},{key:'plan',label:'Plan'},{key:'amount',label:'Amount'},{key:'date',label:'Date'},{key:'method',label:'Method'},{key:'status',label:'Status'}],
      fields: [
        {key:'user',label:'User Name',type:'text'},
        {key:'plan',label:'Plan',type:'text'},
        {key:'amount',label:'Amount',type:'text'},
        {key:'date',label:'Date',type:'date'},
        {key:'method',label:'Payment Method',type:'text'},
        {key:'status',label:'Status',type:'select',options:['completed','pending','failed','refunded','free']},
      ],
      renderCell: (k, v) => {
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='completed'?'bg-green-500/20 text-green-400':v==='pending'?'bg-yellow-500/20 text-yellow-400':v==='free'?'bg-white/10 text-white/50':'bg-red-500/20 text-red-400'}`}>{v}</span>
        return v ?? '—'
      }
    },
    leaderboard: {
      title: 'Leaderboard', collection: 'leaderboard',
      columns: [{key:'rank',label:'Rank'},{key:'name',label:'Name'},{key:'xp',label:'XP'},{key:'badge',label:'Badge'},{key:'avatar',label:'Avatar'}],
      fields: [
        {key:'rank',label:'Rank',type:'number'},
        {key:'name',label:'Name',type:'text'},
        {key:'xp',label:'XP Points',type:'number'},
        {key:'badge',label:'Badge',type:'select',options:['Diamond','Gold','Silver','Bronze']},
        {key:'avatar',label:'Avatar (emoji)',type:'text',default:'🧑‍🎓'},
      ],
      renderCell: (k, v) => {
        if (k === 'badge') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='Diamond'?'bg-cyan-500/20 text-cyan-400':v==='Gold'?'bg-yellow-500/20 text-yellow-400':v==='Silver'?'bg-gray-400/20 text-gray-300':'bg-orange-500/20 text-orange-400'}`}>{v}</span>
        if (k === 'avatar') return <span className="text-xl">{v}</span>
        if (k === 'rank') return <span className="font-black text-white">#{v}</span>
        return v ?? '—'
      }
    },
    badges: {
      title: 'Badges & Achievements', collection: 'badges',
      columns: [{key:'name',label:'Badge Name'},{key:'desc',label:'Description'},{key:'icon',label:'Icon'},{key:'earners',label:'Earners'},{key:'status',label:'Status'}],
      fields: [
        {key:'name',label:'Badge Name',type:'text'},
        {key:'desc',label:'Description',type:'textarea'},
        {key:'icon',label:'Icon (emoji)',type:'text',default:'🏆'},
        {key:'color',label:'Color Gradient',type:'select',options:['from-blue-500 to-primary','from-amber-500 to-orange-500','from-red-500 to-orange-500','from-violet to-purple-500','from-emerald-500 to-teal-500']},
        {key:'earners',label:'Earners Count',type:'number'},
        {key:'status',label:'Status',type:'select',options:['active','inactive']},
      ],
      renderCell: (k, v) => {
        if (k === 'icon') return <span className="text-xl">{v}</span>
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='active'?'bg-green-500/20 text-green-400':'bg-white/10 text-white/50'}`}>{v}</span>
        return v ?? '—'
      }
    },
    coupons: {
      title: 'Coupons', collection: 'coupons',
      columns: [{key:'code',label:'Code'},{key:'discount',label:'Discount'},{key:'uses',label:'Used'},{key:'maxUses',label:'Max Uses'},{key:'expiry',label:'Expiry'},{key:'status',label:'Status'}],
      fields: [
        {key:'code',label:'Coupon Code',type:'text'},
        {key:'discount',label:'Discount %',type:'text'},
        {key:'uses',label:'Used Count',type:'number'},
        {key:'maxUses',label:'Max Uses',type:'number'},
        {key:'expiry',label:'Expiry Date',type:'date'},
        {key:'status',label:'Status',type:'select',options:['active','expired','disabled']},
      ],
      renderCell: (k, v) => {
        if (k === 'code') return <span className="font-mono text-primary font-bold">{v}</span>
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='active'?'bg-green-500/20 text-green-400':v==='expired'?'bg-red-500/20 text-red-400':'bg-white/10 text-white/50'}`}>{v}</span>
        return v ?? '—'
      }
    },
    announcements: {
      title: 'Announcements', collection: 'announcements',
      columns: [{key:'title',label:'Title'},{key:'body',label:'Body'},{key:'priority',label:'Priority'},{key:'date',label:'Date'},{key:'status',label:'Status'}],
      fields: [
        {key:'title',label:'Title',type:'text'},
        {key:'body',label:'Body',type:'textarea'},
        {key:'priority',label:'Priority',type:'select',options:['low','medium','high','critical']},
        {key:'date',label:'Date',type:'date'},
        {key:'status',label:'Status',type:'select',options:['active','inactive']},
      ],
      renderCell: (k, v) => {
        if (k === 'priority') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='critical'?'bg-red-500/20 text-red-400':v==='high'?'bg-orange-500/20 text-orange-400':v==='medium'?'bg-yellow-500/20 text-yellow-400':'bg-white/10 text-white/50'}`}>{v}</span>
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='active'?'bg-green-500/20 text-green-400':'bg-white/10 text-white/50'}`}>{v}</span>
        return v ?? '—'
      }
    },
    faqs: {
      title: 'FAQs', collection: 'faqs',
      columns: [{key:'question',label:'Question'},{key:'answer',label:'Answer'},{key:'category',label:'Category'},{key:'status',label:'Status'}],
      fields: [
        {key:'question',label:'Question',type:'textarea'},
        {key:'answer',label:'Answer',type:'textarea'},
        {key:'category',label:'Category',type:'select',options:['Billing','Technical','General','Account','Content']},
        {key:'status',label:'Status',type:'select',options:['published','draft']},
      ],
      renderCell: (k, v) => {
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='published'?'bg-green-500/20 text-green-400':'bg-white/10 text-white/50'}`}>{v}</span>
        return v ?? '—'
      }
    },
    testimonials: {
      title: 'Testimonials', collection: 'testimonials',
      columns: [{key:'name',label:'Name'},{key:'role',label:'Role'},{key:'text',label:'Testimonial'},{key:'rating',label:'Rating'},{key:'status',label:'Status'}],
      fields: [
        {key:'name',label:'Name',type:'text'},
        {key:'role',label:'Role/Title',type:'text'},
        {key:'text',label:'Testimonial',type:'textarea'},
        {key:'rating',label:'Rating (1-5)',type:'number'},
        {key:'status',label:'Status',type:'select',options:['published','draft']},
      ],
      renderCell: (k, v) => {
        if (k === 'rating') return <span className="text-yellow-400">{'★'.repeat(v)}{'☆'.repeat(5-v)}</span>
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='published'?'bg-green-500/20 text-green-400':'bg-white/10 text-white/50'}`}>{v}</span>
        return v ?? '—'
      }
    },
    messages: {
      title: 'Contact Messages', collection: 'messages',
      columns: [{key:'name',label:'From'},{key:'email',label:'Email'},{key:'subject',label:'Subject'},{key:'date',label:'Date'},{key:'status',label:'Status'}],
      fields: [
        {key:'name',label:'Name',type:'text'},
        {key:'email',label:'Email',type:'email'},
        {key:'subject',label:'Subject',type:'text'},
        {key:'body',label:'Message Body',type:'textarea'},
        {key:'date',label:'Date',type:'date'},
        {key:'status',label:'Status',type:'select',options:['open','resolved','closed']},
      ],
      renderCell: (k, v) => {
        if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='open'?'bg-orange-500/20 text-orange-400':v==='resolved'?'bg-green-500/20 text-green-400':'bg-white/10 text-white/50'}`}>{v}</span>
        return v ?? '—'
      }
    },
    logs: {
      title: 'System Logs', collection: 'logs',
      columns: [{key:'action',label:'Action'},{key:'user',label:'User'},{key:'time',label:'Time'},{key:'level',label:'Level'}],
      fields: [
        {key:'action',label:'Action',type:'text'},
        {key:'user',label:'User',type:'text'},
        {key:'time',label:'Time',type:'text'},
        {key:'level',label:'Level',type:'select',options:['info','success','warning','error']},
      ],
      renderCell: (k, v) => {
        if (k === 'level') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='success'?'bg-green-500/20 text-green-400':v==='warning'?'bg-yellow-500/20 text-yellow-400':v==='error'?'bg-red-500/20 text-red-400':'bg-primary/20 text-primary'}`}>{v}</span>
        return v ?? '—'
      }
    },
  }

  const cfg = configs[tab]
  if (!cfg) return <div className="text-white/40 text-sm">Section not found</div>

  return (
    <CrudTable title={cfg.title} columns={cfg.columns} data={app[cfg.collection] || []}
      fields={cfg.fields} renderCell={cfg.renderCell}
      onCreate={(d) => app.create(cfg.collection, d)}
      onUpdate={(id, d) => app.update(cfg.collection, id, d)}
      onDelete={(id) => app.remove(cfg.collection, id)} />
  )
}

// ===== Admin Dashboard =====
function AdminDashboard({ app }) {
  const stats = [
    { label: 'Total Users', value: (app.users || []).length, icon: Users, color: 'from-blue-500 to-primary' },
    { label: 'Active Courses', value: (app.courses || []).filter(c => c.status === 'published').length, icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
    { label: 'Quizzes', value: (app.quizzes || []).length, icon: Zap, color: 'from-amber-500 to-orange-500' },
    { label: 'Revenue (MK)', value: (app.payments || []).filter(p => p.status === 'completed').reduce((a, p) => a + parseInt((p.amount || '0').replace(/\D/g, '') || '0'), 0).toLocaleString(), icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Flashcard Decks', value: (app.flashcardDecks || []).length, icon: Layers, color: 'from-violet to-purple-500' },
    { label: 'Documents', value: (app.documents || []).length, icon: FileText, color: 'from-cyan-500 to-blue-500' },
    { label: 'Notifications Sent', value: (app.notifications || []).length, icon: Bell, color: 'from-red-500 to-orange-500' },
    { label: 'Active Coupons', value: (app.coupons || []).filter(c => c.status === 'active').length, icon: Tag, color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass p-4 rounded-2xl">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass p-5 rounded-2xl">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2"><Users size={16} className="text-primary" /> Recent Users</h3>
          <div className="space-y-2">
            {(app.users || []).slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet flex items-center justify-center text-xs font-bold text-white">{(u.name || '?')[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{u.name}</p>
                  <p className="text-white/30 text-xs truncate">{u.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${u.plan === 'Premium' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'}`}>{u.plan}</span>
              </div>
            ))}
            {(app.users || []).length === 0 && <p className="text-white/30 text-xs text-center py-4">No users yet</p>}
          </div>
        </div>
        <div className="glass p-5 rounded-2xl">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2"><ScrollText size={16} className="text-primary" /> Recent Logs</h3>
          <div className="space-y-2">
            {(app.logs || []).slice(0, 5).map(l => (
              <div key={l.id} className="flex items-center gap-3 py-2 border-b border-white/5">
                <span className={`w-2 h-2 rounded-full ${l.level === 'success' ? 'bg-green-400' : l.level === 'warning' ? 'bg-yellow-400' : l.level === 'error' ? 'bg-red-400' : 'bg-primary'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium">{l.action}</p>
                  <p className="text-white/30 text-xs">{l.user} · {l.time}</p>
                </div>
              </div>
            ))}
            {(app.logs || []).length === 0 && <p className="text-white/30 text-xs text-center py-4">No logs yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Documents Manager =====
function DocumentsManager({ app }) {
  const [uploading, setUploading] = useState(false)
  const [docData, setDocData] = useState({ title: '', type: 'PDF', size: '0 KB' })

  const handleCreate = async () => {
    if (!docData.title) return
    await app.create('documents', {
      ...docData,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'Admin',
      status: 'published',
      fileUrl: ''
    })
    setDocData({ title: '', type: 'PDF', size: '0 KB' })
  }

  return (
    <div>
      <div className="glass p-5 rounded-2xl mb-4">
        <h3 className="text-white font-bold text-sm mb-4">Upload New Document</h3>
        <div className="space-y-3">
          <input value={docData.title} onChange={e => setDocData({ ...docData, title: e.target.value })}
            placeholder="Document title" className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <select value={docData.type} onChange={e => setDocData({ ...docData, type: e.target.value })}
              className="input-field">
              {['PDF', 'DOCX', 'PPTX', 'XLSX', 'Image', 'Video', 'Audio'].map(t => <option key={t} value={t} className="bg-navy-800">{t}</option>)}
            </select>
            <input value={docData.size} onChange={e => setDocData({ ...docData, size: e.target.value })}
              placeholder="File size" className="input-field" />
          </div>
          <button onClick={handleCreate}
            className="w-full bg-gradient-to-r from-primary to-violet text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            <Plus size={16} /> Add Document
          </button>
        </div>
      </div>
      <CrudTable title="Documents"
        columns={[{key:'title',label:'Title'},{key:'type',label:'Type'},{key:'size',label:'Size'},{key:'uploadedBy',label:'Uploaded By'},{key:'date',label:'Date'},{key:'status',label:'Status'}]}
        data={app.documents || []}
        fields={[
          {key:'title',label:'Document Title',type:'text'},
          {key:'type',label:'Type',type:'select',options:['PDF','DOCX','PPTX','XLSX','Image','Video','Audio']},
          {key:'size',label:'File Size',type:'text'},
          {key:'uploadedBy',label:'Uploaded By',type:'text'},
          {key:'date',label:'Date',type:'date'},
          {key:'fileUrl',label:'File URL',type:'text'},
          {key:'status',label:'Status',type:'select',options:['published','draft','archived']},
        ]}
        renderCell={(k, v) => {
          if (k === 'type') return <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">{v}</span>
          if (k === 'status') return <span className={`px-2 py-0.5 rounded-full text-xs ${v==='published'?'bg-green-500/20 text-green-400':'bg-white/10 text-white/50'}`}>{v}</span>
          return v ?? '—'
        }}
        onCreate={(d) => app.create('documents', d)}
        onUpdate={(id, d) => app.update('documents', id, d)}
        onDelete={(id) => app.remove('documents', id)} />
    </div>
  )
}

// ===== Banner Editor =====
function BannerEditor({ app }) {
  const { banner, setBanner } = app
  const [local, setLocal] = useState(banner || { title: '', subtitle: '', actionText: '', actionRoute: '/chat', bgColor: 'from-primary to-violet', active: false, icon: 'sparkles' })

  useEffect(() => {
    if (banner) setLocal(banner)
  }, [banner])

  const save = () => setBanner(local)

  return (
    <div className="max-w-2xl">
      <div className="glass p-6 rounded-2xl mb-4">
        <h3 className="text-white font-bold text-sm mb-4">Dashboard Banner (shown to all users)</h3>
        {/* Preview */}
        <div className={`bg-gradient-to-r ${local.bgColor} rounded-2xl p-5 mb-6`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-lg">{local.title || 'Banner Title'}</p>
              <p className="text-white/80 text-sm">{local.subtitle || 'Banner subtitle'}</p>
            </div>
            {local.active && <span className="bg-white/20 px-3 py-1.5 rounded-xl text-white text-sm font-semibold">{local.actionText || 'Action'}</span>}
          </div>
        </div>
        {/* Controls */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={local.active} onChange={e => setLocal({ ...local, active: e.target.checked })} className="w-5 h-5 rounded accent-primary" />
            <span className="text-white/80 text-sm font-medium">Banner Active (visible to users)</span>
          </label>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Banner Title</label>
            <input value={local.title || ''} onChange={e => setLocal({ ...local, title: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Banner Subtitle</label>
            <input value={local.subtitle || ''} onChange={e => setLocal({ ...local, subtitle: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Action Button Text</label>
              <input value={local.actionText || ''} onChange={e => setLocal({ ...local, actionText: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Action Route</label>
              <input value={local.actionRoute || ''} onChange={e => setLocal({ ...local, actionRoute: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Background Color</label>
            <select value={local.bgColor || 'from-primary to-violet'} onChange={e => setLocal({ ...local, bgColor: e.target.value })} className="input-field">
              {['from-primary to-violet','from-emerald-500 to-teal-500','from-amber-500 to-orange-500','from-rose-500 to-pink-500','from-cyan-500 to-blue-500','from-red-500 to-orange-500'].map(c => <option key={c} value={c} className="bg-navy-800">{c}</option>)}
            </select>
          </div>
          <button onClick={save}
            className="w-full bg-gradient-to-r from-primary to-violet text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
            <Save size={16} /> Save Banner
          </button>
        </div>
      </div>
      <p className="text-white/30 text-xs">Changes reflect instantly on all user dashboards.</p>
    </div>
  )
}

// ===== Feature Toggles =====
function FeatureToggles({ app }) {
  const { features, toggleFeature, create } = app
  const [showAdd, setShowAdd] = useState(false)
  const [newFeature, setNewFeature] = useState({ key: '', name: '', icon: '✨' })

  const handleAdd = async () => {
    if (!newFeature.key || !newFeature.name) return
    await create('features', { ...newFeature, enabled: true })
    setShowAdd(false)
    setNewFeature({ key: '', name: '', icon: '✨' })
  }

  return (
    <div className="max-w-2xl">
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-sm">Feature Management</h3>
            <p className="text-white/30 text-xs">Enable or disable features for all users instantly</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)}
            className="bg-gradient-to-r from-primary to-violet text-white font-semibold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5">
            <Plus size={14} /> Add
          </button>
        </div>

        {showAdd && (
          <div className="glass p-4 rounded-2xl mb-4 space-y-3">
            <input value={newFeature.name} onChange={e => setNewFeature({ ...newFeature, name: e.target.value })} placeholder="Feature name" className="input-field" />
            <input value={newFeature.key} onChange={e => setNewFeature({ ...newFeature, key: e.target.value })} placeholder="Feature key (e.g. ai_chat)" className="input-field" />
            <input value={newFeature.icon} onChange={e => setNewFeature({ ...newFeature, icon: e.target.value })} placeholder="Icon emoji" className="input-field" />
            <button onClick={handleAdd} className="w-full bg-gradient-to-r from-primary to-violet text-white font-bold py-2.5 rounded-xl text-sm">Create Feature</button>
          </div>
        )}

        <div className="space-y-2">
          {(features || []).map(f => (
            <div key={f.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
              <span className="text-2xl">{f.icon}</span>
              <div className="flex-1">
                <p className="text-white/80 text-sm font-semibold">{f.name}</p>
                <p className="text-white/30 text-xs">Key: {f.key}</p>
              </div>
              <button onClick={() => toggleFeature(f.id)}
                className={`relative w-12 h-6 rounded-full transition-all ${f.enabled ? 'bg-gradient-to-r from-primary to-violet' : 'bg-white/10'}`}>
                <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md ${f.enabled ? 'left-6' : 'left-0.5'}`} />
              </button>
              <span className={`text-xs font-semibold ${f.enabled ? 'text-green-400' : 'text-white/30'}`}>{f.enabled ? 'ON' : 'OFF'}</span>
            </div>
          ))}
          {(!features || features.length === 0) && <p className="text-white/30 text-xs text-center py-4">No features configured</p>}
        </div>
      </div>
    </div>
  )
}

// ===== App Settings Editor =====
function AppSettingsEditor({ app }) {
  const { appSettings, setSettings } = app
  const [local, setLocal] = useState(appSettings || {})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (appSettings) setLocal(appSettings)
  }, [appSettings])

  const fields = [
    { key: 'appName', label: 'App Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'supportEmail', label: 'Support Email' },
    { key: 'primaryColor', label: 'Primary Color (hex)' },
    { key: 'accentColor', label: 'Accent Color (hex)' },
    { key: 'maxFileSize', label: 'Max File Size (MB)' },
    { key: 'aiQueryLimit', label: 'AI Query Limit per day' },
    { key: 'version', label: 'App Version' },
    { key: 'maintenanceMessage', label: 'Maintenance Message' },
  ]

  const handleSave = () => {
    setSettings(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl">
      <div className="glass p-6 rounded-2xl mb-4">
        <h3 className="text-white font-bold text-sm mb-4">Application Settings</h3>
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">{f.label}</label>
              <input value={local[f.key] || ''} onChange={e => setLocal({ ...local, [f.key]: e.target.value })} className="input-field" />
            </div>
          ))}
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input type="checkbox" checked={local.maintenanceMode || false} onChange={e => setLocal({ ...local, maintenanceMode: e.target.checked })} className="w-5 h-5 rounded accent-red-500" />
            <span className="text-white/80 text-sm font-medium">Maintenance Mode (blocks user access)</span>
          </label>
        </div>
        <button onClick={handleSave}
          className="w-full mt-4 bg-gradient-to-r from-primary to-violet text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
          <Save size={16} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
      <div className="glass p-4 rounded-2xl">
        <p className="text-white/30 text-xs">Settings save to the database and reflect across the entire platform.</p>
      </div>
    </div>
  )
}
