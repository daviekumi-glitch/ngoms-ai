import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)
const STORAGE_KEY = 'ngoms_ai_state_v1'

const defaultData = {
  banner: {
    active: true, title: 'Welcome to Ngoms AI Premium',
    subtitle: 'Unlock unlimited AI tutoring, flashcards & quizzes',
    bgColor: 'from-primary to-violet', icon: 'Sparkles',
    actionText: 'Upgrade Now', actionRoute: '/settings',
  },
  users: [
    { id:'u1', name:'Davie Kuminga', email:'daviekumi@gmail.com', role:'student', plan:'Premium', xp:2840, streak:7, joined:'2026-07-16', status:'active' },
    { id:'u2', name:'Sarah Phiri', email:'sarah@example.com', role:'student', plan:'Free', xp:1240, streak:3, joined:'2026-07-15', status:'active' },
    { id:'u3', name:'John Banda', email:'john@example.com', role:'lecturer', plan:'Premium', xp:5200, streak:14, joined:'2026-07-10', status:'active' },
    { id:'u4', name:'Mary Nkhoma', email:'mary@example.com', role:'student', plan:'Free', xp:560, streak:1, joined:'2026-07-18', status:'suspended' },
  ],
  courses: [
    { id:'c1', title:'Biology Fundamentals', category:'Science', students:124, color:'from-emerald-500 to-teal-500', icon:'🧬', lessons:24, status:'published' },
    { id:'c2', title:'Mathematics Advanced', category:'Math', students:89, color:'from-blue-500 to-primary', icon:'📐', lessons:32, status:'published' },
    { id:'c3', title:'English Literature', category:'Language', students:67, color:'from-violet to-purple-500', icon:'📚', lessons:18, status:'published' },
    { id:'c4', title:'Physics Mechanics', category:'Science', students:45, color:'from-orange-500 to-amber-500', icon:'⚛️', lessons:20, status:'draft' },
  ],
  quizzes: [
    { id:'q1', title:'Biology Chapter 5 Quiz', course:'Biology Fundamentals', questions:15, difficulty:'Medium', attempts:342, passRate:'78%', status:'active' },
    { id:'q2', title:'Calculus Quick Test', course:'Mathematics Advanced', questions:20, difficulty:'Hard', attempts:210, passRate:'65%', status:'active' },
    { id:'q3', title:'Shakespeare Comprehension', course:'English Literature', questions:10, difficulty:'Easy', attempts:156, passRate:'89%', status:'active' },
  ],
  flashcardDecks: [
    { id:'f1', title:'Cell Biology', cards:42, author:'Davie Kuminga', views:1200, status:'published' },
    { id:'f2', title:'Algebra Formulas', cards:28, author:'John Banda', views:890, status:'published' },
    { id:'f3', title:'Literary Devices', cards:15, author:'Sarah Phiri', views:456, status:'draft' },
  ],
  documents: [
    { id:'d1', title:'Biology Chapter 5.pdf', size:'2.4 MB', uploadedBy:'Davie Kuminga', date:'2026-07-16', type:'pdf', status:'approved' },
    { id:'d2', title:'Math Formula Sheet.pdf', size:'1.1 MB', uploadedBy:'John Banda', date:'2026-07-14', type:'pdf', status:'approved' },
    { id:'d3', title:'English Essay Guide.docx', size:'890 KB', uploadedBy:'Sarah Phiri', date:'2026-07-18', type:'docx', status:'pending' },
  ],
  notifications: [
    { id:'n1', title:'New Course Available!', body:'Physics Mechanics is now live.', type:'course', date:'2026-07-19', sent:325, status:'sent' },
    { id:'n2', title:'Maintenance Scheduled', body:'Ngoms AI maintenance on July 20.', type:'system', date:'2026-07-18', sent:325, status:'sent' },
  ],
  plans: [
    { id:'p1', name:'Free', price:'MK 0', period:'forever', features:'5 AI questions/day, 20 flashcards', limits:'5 AI queries', color:'from-white/10 to-white/5', status:'active' },
    { id:'p2', name:'Premium', price:'MK 15,000', period:'month', features:'Unlimited AI, All flashcards, Analytics', limits:'Unlimited', color:'from-primary to-violet', status:'active' },
    { id:'p3', name:'Institutional', price:'MK 250,000', period:'month', features:'Everything + Bulk mgmt, API', limits:'Unlimited + API', color:'from-amber-500 to-orange-500', status:'active' },
  ],
  announcements: [
    { id:'a1', title:'New Phonk Study Music Added', body:'Check out the new focus music!', priority:'low', date:'2026-07-19', status:'active' },
  ],
  leaderboard: [
    { id:'l1', rank:1, name:'John Banda', xp:5200, badge:'Diamond', avatar:'👨‍🏫' },
    { id:'l2', rank:2, name:'Davie Kuminga', xp:2840, badge:'Gold', avatar:'🧑‍🎓' },
    { id:'l3', rank:3, name:'Sarah Phiri', xp:1240, badge:'Silver', avatar:'👩‍🎓' },
    { id:'l4', rank:4, name:'Mary Nkhoma', xp:560, badge:'Bronze', avatar:'👩‍🎓' },
  ],
  badges: [
    { id:'b1', name:'First Steps', desc:'Complete your first lesson', icon:'🎯', color:'from-blue-500 to-primary', earners:420, status:'active' },
    { id:'b2', name:'Quiz Master', desc:'Pass 10 quizzes with 90%+', icon:'🏆', color:'from-amber-500 to-orange-500', earners:156, status:'active' },
    { id:'b3', name:'Streak King', desc:'7-day study streak', icon:'🔥', color:'from-red-500 to-orange-500', earners:89, status:'active' },
    { id:'b4', name:'Night Owl', desc:'Study after midnight 5 times', icon:'🦉', color:'from-violet to-purple-500', earners:34, status:'inactive' },
  ],
  payments: [
    { id:'pay1', user:'Davie Kuminga', plan:'Premium', amount:'MK 15,000', date:'2026-07-16', method:'Paychangu', status:'completed' },
    { id:'pay2', user:'John Banda', plan:'Premium', amount:'MK 15,000', date:'2026-07-10', method:'Paychangu', status:'completed' },
    { id:'pay3', user:'Sarah Phiri', plan:'Free', amount:'MK 0', date:'2026-07-15', method:'N/A', status:'free' },
  ],
  features: [
    { id:'ft1', name:'AI Chat Tutor', key:'ai_chat', enabled:true, icon:'💬' },
    { id:'ft2', name:'Flashcard Studio', key:'flashcards', enabled:true, icon:'🎴' },
    { id:'ft3', name:'Quiz Engine', key:'quiz', enabled:true, icon:'⚡' },
    { id:'ft4', name:'Smart Notes', key:'notes', enabled:true, icon:'📝' },
    { id:'ft5', name:'Study Planner', key:'planner', enabled:true, icon:'📅' },
    { id:'ft6', name:'Analytics', key:'analytics', enabled:true, icon:'📊' },
    { id:'ft7', name:'Leaderboard', key:'leaderboard', enabled:true, icon:'🏆' },
    { id:'ft8', name:'Phonk Study Music', key:'study_music', enabled:false, icon:'🎵' },
    { id:'ft9', name:'Community Forum', key:'forum', enabled:false, icon:'👥' },
  ],
  coupons: [
    { id:'cp1', code:'WELCOME50', discount:'50%', uses:42, maxUses:100, expiry:'2026-08-31', status:'active' },
    { id:'cp2', code:'BACK2SCHOOL', discount:'30%', uses:18, maxUses:200, expiry:'2026-09-15', status:'active' },
  ],
  faqs: [
    { id:'f1', question:'How do I upgrade to Premium?', answer:'Go to Settings > Subscription.', category:'Billing', status:'published' },
    { id:'f2', question:'Can I use Ngoms AI offline?', answer:'Requires internet. Offline coming soon!', category:'Technical', status:'published' },
    { id:'f3', question:'How many subjects can I study?', answer:'Free: 3. Premium: unlimited.', category:'General', status:'published' },
  ],
  testimonials: [
    { id:'t1', name:'Thandiwe M.', role:'Student, Chancellor College', text:'Ngoms AI helped me pass biology!', rating:5, status:'published' },
    { id:'t2', name:'Prof. Mwale', role:'Lecturer, UNIMA', text:'Saves hours every week on quiz creation.', rating:5, status:'published' },
  ],
  logs: [
    { id:'log1', action:'Admin login', user:'daviehackez@gmail.com', time:'2026-07-19 08:00', level:'info' },
    { id:'log2', action:'New user registered', user:'Mary Nkhoma', time:'2026-07-18 14:23', level:'info' },
    { id:'log3', action:'Payment received', user:'Davie Kuminga', time:'2026-07-16 09:15', level:'success' },
    { id:'log4', action:'Failed login attempt', user:'unknown', time:'2026-07-18 03:11', level:'warning' },
  ],
  appSettings: {
    appName:'Ngoms AI', tagline:'Learn Smarter. Not Harder.',
    primaryColor:'#3B82F6', accentColor:'#7C3AED',
    maintenanceMode:false, maintenanceMessage:'We are upgrading Ngoms AI. Back soon!',
    maxFileSize:'10', aiQueryLimit:'50', supportEmail:'support@ngoms.ai', version:'1.0.0',
  },
  messages: [
    { id:'m1', name:'Grace T.', email:'grace@example.com', subject:'Cannot access flashcards', body:'Error when opening deck.', date:'2026-07-18', status:'open' },
    { id:'m2', name:'Peter K.', email:'peter@example.com', subject:'Payment issue', body:'Charged twice for premium.', date:'2026-07-17', status:'resolved' },
  ],
  adminSession: null,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    return { ...defaultData, ...JSON.parse(raw) }
  } catch { return defaultData }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {} }, [state])

  const create = useCallback((col, item) => setState(s => ({ ...s, [col]: [...s[col], { ...item, id: Date.now().toString() }] })), [])
  const update = useCallback((col, id, patch) => setState(s => ({ ...s, [col]: s[col].map(x => x.id === id ? { ...x, ...patch } : x) })), [])
  const remove = useCallback((col, id) => setState(s => ({ ...s, [col]: s[col].filter(x => x.id !== id) })), [])
  const setBanner = useCallback((b) => setState(s => ({ ...s, banner: { ...s.banner, ...b } })), [])
  const setSettings = useCallback((p) => setState(s => ({ ...s, appSettings: { ...s.appSettings, ...p } })), [])
  const adminLogin = useCallback((email, pass) => {
    if (email === 'daviehackez@gmail.com' && pass === 'admin2007') {
      setState(s => ({ ...s, adminSession: { email, loginAt: new Date().toISOString() }, logs: [{ id: Date.now().toString(), action: 'Admin login', user: email, time: new Date().toLocaleString(), level: 'info' }, ...s.logs] }))
      return true
    }
    return false
  }, [])
  const adminLogout = useCallback(() => setState(s => ({ ...s, adminSession: null })), [])
  const toggleFeature = useCallback((id) => setState(s => ({ ...s, features: s.features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f) })), [])
  const pushNotification = useCallback((n) => setState(s => ({ ...s, notifications: [{ ...n, id: Date.now().toString(), date: new Date().toISOString().split('T')[0], sent: s.users.length, status: 'sent' }, ...s.notifications] })), [])

  return <AppCtx.Provider value={{ ...state, create, update, remove, setBanner, setSettings, adminLogin, adminLogout, toggleFeature, pushNotification }}>{children}</AppCtx.Provider>
}
