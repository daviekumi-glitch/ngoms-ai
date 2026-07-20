import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

const API_URL = 'https://vesper-ecdb8354.base44.app/functions/ngomsApi'

async function api(action, extra = {}) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...extra }),
    })
    const json = await res.json()
    return json
  } catch (err) {
    console.error('API error:', err)
    return { success: false, error: err.message }
  }
}

// Load user profile from localStorage
function loadUser() {
  const saved = localStorage.getItem('ngoms_user')
  if (saved) return JSON.parse(saved)
  return {
    name: 'Davie Kuminga',
    email: 'daviekumi@gmail.com',
    phone: '+265 991 234 567',
    bio: 'Student at University of Malawi. Passionate about AI and education.',
    plan: 'Premium',
    role: 'Student',
    xp: 2840,
    streak: 7,
  }
}

export function AppProvider({ children }) {
  const [data, setData] = useState({
    banner: null, appSettings: null, features: [], announcements: [],
    notifications: [], plans: [], leaderboard: [], badges: [],
    courses: [], quizzes: [], flashcardDecks: [], documents: [],
    payments: [], coupons: [], faqs: [], testimonials: [],
    logs: [], messages: [],
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(loadUser)

  const refresh = useCallback(async () => {
    setLoading(true)
    const res = await api('get_app_config')
    if (res.success) {
      setData({
        banner: res.banner, appSettings: res.appSettings,
        features: res.features, announcements: res.announcements,
        notifications: res.notifications, plans: res.plans,
        leaderboard: res.leaderboard, badges: res.badges,
        courses: res.courses, quizzes: res.quizzes,
        flashcardDecks: res.flashcardDecks, documents: res.documents,
        payments: res.payments, coupons: res.coupons,
        faqs: res.faqs, testimonials: res.testimonials,
        logs: res.logs, messages: res.messages,
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // CRUD operations (used by features like documents, notes etc.)
  const create = useCallback(async (col, item) => {
    const res = await api('create', { collection: col, data: item })
    if (res.success) {
      const stateKey = col === 'flashcards' ? 'flashcardDecks' : col
      setData(s => ({ ...s, [stateKey]: [...(s[stateKey] || []), res.data] }))
      return res.data
    }
    return null
  }, [])

  const update = useCallback(async (col, id, patch) => {
    const res = await api('update', { collection: col, id, data: patch })
    if (res.success) {
      const stateKey = col === 'flashcards' ? 'flashcardDecks' : col
      setData(s => ({ ...s, [stateKey]: (s[stateKey] || []).map(x => x.id === id ? { ...x, ...patch } : x) }))
    }
  }, [])

  const remove = useCallback(async (col, id) => {
    const res = await api('delete', { collection: col, id })
    if (res.success) {
      const stateKey = col === 'flashcards' ? 'flashcardDecks' : col
      setData(s => ({ ...s, [stateKey]: (s[stateKey] || []).filter(x => x.id !== id) }))
    }
  }, [])

  const setBanner = useCallback(async (b) => {
    if (data.banner?.id) {
      await update('banner', data.banner.id, b)
      setData(s => ({ ...s, banner: { ...s.banner, ...b } }))
    } else {
      const created = await create('banner', b)
      setData(s => ({ ...s, banner: created }))
    }
  }, [data.banner, update, create])

  const setSettings = useCallback(async (p) => {
    if (data.appSettings?.id) {
      await update('settings', data.appSettings.id, p)
      setData(s => ({ ...s, appSettings: { ...s.appSettings, ...p } }))
    } else {
      const created = await create('settings', p)
      setData(s => ({ ...s, appSettings: created }))
    }
  }, [data.appSettings, update, create])

  const toggleFeature = useCallback(async (id) => {
    const f = data.features.find(ft => ft.id === id)
    if (f) {
      await update('features', id, { enabled: !f.enabled })
    }
  }, [data.features, update])

  const pushNotification = useCallback(async (n) => {
    await create('notifications', { ...n, date: new Date().toISOString().split('T')[0], sent: 1, status: 'sent' })
  }, [create])

  const isFeatureEnabled = useCallback((key) => {
    if (!key) return true
    const f = data.features?.find(ft => ft.key === key)
    return f ? f.enabled : true
  }, [data.features])

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem('ngoms_user', JSON.stringify(next))
      return next
    })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('ngoms_user')
    localStorage.removeItem('ngoms_prefs')
    localStorage.removeItem('ngoms_notes')
    localStorage.removeItem('ngoms_planner')
    setUser(loadUser())
  }, [])

  return (
    <AppCtx.Provider value={{
      ...data, loading, user,
      create, update, remove, setBanner, setSettings,
      toggleFeature, pushNotification,
      isFeatureEnabled, refresh, updateUser, signOut,
    }}>
      {children}
    </AppCtx.Provider>
  )
}
