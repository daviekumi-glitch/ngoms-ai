import { useState } from 'react'
import {
  ShieldCheck, BookOpen, Layers, Zap, FileText, CreditCard,
  Bell, Megaphone, Users, Settings, ToggleLeft, BarChart2,
  Plus, Trash2, Edit3, Check, X, Save, ChevronRight, AlertTriangle
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const COLLECTIONS = [
  { key: 'courses',       label: 'Courses',           icon: BookOpen,     color: 'text-brand bg-brand-soft' },
  { key: 'flashcardDecks',label: 'Flashcard Decks',   icon: Layers,       color: 'text-violet-500 bg-violet-50' },
  { key: 'quizzes',       label: 'Quizzes',           icon: Zap,          color: 'text-amber-500 bg-amber-50' },
  { key: 'documents',     label: 'Documents',         icon: FileText,     color: 'text-emerald-500 bg-green-50' },
  { key: 'plans',         label: 'Plans',             icon: CreditCard,   color: 'text-pink-500 bg-pink-50' },
  { key: 'notifications', label: 'Notifications',     icon: Bell,         color: 'text-sky-500 bg-sky-50' },
  { key: 'announcements', label: 'Announcements',     icon: Megaphone,    color: 'text-orange-500 bg-orange-50' },
  { key: 'features',      label: 'Feature Toggles',   icon: ToggleLeft,   color: 'text-indigo-500 bg-indigo-50' },
]

function RecordEditor({ record, onSave, onCancel }) {
  const [data, setData] = useState(
    Object.entries(record || {})
      .filter(([k]) => !['id', 'created_date', 'updated_date', 'created_by'].includes(k))
      .map(([k, v]) => ({ k, v: typeof v === 'object' ? JSON.stringify(v) : String(v) }))
  )
  const [newK, setNewK] = useState('')
  const [newV, setNewV] = useState('')

  const save = () => {
    const obj = {}
    data.forEach(({ k, v }) => { try { obj[k] = JSON.parse(v) } catch { obj[k] = v } })
    onSave(obj)
  }

  return (
    <div className="space-y-3">
      <div className="max-h-64 overflow-y-auto space-y-2">
        {data.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-xs font-mono text-ink-muted w-28 shrink-0 truncate">{row.k}</span>
            <input
              className="input text-xs py-2 flex-1"
              value={row.v}
              onChange={e => setData(d => d.map((r, j) => j === i ? { ...r, v: e.target.value } : r))}
            />
            <button onClick={() => setData(d => d.filter((_, j) => j !== i))} className="text-danger">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input text-xs py-2 w-28" placeholder="field" value={newK} onChange={e => setNewK(e.target.value)} />
        <input className="input text-xs py-2 flex-1" placeholder="value" value={newV} onChange={e => setNewV(e.target.value)} />
        <button onClick={() => { if (newK) { setData(d => [...d, { k: newK, v: newV }]); setNewK(''); setNewV('') } }} className="btn-ghost px-3 py-2 text-xs">Add</button>
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="btn-primary flex-1 py-2.5 text-sm"><Save size={13} className="inline mr-1" />Save</button>
        <button onClick={onCancel} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const { isAdmin, data, create, update, remove, appSettings, update: updateCtx } = useApp()
  const [activeCol, setActiveCol] = useState(null)
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  if (!isAdmin) {
    return (
      <div className="px-5 pt-12 pb-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <ShieldCheck size={28} className="text-danger" />
        </div>
        <h2 className="text-xl font-black text-ink mb-2">Admin Only</h2>
        <p className="text-ink-muted text-sm">You don't have admin access.</p>
      </div>
    )
  }

  const col = COLLECTIONS.find(c => c.key === activeCol)
  const records = activeCol ? (data?.[activeCol] || []) : []

  const handleSave = async (obj, id) => {
    if (id) await update(activeCol, id, obj)
    else await create(activeCol, obj)
    setEditing(null); setAdding(false)
  }

  const handleDelete = async (id) => {
    await remove(activeCol, id)
    setDeleteConfirm(null)
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center">
          <ShieldCheck size={20} className="text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink">Admin Panel</h1>
          <p className="text-sm text-ink-muted">Manage platform content</p>
        </div>
      </div>

      {!activeCol ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {COLLECTIONS.slice(0, 4).map(c => (
              <div key={c.key} className="bg-white rounded-2xl p-4 border border-surface-border shadow-card">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${c.color}`}>
                  <c.icon size={16} />
                </div>
                <p className="text-xl font-black text-ink">{(data?.[c.key] || []).length}</p>
                <p className="text-xs text-ink-muted">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Collection list */}
          <div className="space-y-2">
            {COLLECTIONS.map(c => (
              <button
                key={c.key}
                onClick={() => setActiveCol(c.key)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card active:scale-[0.99] hover:shadow-card-hover transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                  <c.icon size={17} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{c.label}</p>
                  <p className="text-xs text-ink-muted">{(data?.[c.key] || []).length} records</p>
                </div>
                <ChevronRight size={16} className="text-ink-faint" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { setActiveCol(null); setEditing(null); setAdding(false) }} className="text-brand font-semibold text-sm flex items-center gap-1">
              ← Back
            </button>
            <button onClick={() => setAdding(true)} className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1.5">
              <Plus size={14} /> Add
            </button>
          </div>

          <h2 className="font-black text-lg text-ink mb-4">{col?.label}</h2>

          {adding && (
            <div className="card mb-4 animate-slide-up">
              <p className="font-bold text-ink mb-3">New Record</p>
              <RecordEditor record={null} onSave={(obj) => handleSave(obj)} onCancel={() => setAdding(false)} />
            </div>
          )}

          {records.length === 0 && !adding ? (
            <div className="text-center py-10 text-ink-muted">No records yet. Click Add to create one.</div>
          ) : (
            <div className="space-y-3">
              {records.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-4 border border-surface-border shadow-card">
                  {editing === r.id ? (
                    <RecordEditor record={r} onSave={(obj) => handleSave(obj, r.id)} onCancel={() => setEditing(null)} />
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-bold text-sm text-ink">{r.title || r.name || r.key || `Record ${r.id?.slice(0, 6)}`}</p>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => setEditing(r.id)} className="w-7 h-7 rounded-lg bg-brand-soft flex items-center justify-center text-brand">
                            <Edit3 size={12} />
                          </button>
                          {deleteConfirm === r.id ? (
                            <>
                              <button onClick={() => handleDelete(r.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-danger"><Check size={12} /></button>
                              <button onClick={() => setDeleteConfirm(null)} className="w-7 h-7 rounded-lg bg-surface-soft flex items-center justify-center text-ink-muted"><X size={12} /></button>
                            </>
                          ) : (
                            <button onClick={() => setDeleteConfirm(r.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-danger">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(r)
                          .filter(([k]) => !['id','created_date','updated_date','created_by'].includes(k))
                          .slice(0, 5)
                          .map(([k, v]) => (
                            <span key={k} className="text-[11px] bg-surface-soft text-ink-muted px-2 py-0.5 rounded-lg font-mono">
                              {k}: {typeof v === 'object' ? '[...]' : String(v).slice(0, 30)}
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
