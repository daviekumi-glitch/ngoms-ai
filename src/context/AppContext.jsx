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

export function AppProvider({ children }) {
  const [data, setData] = useState({
    banner: null, appSettings: null, features: [], announcements: [],
    notifications: [], plans: [], leaderboard: [], badges: [],
    courses: [], quizzes: [], flashcardDecks: [], documents: [],
    payments: [], coupons: [], faqs: [], testimonials: [],
    logs: [], messages: [],
  })
  const [loading, setLoading] = useState(true)
  const [adminSession, setAdminSession] = useState(null)

  // Fetch all data from backend on mount
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

  // CRUD operations that call the real backend
  const create = useCallback(async (col, item) => {
    const res = await api('create', { collection: col, data: item })
    if (res.success) {
      setData(s => ({ ...s, [col]: [...(s[col] || []), res.data] }))
      return res.data
    }
  }, [])

  const update = useCallback(async (col, id, patch) => {
    const res = await api('update', { collection: col, id, data: patch })
    if (res.success) {
      setData(s => ({ ...s, [col]: (s[col] || []).map(x => x.id === id ? { ...x, ...patch } : x) }))
    }
  }, [])

  const remove = useCallback(async (col, id) => {
    const res = await api('delete', { collection: col, id })
    if (res.success) {
      setData(s => ({ ...s, [col]: (s[col] || []).filter(x => x.id !== id) }))
    }
  }, [])

  const setBanner = useCallback(async (b) => {
    if (data.banner?.id) {
      await update('banner', data.banner.id, b)
    } else {
      await create('banner', b)
    }
  }, [data.banner, update, create])

  const setSettings = useCallback(async (p) => {
    if (data.appSettings?.id) {
      await update('settings', data.appSettings.id, p)
    } else {
      await create('settings', p)
    }
  }, [data.appSettings, update, create])

  const adminLogin = useCallback(async (email, pass) => {
    const res = await api('admin_login', { payload: { email, password: pass } })
    if (res.success) {
      setAdminSession(res.session)
      return true
    }
    return false
  }, [])

  const adminLogout = useCallback(() => setAdminSession(null), [])

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

  return (
    <AppCtx.Provider value={{
      ...data, loading, adminSession,
      create, update, remove, setBanner, setSettings,
      adminLogin, adminLogout, toggleFeature, pushNotification,
      isFeatureEnabled, refresh,
    }}>
      {children}
    </AppCtx.Provider>
  )
}
