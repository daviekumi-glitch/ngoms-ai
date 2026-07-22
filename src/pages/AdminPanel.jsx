import { useState } from 'react'
import {
  ShieldCheck, BookOpen, Layers, Zap, FileText, CreditCard,
  Bell, Megaphone, ToggleLeft, Plus, Trash2, Edit3, Check, X,
  ChevronRight, ChevronLeft, Save
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const COLLECTIONS = [
  { key: 'courses',        label: 'Courses',         icon: BookOpen,   color: 'text-brand bg-brand-soft' },
  { key: 'flashcardDecks', label: 'Flashcard Decks', icon: Layers,     color: 'text-violet-500 bg-violet-50' },
  { key: 'quizzes',        label: 'Quizzes',         icon: Zap,        color: 'text-amber-500 bg-amber-50' },
  { key: 'documents',      label: 'Documents',       icon: FileText,   color: 'text-emerald-500 bg-green-50' },
  { key: 'plans',          label: 'Plans',           icon: CreditCard, color: 'text-pink-500 bg-pink-50' },
  { key: 'notifications',  label: 'Notifications',   icon: Bell,       color: 'text-sky-500 bg-sky-50' },
  { key: 'announcements',  label: 'Announcements',   icon: Megaphone,  color: 'text-orange-500 bg-orange-50' },
  { key: 'features',       label: 'Feature Toggles', icon: ToggleLeft, color: 'text-indigo-500 bg-indigo-50' },
]

// Simple field editor
function FieldEditor({ record, onSave, onCancel }) {
  const systemKeys = new Set(['id', 'created_date', 'updated_date', 'created_by'])
  const initFields = Object.entries(record || {})
    .filter(([k]) => !systemKeys.has(k))
    .map(([k, v]) => ({ k, v: typeof v === 'object' ? JSON.stringify(v) : String(v ?? '') }))

  const [fields, setFields] = useState(initFields)
  const [newK, setNewK]     = useState('')
  const [newV, setNewV]     = useState('')

  const submit = () => {
    const obj = {}
    fields.forEach(({ k, v }) => {
      if (!k) return
      try { obj[k] = JSON.parse(v) } catch { obj[k] = v }
    })
    onSave(obj)
  }

  return (
    <div className="space-y-3">
      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
        {fields.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-xs font-mono text-ink-muted w-28 shrink-0 truncate">{row.k}</span>
            <input
              className="input text-xs py-2 flex-1"
              value={row.v}
              onChange={e => setFields(f => f.map((r, j) => j === i ? { ...r, v: e.target.value } : r))}
            />
            <button onClick={() => setFields(f => f.filter((_, j) => j !== i))} className="text-danger shrink-0">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add field */}
      <div className="flex gap-2 pt-1 border-t border-surface-border">
        <input className="input text-xs py-2 w-28" placeholder="field" value={newK} onChange={e => setNewK(e.target.value)} />
        <input className="input text-xs py-2 flex-1"  placeholder="value"  value={newV} onChange={e => setNewV(e.target.value)} />
        <button
          onClick={() => { if (newK.trim()) { setFields(f => [...f, { k: newK.trim(), v: newV }]); setNewK(''); setNewV('') } }}
          className="btn-ghost text-xs px-3 py-2 shrink-0"
        >+ Add</button>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={submit} className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5">
          <Save size={13} /> Save
        </button>
        <button onClick={onCancel} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const { isAdmin, data, create, update, remove } = useApp()
  const [activeKey, setActiveKey] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding]       = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  if (!isAdmin) return (
    <div className="px-5 pt-12 pb-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <ShieldCheck size={28} className="text-danger" />
      </div>
      <h2 className="text-xl font-black text-ink mb-2">Admin Access Only</h2>
      <p className="text-sm text-ink-muted">Set your admin email in Profile to unlock this.</p>
    </div>
  )

  const activeCol  = COLLECTIONS.find(c => c.key === activeKey)
  const records    = (activeKey ? (data?.[activeKey] || []) : [])

  const handleSave = async (obj, id) => {
    if (id) {
      await update(activeKey === 'flashcardDecks' ? 'flashcards' : activeKey, id, obj)
      toast.success('Record updated')
    } else {
      await create(activeKey === 'flashcardDecks' ? 'flashcards' : activeKey, obj)
      toast.success('Record created')
    }
    setEditingId(null); setAdding(false)
  }

  const handleDelete = async (id) => {
    await remove(activeKey === 'flashcardDecks' ? 'flashcards' : activeKey, id)
    setConfirmId(null)
    toast.success('Deleted')
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {activeKey && (
          <button onClick={() => { setActiveKey(null); setAdding(false); setEditingId(null) }} className="w-9 h-9 rounded-xl bg-surface-soft border border-surface-border flex items-center justify-center">
            <ChevronLeft size={17} className="text-ink" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-black text-ink">
            {activeKey ? activeCol?.label : 'Admin Panel'}
          </h1>
          <p className="text-sm text-ink-muted">
            {activeKey ? `${records.length} records` : 'Manage platform content'}
          </p>
        </div>
        {activeKey && (
          <button onClick={() => setAdding(true)} className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1.5">
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      {/* Collection list */}
      {!activeKey && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {COLLECTIONS.slice(0, 4).map(c => (
              <div key={c.key} className="bg-white rounded-2xl p-4 border border-surface-border shadow-card">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${c.color}`}>
                  <c.icon size={16} />
                </div>
                <p className="text-xl font-black text-ink">{(data?.[c.key] || []).length}</p>
                <p className="text-xs text-ink-muted mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {COLLECTIONS.map(c => (
              <button
                key={c.key}
                onClick={() => setActiveKey(c.key)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card active:scale-[0.99] hover:shadow-card-hover transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                  <c.icon size={17} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{c.label}</p>
                  <p className="text-xs text-ink-muted">{(data?.[c.key] || []).length} records</p>
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
          {adding && (
            <div className="card mb-4 animate-slide-up">
              <p className="font-bold text-ink mb-3">New Record</p>
              <FieldEditor record={null} onSave={obj => handleSave(obj)} onCancel={() => setAdding(false)} />
            </div>
          )}

          {records.length === 0 && !adding ? (
            <div className="text-center py-12 text-ink-muted">
              <p className="font-semibold">No records yet</p>
              <p className="text-sm mt-1">Click Add to create one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-4 border border-surface-border shadow-card">
                  {editingId === r.id ? (
                    <>
                      <p className="font-bold text-ink mb-3 text-sm">Editing Record</p>
                      <FieldEditor record={r} onSave={obj => handleSave(obj, r.id)} onCancel={() => setEditingId(null)} />
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-bold text-sm text-ink line-clamp-1">
                          {r.title || r.name || r.key || `#${(r.id || '').slice(0, 8)}`}
                        </p>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => setEditingId(r.id)} className="w-7 h-7 rounded-lg bg-brand-soft flex items-center justify-center text-brand">
                            <Edit3 size={11} />
                          </button>
                          {confirmId === r.id ? (
                            <>
                              <button onClick={() => handleDelete(r.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-danger">
                                <Check size={11} />
                              </button>
                              <button onClick={() => setConfirmId(null)} className="w-7 h-7 rounded-lg bg-surface-soft flex items-center justify-center text-ink-muted">
                                <X size={11} />
                              </button>
                            </>
                          ) : (
                            <button onClick={() => setConfirmId(r.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-danger">
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(r)
                          .filter(([k]) => !['id','created_date','updated_date','created_by'].includes(k))
                          .slice(0, 6)
                          .map(([k, v]) => (
                            <span key={k} className="text-[10px] bg-surface-soft text-ink-muted px-2 py-0.5 rounded-lg font-mono max-w-[140px] truncate">
                              {k}: {typeof v === 'object' ? '[obj]' : String(v).slice(0, 24)}
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
    </div>
  )
}
