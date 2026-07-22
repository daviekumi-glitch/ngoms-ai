import { useState } from 'react'
import {
  ShieldCheck, BookOpen, Layers, Zap, FileText, CreditCard,
  Bell, Megaphone, ToggleLeft, Plus, Trash2, Edit3, Check, X,
  ChevronRight, ChevronLeft, Save, Lock, Eye, EyeOff, RefreshCw,
  Settings, Users, BarChart2, Database
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

/* ─── Collections config ─── */
const COLLECTIONS = [
  { key: 'courses',        label: 'Courses',         icon: BookOpen,   color: 'text-brand',      bg: 'bg-brand-soft' },
  { key: 'flashcardDecks', label: 'Flashcard Decks', icon: Layers,     color: 'text-violet-500', bg: 'bg-violet-50' },
  { key: 'quizzes',        label: 'Quizzes',         icon: Zap,        color: 'text-amber-500',  bg: 'bg-amber-50' },
  { key: 'documents',      label: 'Documents',       icon: FileText,   color: 'text-emerald-500',bg: 'bg-green-50' },
  { key: 'plans',          label: 'Plans',           icon: CreditCard, color: 'text-pink-500',   bg: 'bg-pink-50' },
  { key: 'notifications',  label: 'Notifications',   icon: Bell,       color: 'text-sky-500',    bg: 'bg-sky-50' },
  { key: 'announcements',  label: 'Announcements',   icon: Megaphone,  color: 'text-orange-500', bg: 'bg-orange-50' },
  { key: 'features',       label: 'Feature Toggles', icon: ToggleLeft, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { key: 'badges',         label: 'Badges',          icon: ShieldCheck,color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { key: 'faqs',           label: 'FAQs',            icon: FileText,   color: 'text-teal-500',   bg: 'bg-teal-50' },
]

/* ─── PIN login screen ─── */
function AdminLogin({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState(false)

  const tryUnlock = () => {
    const ok = onUnlock(pin)
    if (!ok) { setErr(true); setPin(''); setTimeout(() => setErr(false), 1500) }
  }

  return (
    <div className="px-5 pt-12 pb-6 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm text-center animate-scale-in">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-btn">
          <ShieldCheck size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-ink mb-1">Admin Panel</h1>
        <p className="text-sm text-ink-muted mb-8">Enter your admin PIN to continue</p>

        <div className={`card mb-4 transition-all ${err ? 'border-danger border-2 animate-[shake_0.3s_ease]' : ''}`}>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              className="input text-center text-xl font-bold tracking-widest pr-12"
              placeholder="• • • •"
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && tryUnlock()}
              maxLength={8}
              autoFocus
            />
            <button
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {err && <p className="text-danger text-xs mt-2 font-semibold">Incorrect PIN. Try again.</p>}
        </div>

        <button
          onClick={tryUnlock}
          disabled={!pin.trim()}
          className={`w-full py-4 rounded-3xl font-bold text-base transition-all duration-200 mb-3
            ${pin.trim() ? 'bg-brand text-white shadow-btn active:scale-95' : 'bg-surface-muted text-ink-faint cursor-not-allowed'}`}
        >
          Unlock Admin
        </button>
        <p className="text-xs text-ink-faint">Default PIN is 1234. Change it in settings.</p>
      </div>
    </div>
  )
}

/* ─── Field Editor ─── */
function FieldEditor({ record, onSave, onCancel }) {
  const SYSTEM = new Set(['id', 'created_date', 'updated_date', 'created_by'])
  const init = Object.entries(record || {})
    .filter(([k]) => !SYSTEM.has(k))
    .map(([k, v]) => ({ k, v: typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v ?? '') }))

  const [fields, setFields] = useState(init.length > 0 ? init : [{ k: 'title', v: '' }])
  const [newK, setNewK] = useState('')
  const [newV, setNewV] = useState('')

  const submit = () => {
    const obj = {}
    fields.forEach(({ k, v }) => {
      if (!k.trim()) return
      try { obj[k.trim()] = JSON.parse(v) } catch { obj[k.trim()] = v }
    })
    if (Object.keys(obj).length === 0) { toast.error('Add at least one field'); return }
    onSave(obj)
  }

  return (
    <div className="space-y-3">
      {/* Existing fields */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {fields.map((row, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="w-28 shrink-0">
              <input
                className="input text-xs py-2 font-mono"
                value={row.k}
                onChange={e => setFields(f => f.map((r, j) => j === i ? { ...r, k: e.target.value } : r))}
                placeholder="field"
              />
            </div>
            <input
              className="input text-xs py-2 flex-1"
              value={row.v}
              onChange={e => setFields(f => f.map((r, j) => j === i ? { ...r, v: e.target.value } : r))}
              placeholder="value"
            />
            <button
              onClick={() => setFields(f => f.filter((_, j) => j !== i))}
              className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-danger shrink-0 mt-1"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add new field */}
      <div className="flex gap-2 pt-2 border-t border-surface-border">
        <input className="input text-xs py-2 w-28 font-mono" placeholder="new field" value={newK} onChange={e => setNewK(e.target.value)} />
        <input className="input text-xs py-2 flex-1" placeholder="value" value={newV} onChange={e => setNewV(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newK.trim()) { setFields(f => [...f, { k: newK.trim(), v: newV }]); setNewK(''); setNewV('') }}} />
        <button
          onClick={() => { if (newK.trim()) { setFields(f => [...f, { k: newK.trim(), v: newV }]); setNewK(''); setNewV('') }}}
          className="bg-brand-soft text-brand font-bold text-xs px-3 rounded-xl shrink-0 active:scale-95"
        >Add</button>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={submit} className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-1.5">
          <Save size={13} /> Save
        </button>
        <button onClick={onCancel} className="btn-ghost flex-1 py-3 text-sm">Cancel</button>
      </div>
    </div>
  )
}

/* ─── Feature Toggle Card ─── */
function FeatureToggle({ record, onToggle }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card">
      <div className="text-2xl">{record.icon || '⚙️'}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-ink">{record.name}</p>
        <p className="text-xs font-mono text-ink-muted">{record.key}</p>
      </div>
      <button
        onClick={() => onToggle(record)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${record.enabled !== false ? 'bg-brand' : 'bg-surface-border'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${record.enabled !== false ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

/* ─── Main Admin Panel ─── */
export default function AdminPanel() {
  const { isAdmin, unlockAdmin, lockAdmin, data, create, update, remove, loading, refresh } = useApp()
  const [activeKey, setActiveKey] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding]       = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Guard — show PIN screen if not admin
  if (!isAdmin) return <AdminLogin onUnlock={unlockAdmin} />

  const activeCol = COLLECTIONS.find(c => c.key === activeKey)
  // Safe access — data may still be loading
  const safeData  = data || {}
  const records   = activeKey ? (safeData[activeKey] || []) : []

  const apiCol = (k) => k === 'flashcardDecks' ? 'flashcards' : k

  const handleSave = async (obj, id) => {
    if (!activeKey) return
    try {
      if (id) {
        await update(apiCol(activeKey), id, obj)
        toast.success('Updated ✓')
      } else {
        await create(apiCol(activeKey), obj)
        toast.success('Created ✓')
      }
      setEditingId(null); setAdding(false)
    } catch { toast.error('Save failed') }
  }

  const handleDelete = async (id) => {
    if (!activeKey) return
    try {
      await remove(apiCol(activeKey), id)
      setConfirmId(null)
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  const handleToggleFeature = async (feat) => {
    await update('features', feat.id, { ...feat, enabled: feat.enabled === false ? true : false })
    toast.success(`${feat.name} ${feat.enabled !== false ? 'disabled' : 'enabled'}`)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
    toast.success('Data refreshed')
  }

  const goBack = () => { setActiveKey(null); setAdding(false); setEditingId(null); setConfirmId(null) }

  // Summary stats
  const totalRecords = COLLECTIONS.reduce((acc, c) => acc + (safeData[c.key] || []).length, 0)

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {activeKey && (
          <button onClick={goBack} className="w-9 h-9 rounded-xl bg-surface-soft border border-surface-border flex items-center justify-center shrink-0">
            <ChevronLeft size={17} className="text-ink" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-ink truncate">
            {activeKey ? activeCol?.label : 'Admin Panel'}
          </h1>
          <p className="text-sm text-ink-muted">
            {activeKey ? `${records.length} record${records.length !== 1 ? 's' : ''}` : `${totalRecords} total records`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!activeKey && (
            <button
              onClick={handleRefresh}
              className="w-9 h-9 rounded-xl bg-surface-soft border border-surface-border flex items-center justify-center"
            >
              <RefreshCw size={15} className={`text-ink-secondary ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
          {!activeKey && (
            <button
              onClick={() => { lockAdmin(); toast('Admin locked') }}
              className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center"
              title="Lock admin"
            >
              <Lock size={15} className="text-danger" />
            </button>
          )}
          {activeKey && (
            <button onClick={() => setAdding(true)} className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1.5">
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && !activeKey && (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      )}

      {/* Overview — collection list */}
      {!activeKey && !loading && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {COLLECTIONS.slice(0, 4).map(c => (
              <div key={c.key} className="bg-white rounded-2xl p-4 border border-surface-border shadow-card">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${c.bg}`}>
                  <c.icon size={16} className={c.color} />
                </div>
                <p className="text-2xl font-black text-ink">{(safeData[c.key] || []).length}</p>
                <p className="text-xs text-ink-muted">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Collection buttons */}
          <div className="space-y-2">
            {COLLECTIONS.map(c => (
              <button
                key={c.key}
                onClick={() => setActiveKey(c.key)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card active:scale-[0.99] hover:shadow-card-hover transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}>
                  <c.icon size={17} className={c.color} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{c.label}</p>
                  <p className="text-xs text-ink-muted">{(safeData[c.key] || []).length} records</p>
                </div>
                <ChevronRight size={15} className="text-ink-faint" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Records view */}
      {activeKey && (
        <>
          {/* Add form */}
          {adding && (
            <div className="card mb-4 animate-slide-up">
              <p className="font-bold text-ink mb-3">New {activeCol?.label} Record</p>
              <FieldEditor
                record={null}
                onSave={obj => handleSave(obj)}
                onCancel={() => setAdding(false)}
              />
            </div>
          )}

          {/* Feature toggles get special UI */}
          {activeKey === 'features' ? (
            <div className="space-y-3">
              {records.length === 0 ? (
                <p className="text-center text-ink-muted py-8">No feature flags found</p>
              ) : records.map(r => (
                <FeatureToggle key={r.id} record={r} onToggle={handleToggleFeature} />
              ))}
            </div>
          ) : (
            <>
              {records.length === 0 && !adding ? (
                <div className="flex flex-col items-center py-14 text-center">
                  <Database size={36} className="text-ink-faint mb-3" />
                  <p className="font-semibold text-ink">No records yet</p>
                  <p className="text-sm text-ink-muted mt-1 mb-5">Click Add to create the first one.</p>
                  <button onClick={() => setAdding(true)} className="btn-primary px-8">Add Record</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl p-4 border border-surface-border shadow-card">
                      {editingId === r.id ? (
                        <>
                          <p className="font-bold text-ink mb-3 text-sm">Edit Record</p>
                          <FieldEditor
                            record={r}
                            onSave={obj => handleSave(obj, r.id)}
                            onCancel={() => setEditingId(null)}
                          />
                        </>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-bold text-sm text-ink flex-1 truncate">
                              {r.title || r.name || r.key || r.question || `Record #${String(r.id).slice(-6)}`}
                            </p>
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={() => { setEditingId(r.id); setAdding(false) }}
                                className="w-7 h-7 rounded-lg bg-brand-soft flex items-center justify-center text-brand active:scale-95"
                              >
                                <Edit3 size={11} />
                              </button>
                              {confirmId === r.id ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleDelete(r.id)}
                                    className="w-7 h-7 rounded-lg bg-danger flex items-center justify-center text-white active:scale-95"
                                  >
                                    <Check size={11} />
                                  </button>
                                  <button
                                    onClick={() => setConfirmId(null)}
                                    className="w-7 h-7 rounded-lg bg-surface-muted flex items-center justify-center text-ink-muted active:scale-95"
                                  >
                                    <X size={11} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmId(r.id)}
                                  className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-danger active:scale-95"
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Field preview chips */}
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(r)
                              .filter(([k]) => !['id','created_date','updated_date','created_by'].includes(k))
                              .slice(0, 6)
                              .map(([k, v]) => (
                                <span
                                  key={k}
                                  className="text-[10px] bg-surface-soft text-ink-muted px-2 py-0.5 rounded-lg font-mono max-w-[160px] truncate block"
                                >
                                  {k}: {typeof v === 'object' ? '[obj]' : String(v).slice(0, 28)}
                                </span>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
