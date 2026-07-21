import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchAll, createRecord, updateRecord, deleteRecord } from '../lib/firebaseApi'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

const ADMIN_EMAILS = ['daviekumi@gmail.com', 'admin@ngoms.ai']

function loadUser() {
  try {
    const saved = localStorage.getItem('ngoms_user')
    if (saved) return JSON.parse(saved)
  } catch {}
  return { name: 'Learner', email: '', plan: 'Free', role: 'Student', xp: 0, streak: 0 }
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

  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase())

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchAll()
      if (res.success) setData(res)
    } catch (e) { console.error('fetchAll failed', e) }
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Persist user changes
  useEffect(() => {
    if (user) localStorage.setItem('ngoms_user', JSON.stringify(user))
  }, [user])

  const isFeatureEnabled = useCallback((key) => {
    if (!key) return true
    const feat = (data.features || []).find(f => f.key === key)
    return feat ? feat.enabled !== false : true
  }, [data.features])

  const create = useCallback(async (col, item) => {
    try {
      const res = await createRecord(col, item)
      if (res.success) {
        const stateKey = col === 'flashcards' ? 'flashcardDecks' : col
        setData(s => ({ ...s, [stateKey]: [...(s[stateKey] || []), res.data] }))
        return res.data
      }
    } catch (e) { console.error('create failed', e) }
    return null
  }, [])

  const update = useCallback(async (col, id, patch) => {
    try {
      const res = await updateRecord(col, id, patch)
      if (res.success) {
        const stateKey = col === 'flashcards' ? 'flashcardDecks' : col
        setData(s => ({ ...s, [stateKey]: (s[stateKey] || []).map(x => x.id === id ? { ...x, ...patch } : x) }))
      }
    } catch (e) { console.error('update failed', e) }
  }, [])

  const remove = useCallback(async (col, id) => {
    try {
      const res = await deleteRecord(col, id)
      if (res.success) {
        const stateKey = col === 'flashcards' ? 'flashcardDecks' : col
        setData(s => ({ ...s, [stateKey]: (s[stateKey] || []).filter(x => x.id !== id) }))
      }
    } catch (e) { console.error('remove failed', e) }
  }, [])

  const value = {
    ...data,
    data,
    loading,
    user,
    setUser,
    isAdmin,
    isFeatureEnabled,
    create,
    update,
    remove,
    refresh,
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
