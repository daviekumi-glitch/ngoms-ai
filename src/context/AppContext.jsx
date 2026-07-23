import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchAll, createRecord, updateRecord, deleteRecord } from '../lib/api'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

const ADMIN_PIN = '1234'

function loadUser() {
  try {
    const saved = localStorage.getItem('ngoms_user')
    if (saved) return JSON.parse(saved)
  } catch {}
  return { name: '', email: '', plan: 'Free', role: 'Student', xp: 0, streak: 0 }
}

const DEFAULT_DATA = {
  banner: null, appSettings: null, features: [], announcements: [],
  notifications: [], plans: [], leaderboard: [], badges: [],
  courses: [], quizzes: [], flashcardDecks: [], documents: [],
  payments: [], coupons: [], faqs: [], testimonials: [],
  logs: [], messages: [],
}

export function AppProvider({ children }) {
  const [data, setData] = useState(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  const [user, setUserState] = useState(loadUser)
  const [adminUnlocked, setAdminUnlocked] = useState(() => {
    try { return localStorage.getItem('ngoms_admin_unlocked') === 'true' } catch { return false }
  })

  const setUser = useCallback((u) => {
    setUserState(u)
    try { localStorage.setItem('ngoms_user', JSON.stringify(u)) } catch {}
  }, [])

  const unlockAdmin = useCallback((pin) => {
    if (pin === ADMIN_PIN) {
      setAdminUnlocked(true)
      try { localStorage.setItem('ngoms_admin_unlocked', 'true') } catch {}
      return true
    }
    return false
  }, [])

  const lockAdmin = useCallback(() => {
    setAdminUnlocked(false)
    try { localStorage.removeItem('ngoms_admin_unlocked') } catch {}
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchAll()
      if (res?.success) setData(prev => ({ ...DEFAULT_DATA, ...prev, ...res }))
    } catch (e) { console.error('fetchAll error:', e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const isFeatureEnabled = useCallback((key) => {
    if (!key) return true
    const feat = (data.features || []).find(f => f.key === key)
    return feat ? feat.enabled !== false : true
  }, [data.features])

  const colKey = (col) => col === 'flashcards' ? 'flashcardDecks' : col

  const create = useCallback(async (col, item) => {
    try {
      const res = await createRecord(col, item)
      if (res?.success && res.data) {
        setData(s => ({ ...s, [colKey(col)]: [...(s[colKey(col)] || []), res.data] }))
        return res.data
      }
    } catch (e) { console.error('create error:', e) }
    return null
  }, [])

  const update = useCallback(async (col, id, patch) => {
    try {
      const res = await updateRecord(col, id, patch)
      if (res?.success) {
        setData(s => ({
          ...s,
          [colKey(col)]: (s[colKey(col)] || []).map(x => x.id === id ? { ...x, ...patch } : x),
        }))
      }
    } catch (e) { console.error('update error:', e) }
  }, [])

  const remove = useCallback(async (col, id) => {
    try {
      const res = await deleteRecord(col, id)
      if (res?.success) {
        setData(s => ({
          ...s,
          [colKey(col)]: (s[colKey(col)] || []).filter(x => x.id !== id),
        }))
      }
    } catch (e) { console.error('remove error:', e) }
  }, [])

  const value = {
    ...data,
    data,
    loading,
    user,
    setUser,
    isAdmin: adminUnlocked,
    unlockAdmin,
    lockAdmin,
    isFeatureEnabled,
    create,
    update,
    remove,
    refresh,
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
